package com.krishna.response;

import com.krishna.modal.Submission;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionResponse {
    private Long id;
    private Long taskId;
    private String githubLink;
    private Long userId;
    private String status;
    private LocalDateTime submissionTime;

    public static SubmissionResponse from(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                submission.getTaskId(),
                submission.getGithubLink(),
                submission.getUserId(),
                submission.getStatus() != null ? submission.getStatus().name() : null,
                submission.getSubmissionTime()
        );
    }
}
