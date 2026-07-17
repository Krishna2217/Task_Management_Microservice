package com.krishna.repository;

import com.krishna.modal.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface SubmissionRepository extends JpaRepository<Submission,Long> {

    List<Submission> findAllByTaskId(Long taskId);

    Page<Submission> findAllByTaskId(Long taskId, Pageable pageable);
    Page<Submission> findAllByStatus(String status, Pageable pageable);
    Page<Submission> findAllByUserId(Long userId, Pageable pageable);
    Page<Submission> findAllByStatusAndUserId(String status, Long userId, Pageable pageable);
}
