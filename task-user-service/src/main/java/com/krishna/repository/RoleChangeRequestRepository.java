package com.krishna.repository;

import com.krishna.modal.RoleChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleChangeRequestRepository extends JpaRepository<RoleChangeRequest, Long> {
    List<RoleChangeRequest> findAllByUserId(Long userId);
}
