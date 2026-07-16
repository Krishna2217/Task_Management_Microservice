package com.krishna.service;

import com.krishna.modal.TaskDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;

// no hardcoded url: resolve TASK-SERVICE via Eureka so this works across hosts/containers, not just localhost:8082
@FeignClient(name = "TASK-SERVICE")
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
