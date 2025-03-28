package com.krishna.service;

import com.krishna.modal.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name="USER-SERVICE",url = "http://localhost:8081")
public interface UserService {
    @GetMapping("/api/users/profile") //same api
    public UserDto getUserProfile(@RequestHeader("Authorization") String jwt);
}
