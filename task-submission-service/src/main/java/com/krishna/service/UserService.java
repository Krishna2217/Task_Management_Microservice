package com.krishna.service;

import com.krishna.modal.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

// no hardcoded url: resolve USER-SERVICE via Eureka so this works across hosts/containers, not just localhost:8081
@FeignClient(name="USER-SERVICE")
public interface UserService {
    @GetMapping("/api/users/profile") //same api
    public UserDto getUserProfile(@RequestHeader("Authorization") String jwt);
}
