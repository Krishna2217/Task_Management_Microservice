package com.krishna.service;

import com.krishna.modal.User;

import java.util.List;

public interface UserService {
    public User getUserProfile(String jwt);

    List<User> getAllUsers();
}
