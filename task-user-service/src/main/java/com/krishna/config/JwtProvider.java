package com.krishna.config;

import com.krishna.modal.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtProvider {

    public static final long ACCESS_TOKEN_VALIDITY_MS = 15 * 60 * 1000L;       // 15 minutes
    public static final long REFRESH_TOKEN_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000L; // 7 days

    @Autowired
    private JwtProperties jwtProperties;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    // the gateway's JwtAuthenticationGlobalFilter reads email/userId/role straight off these
    // claims and forwards them as X-User-* headers; "authorities" is kept only for the
    // "standalone" profile's own jwtTokenValidator (no gateway in front of it)
    public String generateAccessToken(User user) {
        Date now = new Date();
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_VALIDITY_MS))
                .claim("email", user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole())
                .claim("authorities", user.getRole())
                .signWith(key())
                .compact();
    }

    // opaque (not a JWT): the client never needs to read it, only present it back at /auth/refresh,
    // and an opaque token can't leak claims if it ever ends up somewhere it shouldn't
    public String generateRefreshToken() {
        return UUID.randomUUID().toString() + UUID.randomUUID();
    }

    public Claims parseClaims(String jwt) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(jwt).getBody();
    }
}
