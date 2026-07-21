package com.krishna.controller;

import com.krishna.modal.Submission;
import com.krishna.modal.UserDto;
import com.krishna.request.SubmitTaskRequest;
import com.krishna.response.SubmissionResponse;
import com.krishna.security.CurrentUserIdHolder;
import com.krishna.service.SubmissionService;
import com.krishna.service.TaskService;
import com.krishna.service.UserService;
import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/submission")
public class SubmissionController {
    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private UserService userService;
    @Autowired
    private TaskService taskService;

    @Timed(value = "submission.create", description = "Time taken to submit a task")
    @PostMapping()
    public ResponseEntity<SubmissionResponse> submitTask(
            @Valid @RequestBody SubmitTaskRequest request,
            @RequestHeader ("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        CurrentUserIdHolder.set(user.getId());
        Submission submission = submissionService.submitTask(request.getTaskId(), request.getGithubLink(), user.getId(), jwt);
        return ResponseEntity.created(URI.create("/api/submission/" + submission.getId()))
                .body(SubmissionResponse.from(submission));
    }
    @Timed(value = "submission.get-by-id", description = "Time taken to fetch a submission by id")
    @GetMapping("/{submission_id}")
    public ResponseEntity<SubmissionResponse> getTaskSubmissionById(
            @PathVariable Long submission_id,
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        Submission submission = submissionService.getTaskSubmissionById(submission_id);
        return ResponseEntity.ok(SubmissionResponse.from(submission));
    }
    @Timed(value = "submission.get-all", description = "Time taken to list submissions")
    @GetMapping()
    public ResponseEntity<Page<SubmissionResponse>> getAllTaskSubmissions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId,
            Pageable pageable,
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        Page<SubmissionResponse> submissions = submissionService.getAllTaskSubmissions(status, userId, pageable)
                .map(SubmissionResponse::from);
        return ResponseEntity.ok(submissions);
    }
    @Timed(value = "submission.get-by-task", description = "Time taken to list submissions for a task")
    @GetMapping("/task/{task_id}")
    public ResponseEntity<Page<SubmissionResponse>> getTaskSubmissionByTaskId(
            @PathVariable Long task_id,
            Pageable pageable,
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        Page<SubmissionResponse> submissions = submissionService.getTaskSubmissionByTaskId(task_id, pageable)
                .map(SubmissionResponse::from);
        return ResponseEntity.ok(submissions);
    }
    @Timed(value = "submission.review", description = "Time taken to accept/decline a submission")
    @PutMapping("/{submission_id}")
    public ResponseEntity<SubmissionResponse> acceptDeclineTaskSubmission(
            @PathVariable Long submission_id,
            @RequestParam("status") String status,
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        UserDto user = userService.getUserProfile(jwt);
        CurrentUserIdHolder.set(user.getId());
        Submission submission = submissionService.acceptDeclineTaskSubmission(submission_id, status, jwt);
        return ResponseEntity.ok(SubmissionResponse.from(submission));
    }
}
