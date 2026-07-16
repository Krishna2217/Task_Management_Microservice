package com.krishna.service;

import com.krishna.modal.RoleChangeRequest;
import com.krishna.modal.User;

import java.util.List;

public interface UserService {
    public User getUserProfile(String jwt);

    List<User> getAllUsers();

    User updateUserProfile(String jwt, User updatedUser);

    void deleteUserProfile(String jwt);

    // admin-only: directly set another user's role
    User updateUserRole(Long targetUserId, String newRole, String jwt) throws Exception;

    // self-service: request a role change, pending admin approval
    RoleChangeRequest createRoleChangeRequest(String requestedRole, String jwt) throws Exception;

    List<RoleChangeRequest> getMyRoleChangeRequests(String jwt);

    // admin-only: view and act on pending requests
    List<RoleChangeRequest> getAllRoleChangeRequests(String jwt) throws Exception;

    RoleChangeRequest reviewRoleChangeRequest(Long requestId, String action, String jwt) throws Exception;
}
