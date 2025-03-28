package com.krishna.service;

import com.krishna.modal.TaskDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "TASK-SERVICE", url = "http://localhost:8082")
public interface TaskService {
    @GetMapping("/api/task/{id}")
    public TaskDto getTaskById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception;

    @PutMapping("api/task/{id}/complete")
    public TaskDto completeTask(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception;
}
