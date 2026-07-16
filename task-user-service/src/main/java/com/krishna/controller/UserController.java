package com.krishna.controller;

import com.krishna.modal.RoleChangeRequest;
import com.krishna.modal.User;
import com.krishna.request.RoleChangeRequestDto;
import com.krishna.request.RoleUpdateRequest;
import com.krishna.response.UserResponse;
import com.krishna.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users.stream().map(UserResponse::from).toList());
    }

    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody User updatedUser) {
        User user = userService.updateUserProfile(jwt, updatedUser);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // Delete user profile
    @DeleteMapping("/profile")
    public ResponseEntity<String> deleteUserProfile(@RequestHeader("Authorization") String jwt) {
        userService.deleteUserProfile(jwt);
        return ResponseEntity.ok("User profile deleted successfully.");
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
    public ResponseEntity<RoleChangeRequest> createRoleChangeRequest(
            @RequestBody RoleChangeRequestDto requestDto,
            @RequestHeader("Authorization") String jwt) throws Exception {
        RoleChangeRequest request = userService.createRoleChangeRequest(requestDto.getRequestedRole(), jwt);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    // The current user's own role-change requests
    @GetMapping("/role-requests/mine")
    public ResponseEntity<List<RoleChangeRequest>> getMyRoleChangeRequests(
            @RequestHeader("Authorization") String jwt) {
        return ResponseEntity.ok(userService.getMyRoleChangeRequests(jwt));
    }

    // Admin-only: every role-change request in the system
    @GetMapping("/role-requests")
    public ResponseEntity<List<RoleChangeRequest>> getAllRoleChangeRequests(
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(userService.getAllRoleChangeRequests(jwt));
    }

    // Admin-only: approve a pending request (applies the new role)
    @PutMapping("/role-requests/{id}/approve")
    public ResponseEntity<RoleChangeRequest> approveRoleChangeRequest(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(userService.reviewRoleChangeRequest(id, "APPROVE", jwt));
    }

    // Admin-only: reject a pending request
    @PutMapping("/role-requests/{id}/reject")
    public ResponseEntity<RoleChangeRequest> rejectRoleChangeRequest(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(userService.reviewRoleChangeRequest(id, "REJECT", jwt));
    }
}
