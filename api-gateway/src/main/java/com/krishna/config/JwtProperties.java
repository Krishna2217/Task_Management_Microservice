package com.krishna.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// must be the exact same secret task-user-service signs tokens with (app.jwt.secret / JWT_SECRET env var)
@Component
public class JwtProperties {

    @Value("${app.jwt.secret}")
    private String secret;

    public String getSecret() {
        return secret;
    }
}
