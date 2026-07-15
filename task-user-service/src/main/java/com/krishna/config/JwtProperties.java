package com.krishna.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// externalizes the JWT signing secret so it isn't hardcoded/committed to source control
@Component
public class JwtProperties {

    @Value("${app.jwt.secret}")
    private String secret;

    public String getSecret() {
        return secret;
    }
}
