package com.krishna.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

// active whenever this service is NOT running standalone, i.e. reachable only through the
// gateway on the internal Docker network. The gateway already validated the JWT and stripped it;
// there's nothing left here for Spring Security to authenticate, so this just disables the
// machinery (no jwtTokenValidator, no authentication requirement) and leaves CORS/headers alone.
//
// anonymous() must be disabled too: Spring Security's default AnonymousAuthenticationFilter would
// otherwise populate an "anonymousUser" Authentication that passes isAuthenticated(), which
// CurrentUserAuditorAware would then use to query User by that literal email - and issuing that
// query while a User row is already dirty in the same flush triggers Hibernate's auto-flush
// recursively into the same preUpdate callback, blowing the stack. With anonymous() off,
// getAuthentication() is simply null here, exactly as intended.
@Configuration
@Profile("!standalone")
public class GatewayFrontedSecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.sessionManagement(
                management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        ).authorizeHttpRequests(
                authorize -> authorize.anyRequest().permitAll()
        ).csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(ApplicationConfiguration.corsConfigurationSource()))
                .anonymous(anonymous -> anonymous.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable());
        return http.build();
    }
}
