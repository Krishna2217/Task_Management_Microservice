package com.krishna.service;

import com.krishna.modal.UserDto;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name="USER-SERVICE", fallback = UserServiceFallback.class)
public interface UserService {
    @Retry(name = "userService")
    @Bulkhead(name = "userService")
    @GetMapping("/api/users/profile") //same api
    public UserDto getUserProfile(@RequestHeader("Authorization") String jwt);
}
