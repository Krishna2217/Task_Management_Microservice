package com.krishna.service;

import com.krishna.config.JwtProvider;
import com.krishna.modal.RoleChangeRequest;
import com.krishna.modal.User;
import com.krishna.repository.RoleChangeRequestRepository;
import com.krishna.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    private JwtProvider jwtProvider;
    @Autowired
    private RoleChangeRequestRepository roleChangeRequestRepository;
    @Override
    public User getUserProfile(String jwt) {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
       return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUserProfile(String jwt, User updatedUser) {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user==null){
            throw new UsernameNotFoundException("User not found with email"+ email);
        }
        user.setFullName(updatedUser.getFullName());
        // role is intentionally not settable here; only an admin can change a user's role (see updateUserRole)
        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public void deleteUserProfile(String jwt) {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user==null){
            throw new UsernameNotFoundException("User not found with email"+ email);
        }
        userRepository.delete(user);
    }

    @Override
    public User updateUserRole(Long targetUserId, String newRole, String jwt) throws Exception {
        requireAdmin(jwt);
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new Exception("User not found with id " + targetUserId));
        target.setRole(newRole);
        return userRepository.save(target);
    }

    // shared by role-management operations that only an admin may perform
    User requireAdmin(String jwt) throws Exception {
        User requester = getUserProfile(jwt);
        if (requester == null || !"ROLE_ADMIN".equals(requester.getRole())) {
            throw new Exception("Only an admin can perform this action");
        }
        return requester;
    }

    @Override
    public RoleChangeRequest createRoleChangeRequest(String requestedRole, String jwt) throws Exception {
        User requester = getUserProfile(jwt);
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
    public List<RoleChangeRequest> getMyRoleChangeRequests(String jwt) {
        User requester = getUserProfile(jwt);
        return roleChangeRequestRepository.findAllByUserId(requester.getId());
    }

    @Override
    public List<RoleChangeRequest> getAllRoleChangeRequests(String jwt) throws Exception {
        requireAdmin(jwt);
        return roleChangeRequestRepository.findAll();
    }

    @Override
    public RoleChangeRequest reviewRoleChangeRequest(Long requestId, String action, String jwt) throws Exception {
        requireAdmin(jwt);
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
