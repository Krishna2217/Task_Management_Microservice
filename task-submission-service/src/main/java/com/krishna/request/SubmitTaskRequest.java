package com.krishna.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SubmitTaskRequest {
    @NotNull
    private Long taskId;

    @NotBlank
    @Pattern(regexp = "^https?://(www\\.)?github\\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(/.*)?$",
            message = "must be a valid GitHub repository URL")
    private String githubLink;
}
