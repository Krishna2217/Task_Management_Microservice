package com.krishna.service;

import com.krishna.modal.User;

public interface UserService {
    public User getUserProfile(String jwt);
}
