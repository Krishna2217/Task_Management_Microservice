package com.krishna.config;

import org.springframework.cloud.openfeign.CircuitBreakerNameResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignCircuitBreakerConfiguration {

    // maps each Feign client to the short instance name used in resilience4j.circuitbreaker.instances.*
    // (Spring Cloud OpenFeign's default resolver names instances "<client>#<method>(...)", which wouldn't
    // match the hand-configured "userService"/"taskService" instances)
    @Bean
    public CircuitBreakerNameResolver circuitBreakerNameResolver() {
        return (feignClientName, target, method) -> {
            if ("TASK-SERVICE".equalsIgnoreCase(feignClientName)) {
                return "taskService";
            }
            return feignClientName;
        };
    }
}
