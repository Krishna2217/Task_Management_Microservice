package com.krishna.service;

import com.krishna.exception.UserAlreadyExistsException;
import com.krishna.request.LoginRequest;
import com.krishna.modal.User;
import com.krishna.response.AuthResponse;

public interface AuthService {
    AuthResponse registerUser(User user) throws UserAlreadyExistsException; // For user signup
    AuthResponse loginUser(LoginRequest loginRequest); // For user signin
}