package com.krishna.config;

public class JwtConstant {

    // secret moved to JwtProperties (backed by app.jwt.secret / JWT_SECRET env var) so it isn't hardcoded in source
    public static final String JWT_HEADER = "Authorization";
}
