package com.krishna.controller;

import com.krishna.modal.User;
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
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt){
        User user = userService.getUserProfile(jwt);
        return ResponseEntity.ok(user);
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody User updatedUser) {
        User user = userService.updateUserProfile(jwt, updatedUser);
        return ResponseEntity.ok(user);
    }

    // Delete user profile
    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteUserProfile(@RequestHeader("Authorization") String jwt) {
        userService.deleteUserProfile(jwt);
        return ResponseEntity.ok("User profile deleted successfully.");
    }
}
