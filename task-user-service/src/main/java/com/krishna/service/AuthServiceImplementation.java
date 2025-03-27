package com.krishna.service;

import com.krishna.config.JwtProvider;
import com.krishna.exception.UserAlreadyExistsException;
import com.krishna.modal.User;
import com.krishna.repository.UserRepository;
import com.krishna.request.LoginRequest;
import com.krishna.response.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImplementation implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerUserServiceImplementation customerUserServiceImplementation;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new user
    @Override
    public AuthResponse registerUser(User user) throws UserAlreadyExistsException {
        // Check if the user already exists
        String email = user.getEmail();
        if (userRepository.findByEmail(email) != null) {
            throw new UserAlreadyExistsException("Email already exists: " + email);
        }

        // Save the new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setFullName(user.getFullName());
        newUser.setRole(user.getRole());
        userRepository.save(newUser);

        // Generate JWT token for the user
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);

        // Return a response
        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Registered successfully");
        response.setStatus("201");
        return response;
    }

    // Authenticate (Login) an existing user
    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Authenticate the user
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate a JWT token
        String token = JwtProvider.generateToken(authentication);

        // Return a response
        AuthResponse response = new AuthResponse();
        response.setJwt(token);
        response.setMessage("Login successfully");
        return response;
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