package com.krishna.controller;

import com.krishna.modal.User;
import com.krishna.response.UserResponse;
import com.krishna.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(@RequestHeader("Authorization") String jwt){
        User user = userService.getUserProfile(jwt);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @GetMapping()
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users.stream().map(UserResponse::from).toList());
    }

    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody User updatedUser) {
        User user = userService.updateUserProfile(jwt, updatedUser);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // Delete user profile
    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteUserProfile(@RequestHeader("Authorization") String jwt) {
        userService.deleteUserProfile(jwt);
        return ResponseEntity.ok("User profile deleted successfully.");
    }
}
