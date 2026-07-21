package com.krishna.service;

import com.krishna.modal.Submission;
import com.krishna.modal.SubmissionStatus;
import com.krishna.modal.TaskDto;
import com.krishna.repository.SubmissionRepository;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
@Service
public class SubmissionServiceImplementation implements SubmissionService{

    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private  TaskService taskService;
    @Autowired
    private MeterRegistry meterRegistry;

    @Override
    public Submission submitTask(Long taskId, String githubLink, Long userId,String jwt) throws Exception {
        TaskDto task = taskService.getTaskById(taskId, jwt);
        if (task != null) {
            Submission submission = new Submission();
            submission.setTaskId(taskId);
            submission.setGithubLink(githubLink);
            submission.setUserId(userId);
           submission.setSubmissionTime(LocalDateTime.now());
            Submission saved = submissionRepository.save(submission);
            // scrapes as "submissions_total" not "submissions_created_total": OpenMetrics reserves
            // the "_created" counter suffix, so Micrometer's Prometheus naming convention strips it
            meterRegistry.counter("submissions.created").increment();
            return saved;
        }
        throw new Exception("Task not found with id : " + taskId);
    }

    @Override
    public Submission getTaskSubmissionById(Long submissionId) throws Exception {
        return submissionRepository.findById(submissionId).orElseThrow(()->new Exception("Submission not found with id : "+submissionId));
    }

    @Override
    public Page<Submission> getAllTaskSubmissions(String status, Long userId, Pageable pageable) {
        SubmissionStatus statusFilter = status != null ? parseStatus(status) : null;
        if (statusFilter != null && userId != null) {
            return submissionRepository.findAllByStatusAndUserId(statusFilter, userId, pageable);
        }
        if (statusFilter != null) {
            return submissionRepository.findAllByStatus(statusFilter, pageable);
        }
        if (userId != null) {
            return submissionRepository.findAllByUserId(userId, pageable);
        }
        return submissionRepository.findAll(pageable);
    }

    @Override
    public Page<Submission> getTaskSubmissionByTaskId(Long taskId, Pageable pageable) {
        return submissionRepository.findAllByTaskId(taskId, pageable);
    }

    @Override
    public Submission acceptDeclineTaskSubmission(Long submissionId, String status,String jwt) throws Exception {
        Submission submission = getTaskSubmissionById(submissionId);
        SubmissionStatus newStatus = parseReviewDecision(status);
        submission.setStatus(newStatus);
        if (newStatus == SubmissionStatus.ACCEPTED) {
            taskService.completeTask(submission.getTaskId(),jwt);
            meterRegistry.counter("submissions.accepted").increment();
        } else if (newStatus == SubmissionStatus.DECLINED) {
            meterRegistry.counter("submissions.declined").increment();
        }
        return submissionRepository.save(submission);

    }

    // accepts either the DB enum spelling (ACCEPTED/DECLINED) or the older verb form the
    // frontend/API clients already send (ACCEPT/DECLINE), case-insensitively
    private SubmissionStatus parseReviewDecision(String status) {
        String normalized = status == null ? "" : status.trim().toUpperCase();
        return switch (normalized) {
            case "ACCEPT", "ACCEPTED" -> SubmissionStatus.ACCEPTED;
            case "DECLINE", "DECLINED" -> SubmissionStatus.DECLINED;
            default -> throw new IllegalArgumentException(
                    "Invalid status '" + status + "': expected ACCEPT/ACCEPTED or DECLINE/DECLINED");
        };
    }

    private SubmissionStatus parseStatus(String status) {
        try {
            return SubmissionStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status '" + status + "': expected PENDING, ACCEPTED, or DECLINED");
        }
    }
}
