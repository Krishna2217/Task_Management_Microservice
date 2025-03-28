package com.krishna.modal;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TaskDto {
        private Long id;
        private String title;
        private String description;
        private String image;
        private Long assignedUserId;
        private List<String> tags = new ArrayList<>();
        private TaskStatus status;
        private LocalDateTime deadline;
        private LocalDateTime createdAt;

}
