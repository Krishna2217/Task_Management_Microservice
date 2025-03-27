package com.krishna.controller;

import com.krishna.exception.UserAlreadyExistsException;
import com.krishna.request.LoginRequest;
import com.krishna.response.AuthResponse;
import com.krishna.modal.User;
import com.krishna.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping
    public String hello() {
        return "Hello";
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupUser(@RequestBody User user) throws UserAlreadyExistsException {
        AuthResponse authResponse = authService.registerUser(user);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED); // 201 Created
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signinUser(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.loginUser(loginRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.OK); // 200 OK
    }
}