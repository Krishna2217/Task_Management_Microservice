package com.krishna.controller;

import com.krishna.modal.Submission;
import com.krishna.modal.UserDto;
import com.krishna.service.SubmissionService;
import com.krishna.service.TaskService;
import com.krishna.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submission")
public class SubmissionController {
    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private UserService userService;
    @Autowired
    private TaskService taskService;

    @PostMapping()
    public ResponseEntity<Submission> submitTask(
            @RequestParam Long task_id,
            @RequestParam String github_link,
            @RequestHeader ("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        Submission submission = submissionService.submitTask(task_id, github_link, user.getId(), jwt);
        return new ResponseEntity<>(submission, HttpStatus.CREATED);
    }
    @GetMapping("/{submission_id}")
    public ResponseEntity<Submission> getTaskSubmissionById(
            @PathVariable Long submission_id,
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        Submission submission = submissionService.getTaskSubmissionById(submission_id);
        return new ResponseEntity<>(submission, HttpStatus.OK);
    }
    @GetMapping()
    public ResponseEntity<List<Submission>> getAllTaskSubmissions(
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        List<Submission> submissions = submissionService.getAllTaskSubmissions();
        return new ResponseEntity<>(submissions, HttpStatus.OK);
    }
    @GetMapping("/task/{task_id}")
    public ResponseEntity<List<Submission>> getTaskSubmissionByTaskId(
            @PathVariable Long task_id,
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        List<Submission> submissions = submissionService.getTaskSubmissionByTaskId(task_id);
        return new ResponseEntity<>(submissions, HttpStatus.OK);
    }
    @PutMapping("/{submission_id}")
    public ResponseEntity<Submission> acceptDeclineTaskSubmission(
            @PathVariable Long submission_id,
            @RequestParam("status") String status,
            @RequestHeader ("Authorization") String jwt
            ) throws Exception {

        Submission submission = submissionService.acceptDeclineTaskSubmission(submission_id, status, jwt);
        return new ResponseEntity<>(submission, HttpStatus.OK);
    }
}
