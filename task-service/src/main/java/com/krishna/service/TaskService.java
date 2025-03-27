package com.krishna.service;

import com.krishna.modal.Task;
import com.krishna.modal.TaskStatus;

import java.util.List;

public interface TaskService {
    Task createTask(Task task, String requesterRole) throws Exception;
    Task getTaskById(Long id) throws Exception;
    List<Task> getAllTasks(TaskStatus status) throws Exception;

    Task updateTask(Long id, Task updatedTask,Long UserId) throws Exception;
    void deleteTask(Long id) throws Exception;

    Task assignToUser(Long userId, Long taskId) throws Exception;

    List<Task> assignedUsersTask(Long userId, TaskStatus status);
    Task completeTask(Long taskId) throws Exception;
}
