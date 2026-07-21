package com.krishna.service;

import com.krishna.modal.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubmissionService {

    Submission submitTask(Long taskId, String githubLink, Long userId) throws Exception;

    Submission getTaskSubmissionById(Long submissionId) throws Exception;
    Page<Submission> getAllTaskSubmissions(String status, Long userId, Pageable pageable);

    Page<Submission> getTaskSubmissionByTaskId(Long taskId, Pageable pageable);
    Submission acceptDeclineTaskSubmission(Long submissionId, String status, Long reviewerUserId) throws Exception;
}
