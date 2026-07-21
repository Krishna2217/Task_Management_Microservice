package com.krishna.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

// the original (pre-gateway) security setup: this service validates JWTs itself. Only used when
// running without the gateway in front of it, e.g. for local testing of this service in isolation.
@Configuration
@Profile("standalone")
public class StandaloneSecurityConfiguration {

    @Autowired
    private jwtTokenValidator jwtTokenValidator;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.sessionManagement(
                management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        ).authorizeHttpRequests(
                authorize -> authorize.requestMatchers("/api/**")
                        .authenticated()
                        .anyRequest()
                        .permitAll()
        ).addFilterBefore(jwtTokenValidator, BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(ApplicationConfiguration.corsConfigurationSource()))
                .httpBasic(Customizer.withDefaults())
                .formLogin(Customizer.withDefaults());
        return http.build();
    }
}
