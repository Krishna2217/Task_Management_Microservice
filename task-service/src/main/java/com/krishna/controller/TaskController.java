package com.krishna.controller;

import com.krishna.modal.Task;
import com.krishna.modal.TaskStatus;
import com.krishna.modal.UserDto;
import com.krishna.request.CreateTaskRequest;
import com.krishna.request.UpdateTaskRequest;
import com.krishna.response.TaskResponse;
import com.krishna.service.TaskService;
import com.krishna.service.UserService;
import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/task")
public class TaskController {
    @Autowired
    private TaskService taskService;
    @Autowired
    private UserService userService;

    @Timed(value = "task.create", description = "Time taken to create a task")
    @PostMapping()
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest task,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        Task createdTask = taskService.createTask(task, user.getRole());
        return ResponseEntity.created(URI.create("/api/task/" + createdTask.getId()))
                .body(TaskResponse.from(createdTask));
    }

    @Timed(value = "task.get-by-id", description = "Time taken to fetch a task by id")
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(TaskResponse.from(task));
    }

    @Timed(value = "task.get-assigned", description = "Time taken to fetch tasks assigned to the caller")
    @GetMapping("/user")
    public ResponseEntity<List<TaskResponse>> getAssignedUserTask(
            @RequestParam (name = "status",required = false) TaskStatus taskStatus,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        List<Task> tasks = taskService.assignedUsersTask(user.getId(), taskStatus);
        return ResponseEntity.ok(tasks.stream().map(TaskResponse::from).toList());
    }

    @Timed(value = "task.get-all", description = "Time taken to list tasks")
    @GetMapping()
    public ResponseEntity<Page<TaskResponse>> getAllTask(
            @RequestParam (name = "status",required = false) TaskStatus taskStatus,
            @RequestParam (name = "assignedUserId",required = false) Long assignedUserId,
            Pageable pageable,
            @RequestHeader("Authorization") String jwt) throws Exception {
        log.info("task status in controller {}", taskStatus);
        UserDto user = userService.getUserProfile(jwt);
        Page<TaskResponse> tasks = taskService.getAllTasks(taskStatus, assignedUserId, pageable).map(TaskResponse::from);
        return ResponseEntity.ok(tasks);
    }
    @Timed(value = "task.assign", description = "Time taken to assign a task to a user")
    @PutMapping("/{id}/user/{userId}/assigned")
    public ResponseEntity<TaskResponse> assignedTaskToUser(
            @PathVariable Long id,
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        Task task = taskService.assignToUser(userId, id);
        return ResponseEntity.ok(TaskResponse.from(task));
    }
    @Timed(value = "task.update", description = "Time taken to update a task")
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest task,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        Task updatedTask = taskService.updateTask(id, task, user.getId());
        return ResponseEntity.ok(TaskResponse.from(updatedTask));
    }

    @Timed(value = "task.complete", description = "Time taken to complete a task")
    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> completeTask(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        Task task = taskService.completeTask(id);
        return ResponseEntity.ok(TaskResponse.from(task));
    }
    @Timed(value = "task.delete", description = "Time taken to delete a task")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

}
