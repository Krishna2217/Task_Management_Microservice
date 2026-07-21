package com.krishna.service;

import com.krishna.modal.RoleChangeRequest;
import com.krishna.modal.User;
import com.krishna.request.UpdateProfileRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

// every "email" param here is the caller's identity, trusted from the X-User-Email header the
// gateway sets after validating the JWT - task-user-service no longer parses tokens itself
// for its own business endpoints (only /auth/** still deals with raw credentials/tokens)
public interface UserService {
    public User getUserProfile(String email);

    Page<User> getAllUsers(Pageable pageable);

    User updateUserProfile(String email, UpdateProfileRequest updatedUser);

    void changePassword(String email, String currentPassword, String newPassword) throws Exception;

    void deleteUserProfile(String email);

    // admin-only: directly set another user's role
    User updateUserRole(Long targetUserId, String newRole, String requesterEmail) throws Exception;

    // self-service: request a role change, pending admin approval
    RoleChangeRequest createRoleChangeRequest(String requestedRole, String email) throws Exception;

    List<RoleChangeRequest> getMyRoleChangeRequests(String email);

    // admin-only: view and act on pending requests
    List<RoleChangeRequest> getAllRoleChangeRequests(String requesterEmail) throws Exception;

    RoleChangeRequest reviewRoleChangeRequest(Long requestId, String action, String requesterEmail) throws Exception;
}
