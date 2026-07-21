package com.krishna.controller;

import com.krishna.exception.UserAlreadyExistsException;
import com.krishna.request.LoginRequest;
import com.krishna.request.RefreshTokenRequest;
import com.krishna.request.SignupRequest;
import com.krishna.response.AuthResponse;
import com.krishna.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

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
    public ResponseEntity<AuthResponse> signupUser(@Valid @RequestBody SignupRequest request) throws UserAlreadyExistsException {
        AuthResponse authResponse = authService.registerUser(request);
        // the newly created user's own profile, fetchable with the jwt this response includes
        return ResponseEntity.created(URI.create("/api/users/profile")).body(authResponse);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signinUser(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.loginUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }

    // both tokens are optional here: a caller might only still have one of the two by the time
    // they log out, and logout should succeed either way rather than erroring
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @RequestBody(required = false) RefreshTokenRequest request) {
        String accessToken = (jwt != null && jwt.startsWith("Bearer ")) ? jwt.substring(7) : null;
        String refreshToken = request != null ? request.getRefreshToken() : null;
        authService.logout(accessToken, refreshToken);
        return ResponseEntity.noContent().build();
    }
}