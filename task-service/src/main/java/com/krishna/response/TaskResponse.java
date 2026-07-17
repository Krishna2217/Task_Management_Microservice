package com.krishna.response;

import com.krishna.modal.Task;
import com.krishna.modal.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String image;
    private Long assignedUserId;
    private List<String> tags;
    private TaskStatus status;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getImage(),
                task.getAssignedUserId(),
                task.getTags(),
                task.getStatus(),
                task.getDeadline(),
                task.getCreatedAt()
        );
    }
}
