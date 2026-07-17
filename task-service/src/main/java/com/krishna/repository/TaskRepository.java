package com.krishna.repository;

import com.krishna.modal.Task;
import com.krishna.modal.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findAllByAssignedUserId(Long userId);

    Page<Task> findAllByStatus(TaskStatus status, Pageable pageable);
    Page<Task> findAllByAssignedUserId(Long assignedUserId, Pageable pageable);
    Page<Task> findAllByAssignedUserIdAndStatus(Long assignedUserId, TaskStatus status, Pageable pageable);
}
