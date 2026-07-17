package com.krishna.controller;

import com.krishna.modal.RoleChangeRequest;
import com.krishna.modal.User;
import com.krishna.request.ChangePasswordRequest;
import com.krishna.request.RoleChangeRequestDto;
import com.krishna.request.RoleUpdateRequest;
import com.krishna.request.UpdateProfileRequest;
import com.krishna.response.RoleChangeRequestResponse;
import com.krishna.response.UserResponse;
import com.krishna.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
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
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable){
        Page<UserResponse> users = userService.getAllUsers(pageable).map(UserResponse::from);
        return ResponseEntity.ok(users);
    }

    // Update user profile (name only - password changes go through /profile/password)
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody UpdateProfileRequest updatedUser) {
        User user = userService.updateUserProfile(jwt, updatedUser);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // Change password: requires the current password to be supplied and verified
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody ChangePasswordRequest request) throws Exception {
        userService.changePassword(jwt, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    // Delete user profile
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteUserProfile(@RequestHeader("Authorization") String jwt) {
        userService.deleteUserProfile(jwt);
        return ResponseEntity.noContent().build();
    }

    // Admin-only: directly change another user's role
    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody RoleUpdateRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.updateUserRole(id, request.getRole(), jwt);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // Self-service: request a role change, pending admin approval
    @PostMapping("/role-requests")
    public ResponseEntity<RoleChangeRequestResponse> createRoleChangeRequest(
            @RequestBody RoleChangeRequestDto requestDto,
            @RequestHeader("Authorization") String jwt) throws Exception {
        RoleChangeRequest request = userService.createRoleChangeRequest(requestDto.getRequestedRole(), jwt);
        return ResponseEntity.created(URI.create("/api/users/role-requests/mine"))
                .body(RoleChangeRequestResponse.from(request));
    }

    // The current user's own role-change requests
    @GetMapping("/role-requests/mine")
    public ResponseEntity<List<RoleChangeRequestResponse>> getMyRoleChangeRequests(
            @RequestHeader("Authorization") String jwt) {
        return ResponseEntity.ok(userService.getMyRoleChangeRequests(jwt).stream()
                .map(RoleChangeRequestResponse::from).toList());
    }

    // Admin-only: every role-change request in the system
    @GetMapping("/role-requests")
    public ResponseEntity<List<RoleChangeRequestResponse>> getAllRoleChangeRequests(
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(userService.getAllRoleChangeRequests(jwt).stream()
                .map(RoleChangeRequestResponse::from).toList());
    }

    // Admin-only: approve a pending request (applies the new role)
    @PutMapping("/role-requests/{id}/approve")
    public ResponseEntity<RoleChangeRequestResponse> approveRoleChangeRequest(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(RoleChangeRequestResponse.from(userService.reviewRoleChangeRequest(id, "APPROVE", jwt)));
    }

    // Admin-only: reject a pending request
    @PutMapping("/role-requests/{id}/reject")
    public ResponseEntity<RoleChangeRequestResponse> rejectRoleChangeRequest(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(RoleChangeRequestResponse.from(userService.reviewRoleChangeRequest(id, "REJECT", jwt)));
    }
}
