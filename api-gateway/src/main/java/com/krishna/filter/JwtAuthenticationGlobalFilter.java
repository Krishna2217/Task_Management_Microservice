package com.krishna.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishna.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Validates every request at the edge so downstream services never see a raw JWT: on success the
// Authorization header is stripped and replaced with X-User-Id/X-User-Email/X-User-Role, which
// every controller now trusts as already-authenticated identity.
@Component
public class JwtAuthenticationGlobalFilter implements GlobalFilter, Ordered {

    private static final List<String> SKIP_PREFIXES = List.of("/auth/", "/actuator/");

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private ReactiveStringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private SecretKey key() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        if (SKIP_PREFIXES.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing bearer token");
        }

        Claims claims;
        try {
            claims = Jwts.parserBuilder().setSigningKey(key()).build()
                    .parseClaimsJws(authHeader.substring(7)).getBody();
        } catch (JwtException | IllegalArgumentException e) {
            return unauthorized(exchange, "Invalid or expired token");
        }

        String jti = claims.getId();
        Mono<Boolean> isBlacklisted = jti != null
                ? redisTemplate.hasKey("blacklist:" + jti)
                : Mono.just(false);

        return isBlacklisted.flatMap(blacklisted -> {
            if (Boolean.TRUE.equals(blacklisted)) {
                return unauthorized(exchange, "Token has been revoked");
            }
            ServerHttpRequest mutated = exchange.getRequest().mutate()
                    .headers(headers -> {
                        headers.remove(HttpHeaders.AUTHORIZATION);
                        headers.set("X-User-Id", String.valueOf(claims.get("userId")));
                        headers.set("X-User-Email", String.valueOf(claims.get("email")));
                        headers.set("X-User-Role", String.valueOf(claims.get("role")));
                    })
                    .build();
            return chain.filter(exchange.mutate().request(mutated).build());
        });
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String detail) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_PROBLEM_JSON);

        Map<String, Object> problem = new LinkedHashMap<>();
        problem.put("type", "about:blank");
        problem.put("title", "Unauthorized");
        problem.put("status", 401);
        problem.put("detail", detail);
        problem.put("errorCode", "UNAUTHENTICATED");
        problem.put("timestamp", Instant.now().toString());
        problem.put("path", exchange.getRequest().getURI().getPath());

        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(problem);
        } catch (Exception e) {
            bytes = ("{\"title\":\"Unauthorized\",\"detail\":\"" + detail + "\"}").getBytes();
        }
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        // after logging/tracing (which run at very high precedence), before NettyRoutingFilter
        // (Ordered.LOWEST_PRECEDENCE - 1)
        return -1;
    }
}
