package com.krishna.service;

import com.krishna.modal.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

// served when USER-SERVICE is down, slow, or the userService circuit breaker is open
@Component
public class UserServiceFallback implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceFallback.class);

    @Override
    public UserDto getUserProfile(String jwt) {
        log.warn("Falling back for USER-SERVICE#getUserProfile; traceId={}", MDC.get("traceId"));
        UserDto fallback = new UserDto();
        fallback.setId(-1L);
        fallback.setRole("UNKNOWN");
        return fallback;
    }
}
