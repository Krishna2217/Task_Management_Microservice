package com.krishna.service;

import com.krishna.modal.TaskDto;
import com.krishna.modal.TaskStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

// served when TASK-SERVICE is down, slow, or the taskService circuit breaker is open
@Component
public class TaskServiceFallback implements TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskServiceFallback.class);

    @Override
    public TaskDto getTaskById(Long id, String jwt) {
        log.warn("Falling back for TASK-SERVICE#getTaskById; taskId={}, traceId={}", id, MDC.get("traceId"));
        return unknownTask(id);
    }

    @Override
    public TaskDto completeTask(Long id, String jwt) {
        log.warn("Falling back for TASK-SERVICE#completeTask; taskId={}, traceId={}", id, MDC.get("traceId"));
        return unknownTask(id);
    }

    private TaskDto unknownTask(Long id) {
        TaskDto fallback = new TaskDto();
        fallback.setId(id);
        fallback.setStatus(TaskStatus.UNKNOWN);
        return fallback;
    }
}
