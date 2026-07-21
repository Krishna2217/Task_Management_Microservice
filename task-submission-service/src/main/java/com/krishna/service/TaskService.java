package com.krishna.service;

import com.krishna.modal.TaskDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;

// no hardcoded url: resolve TASK-SERVICE via Eureka so this works across hosts/containers, not just localhost:8082
// this is a direct service-to-service call that bypasses the gateway, so the caller's identity has
// to be re-propagated explicitly via X-User-Id - task-service no longer accepts a raw JWT at all
@FeignClient(name = "TASK-SERVICE", fallback = TaskServiceFallback.class)
public interface TaskService {
    @GetMapping("/api/task/{id}")
    public TaskDto getTaskById(@PathVariable Long id) throws Exception;

    @PutMapping("api/task/{id}/complete")
    public TaskDto completeTask(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) throws Exception;
}
