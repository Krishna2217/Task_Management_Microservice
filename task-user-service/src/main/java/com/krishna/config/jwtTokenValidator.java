package com.krishna.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

// Only used when this service runs without a gateway in front of it (profile "standalone").
// Behind the gateway, JwtAuthenticationGlobalFilter already validated the token and this service
// trusts the X-User-* headers it forwards instead of re-parsing the Authorization header. Here,
// there's no gateway to set those headers, so this filter synthesizes them itself (in addition to
// the SecurityContext) so the same X-User-Email-based controllers work in both modes.
@Component
@Profile("standalone")
public class jwtTokenValidator extends OncePerRequestFilter {
    @Autowired
    private JwtProperties jwtProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String jwt = request.getHeader(JwtConstant.JWT_HEADER);
        if(jwt!=null){
            jwt = jwt.substring(7);
            try {
                SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
                Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
                String email = String.valueOf(claims.get("email"));
                String userId = String.valueOf(claims.get("userId"));
                String role = String.valueOf(claims.get("role"));
                String authorities = String.valueOf(claims.get("authorities"));
                List<GrantedAuthority> auth =  AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
                Authentication authentication = new UsernamePasswordAuthenticationToken(email,null,auth);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                request = new UserHeaderRequestWrapper(request, userId, email, role);
            }catch (Exception e){
                throw  new BadCredentialsException("Invalid token.....");
            }

        }
        filterChain.doFilter(request,response);
    }

    private static class UserHeaderRequestWrapper extends HttpServletRequestWrapper {
        private final String userId;
        private final String email;
        private final String role;

        UserHeaderRequestWrapper(HttpServletRequest request, String userId, String email, String role) {
            super(request);
            this.userId = userId;
            this.email = email;
            this.role = role;
        }

        @Override
        public String getHeader(String name) {
            return switch (name) {
                case "X-User-Id" -> userId;
                case "X-User-Email" -> email;
                case "X-User-Role" -> role;
                default -> super.getHeader(name);
            };
        }

        @Override
        public Enumeration<String> getHeaders(String name) {
            String value = getHeader(name);
            return value != null ? Collections.enumeration(List.of(value)) : super.getHeaders(name);
        }
    }
}
