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

// every method here trusts X-User-Email, set by the gateway's JwtAuthenticationGlobalFilter after
// it validates the caller's JWT - the raw Authorization header never reaches this service anymore
@RestController
@RequestMapping("api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(@RequestHeader("X-User-Email") String email){
        User user = userService.getUserProfile(email);
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
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody UpdateProfileRequest updatedUser) {
        User user = userService.updateUserProfile(email, updatedUser);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // Change password: requires the current password to be supplied and verified
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("X-User-Email") String email,
            @Valid @RequestBody ChangePasswordRequest request) throws Exception {
        userService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    // Delete user profile
    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteUserProfile(@RequestHeader("X-User-Email") String email) {
        userService.deleteUserProfile(email);
        return ResponseEntity.noContent().build();
    }

    // Admin-only: directly change another user's role
    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody RoleUpdateRequest request,
            @RequestHeader("X-User-Email") String email) throws Exception {
        User user = userService.updateUserRole(id, request.getRole(), email);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // Self-service: request a role change, pending admin approval
    @PostMapping("/role-requests")
    public ResponseEntity<RoleChangeRequestResponse> createRoleChangeRequest(
            @RequestBody RoleChangeRequestDto requestDto,
            @RequestHeader("X-User-Email") String email) throws Exception {
        RoleChangeRequest request = userService.createRoleChangeRequest(requestDto.getRequestedRole(), email);
        return ResponseEntity.created(URI.create("/api/users/role-requests/mine"))
                .body(RoleChangeRequestResponse.from(request));
    }

    // The current user's own role-change requests
    @GetMapping("/role-requests/mine")
    public ResponseEntity<List<RoleChangeRequestResponse>> getMyRoleChangeRequests(
            @RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(userService.getMyRoleChangeRequests(email).stream()
                .map(RoleChangeRequestResponse::from).toList());
    }

    // Admin-only: every role-change request in the system
    @GetMapping("/role-requests")
    public ResponseEntity<List<RoleChangeRequestResponse>> getAllRoleChangeRequests(
            @RequestHeader("X-User-Email") String email) throws Exception {
        return ResponseEntity.ok(userService.getAllRoleChangeRequests(email).stream()
                .map(RoleChangeRequestResponse::from).toList());
    }

    // Admin-only: approve a pending request (applies the new role)
    @PutMapping("/role-requests/{id}/approve")
    public ResponseEntity<RoleChangeRequestResponse> approveRoleChangeRequest(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String email) throws Exception {
        return ResponseEntity.ok(RoleChangeRequestResponse.from(userService.reviewRoleChangeRequest(id, "APPROVE", email)));
    }

    // Admin-only: reject a pending request
    @PutMapping("/role-requests/{id}/reject")
    public ResponseEntity<RoleChangeRequestResponse> rejectRoleChangeRequest(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String email) throws Exception {
        return ResponseEntity.ok(RoleChangeRequestResponse.from(userService.reviewRoleChangeRequest(id, "REJECT", email)));
    }
}
