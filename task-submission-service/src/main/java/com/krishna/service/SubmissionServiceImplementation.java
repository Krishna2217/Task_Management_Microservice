package com.krishna.service;

import com.krishna.modal.Submission;
import com.krishna.modal.TaskDto;
import com.krishna.repository.SubmissionRepository;
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

    @Override
    public Submission submitTask(Long taskId, String githubLink, Long userId,String jwt) throws Exception {
        TaskDto task = taskService.getTaskById(taskId, jwt);
        if (task != null) {
            Submission submission = new Submission();
            submission.setTaskId(taskId);
            submission.setGithubLink(githubLink);
            submission.setUserId(userId);
           submission.setSubmissionTime(LocalDateTime.now());
            return submissionRepository.save(submission);
        }
        throw new Exception("Task not found with id : " + taskId);
    }

    @Override
    public Submission getTaskSubmissionById(Long submissionId) throws Exception {
        return submissionRepository.findById(submissionId).orElseThrow(()->new Exception("Submission not found with id : "+submissionId));
    }

    @Override
    public Page<Submission> getAllTaskSubmissions(String status, Long userId, Pageable pageable) {
        if (status != null && userId != null) {
            return submissionRepository.findAllByStatusAndUserId(status, userId, pageable);
        }
        if (status != null) {
            return submissionRepository.findAllByStatus(status, pageable);
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
        submission.setStatus(status);
        if(status.equals("ACCEPT")){
            taskService.completeTask(submission.getTaskId(),jwt);
        }
        return submissionRepository.save(submission);

    }
}
