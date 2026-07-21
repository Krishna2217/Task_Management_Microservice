package com.krishna.service;

import com.krishna.config.JwtProvider;
import com.krishna.exception.InvalidRefreshTokenException;
import com.krishna.exception.UserAlreadyExistsException;
import com.krishna.modal.RefreshToken;
import com.krishna.modal.User;
import com.krishna.repository.RefreshTokenRepository;
import com.krishna.repository.UserRepository;
import com.krishna.request.LoginRequest;
import com.krishna.request.SignupRequest;
import com.krishna.response.AuthResponse;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class AuthServiceImplementation implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImplementation.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private CustomerUserServiceImplementation customerUserServiceImplementation;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private StringRedisTemplate redisTemplate;

    // Register a new user
    @Override
    public AuthResponse registerUser(SignupRequest request) throws UserAlreadyExistsException {
        // Check if the user already exists
        String email = request.getEmail();
        if (userRepository.findByEmail(email) != null) {
            throw new UserAlreadyExistsException("Email already exists: " + email);
        }

        // Save the new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setFullName(request.getFullName());
        // ignore any role submitted at signup; everyone starts as ROLE_USER and only an admin can promote them
        newUser.setRole("ROLE_USER");
        userRepository.save(newUser);

        return issueTokenPair(newUser, "Registered successfully", "201");
    }

    // Authenticate (Login) an existing user
    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Authenticate the user
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(username);
        return issueTokenPair(user, "Login successfully", null);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String hash = hash(refreshToken);
        RefreshToken existing = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token not recognized"));

        if (existing.isRevoked()) {
            throw new InvalidRefreshTokenException("Refresh token has been revoked");
        }
        if (existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidRefreshTokenException("Refresh token has expired");
        }

        // rotate: the presented token is single-use from here on
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        User user = userRepository.findById(existing.getUserId())
                .orElseThrow(() -> new InvalidRefreshTokenException("User no longer exists"));
        return issueTokenPair(user, "Token refreshed", null);
    }

    @Override
    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null) {
            try {
                Claims claims = jwtProvider.parseClaims(accessToken);
                long remainingMs = claims.getExpiration().getTime() - System.currentTimeMillis();
                if (remainingMs > 0) {
                    redisTemplate.opsForValue().set("blacklist:" + claims.getId(), "1", Duration.ofMillis(remainingMs));
                }
            } catch (Exception e) {
                log.warn("Logout presented an already-invalid access token; nothing to blacklist");
            }
        }
        if (refreshToken != null) {
            refreshTokenRepository.findByTokenHash(hash(refreshToken))
                    .ifPresent(token -> {
                        token.setRevoked(true);
                        refreshTokenRepository.save(token);
                    });
        }
    }

    private AuthResponse issueTokenPair(User user, String message, String status) {
        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshToken = jwtProvider.generateRefreshToken();

        RefreshToken tokenEntity = new RefreshToken();
        tokenEntity.setUserId(user.getId());
        tokenEntity.setTokenHash(hash(refreshToken));
        tokenEntity.setExpiresAt(LocalDateTime.now().plusNanos(JwtProvider.REFRESH_TOKEN_VALIDITY_MS * 1_000_000));
        tokenEntity.setRevoked(false);
        refreshTokenRepository.save(tokenEntity);

        AuthResponse response = new AuthResponse();
        response.setJwt(accessToken);
        response.setRefreshToken(refreshToken);
        response.setMessage(message);
        response.setStatus(status);
        return response;
    }

    private static String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : bytes) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    // Private method to handle user authentication
    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserServiceImplementation.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username or password");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // Create and return the authentication object
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
