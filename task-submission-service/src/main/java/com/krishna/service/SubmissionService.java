package com.krishna.service;

import com.krishna.modal.Submission;

import java.util.List;

public interface SubmissionService {

    Submission submitTask(Long taskId, String githubLink, Long userId,String jwt) throws Exception;

    Submission getTaskSubmissionById(Long submissionId) throws Exception;
    List<Submission> getAllTaskSubmissions() throws Exception;

    List<Submission> getTaskSubmissionByTaskId(Long taskId);
    Submission acceptDeclineTaskSubmission(Long submissionId, String status,String jwt) throws Exception;
}
