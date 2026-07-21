package com.krishna.service;

import com.krishna.exception.UserAlreadyExistsException;
import com.krishna.request.LoginRequest;
import com.krishna.request.SignupRequest;
import com.krishna.response.AuthResponse;

public interface AuthService {
    AuthResponse registerUser(SignupRequest request) throws UserAlreadyExistsException; // For user signup
    AuthResponse loginUser(LoginRequest loginRequest); // For user signin
    AuthResponse refreshToken(String refreshToken); // rotates a refresh token for a new access+refresh pair
    void logout(String accessToken, String refreshToken); // blacklists the access token and revokes the refresh token
}
