package com.krishna.service;

import com.krishna.modal.RoleChangeRequest;
import com.krishna.modal.User;
import com.krishna.repository.RoleChangeRequestRepository;
import com.krishna.repository.UserRepository;
import com.krishna.request.UpdateProfileRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImplementation implements UserService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private RoleChangeRequestRepository roleChangeRequestRepository;

    @Override
    public User getUserProfile(String email) {
       return userRepository.findByEmail(email);
    }

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public User updateUserProfile(String email, UpdateProfileRequest updatedUser) {
        User user = userRepository.findByEmail(email);
        if (user==null){
            throw new UsernameNotFoundException("User not found with email"+ email);
        }
        user.setFullName(updatedUser.getFullName());
        // role and password are intentionally not settable here; see updateUserRole and changePassword
        return userRepository.save(user);
    }

    @Override
    public void changePassword(String email, String currentPassword, String newPassword) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email " + email);
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void deleteUserProfile(String email) {
        User user = userRepository.findByEmail(email);
        if (user==null){
            throw new UsernameNotFoundException("User not found with email"+ email);
        }
        userRepository.delete(user);
    }

    @Override
    public User updateUserRole(Long targetUserId, String newRole, String requesterEmail) throws Exception {
        requireAdmin(requesterEmail);
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new Exception("User not found with id " + targetUserId));
        target.setRole(newRole);
        return userRepository.save(target);
    }

    // shared by role-management operations that only an admin may perform; re-checked against the
    // DB (not the caller's possibly-stale JWT role claim) since roles can change between requests
    User requireAdmin(String email) throws Exception {
        User requester = getUserProfile(email);
        if (requester == null || !"ROLE_ADMIN".equals(requester.getRole())) {
            throw new Exception("Only an admin can perform this action");
        }
        return requester;
    }

    @Override
    public RoleChangeRequest createRoleChangeRequest(String requestedRole, String email) throws Exception {
        User requester = getUserProfile(email);
        if (requester == null) {
            throw new Exception("User not found");
        }
        RoleChangeRequest request = new RoleChangeRequest();
        request.setUserId(requester.getId());
        request.setCurrentRole(requester.getRole());
        request.setRequestedRole(requestedRole);
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());
        return roleChangeRequestRepository.save(request);
    }

    @Override
    public List<RoleChangeRequest> getMyRoleChangeRequests(String email) {
        User requester = getUserProfile(email);
        return roleChangeRequestRepository.findAllByUserId(requester.getId());
    }

    @Override
    public List<RoleChangeRequest> getAllRoleChangeRequests(String requesterEmail) throws Exception {
        requireAdmin(requesterEmail);
        return roleChangeRequestRepository.findAll();
    }

    @Override
    public RoleChangeRequest reviewRoleChangeRequest(Long requestId, String action, String requesterEmail) throws Exception {
        requireAdmin(requesterEmail);
        RoleChangeRequest request = roleChangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new Exception("Role change request not found with id " + requestId));
        if (!"PENDING".equals(request.getStatus())) {
            throw new Exception("This request has already been reviewed");
        }
        if ("APPROVE".equalsIgnoreCase(action)) {
            User target = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new Exception("User not found with id " + request.getUserId()));
            target.setRole(request.getRequestedRole());
            userRepository.save(target);
            request.setStatus("APPROVED");
        } else if ("REJECT".equalsIgnoreCase(action)) {
            request.setStatus("REJECTED");
        } else {
            throw new Exception("Unknown action: " + action);
        }
        return roleChangeRequestRepository.save(request);
    }
}
