package com.krishna.config;

import org.springframework.cloud.openfeign.CircuitBreakerNameResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignCircuitBreakerConfiguration {

    // maps each Feign client to the short instance name used in resilience4j.circuitbreaker.instances.*
    // (Spring Cloud OpenFeign's default resolver names instances "<client>#<method>(...)", which wouldn't
    // match a single hand-configured "userService" instance)
    @Bean
    public CircuitBreakerNameResolver circuitBreakerNameResolver() {
        return (feignClientName, target, method) -> {
            if ("USER-SERVICE".equalsIgnoreCase(feignClientName)) {
                return "userService";
            }
            return feignClientName;
        };
    }
}
