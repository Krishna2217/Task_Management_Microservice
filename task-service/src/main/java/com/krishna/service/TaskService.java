package com.krishna.service;

import com.krishna.modal.Task;
import com.krishna.modal.TaskStatus;
import com.krishna.request.CreateTaskRequest;
import com.krishna.request.UpdateTaskRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {
    Task createTask(CreateTaskRequest task, String requesterRole) throws Exception;
    Task getTaskById(Long id) throws Exception;
    Page<Task> getAllTasks(TaskStatus status, Long assignedUserId, Pageable pageable);

    Task updateTask(Long id, UpdateTaskRequest updatedTask, Long UserId) throws Exception;
    void deleteTask(Long id) throws Exception;

    Task assignToUser(Long userId, Long taskId) throws Exception;

    List<Task> assignedUsersTask(Long userId, TaskStatus status);
    Task completeTask(Long taskId) throws Exception;
}
