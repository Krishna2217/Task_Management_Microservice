package com.krishna.service;

import com.krishna.modal.Submission;
import com.krishna.modal.TaskDto;
import com.krishna.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
    public List<Submission> getAllTaskSubmissions() throws Exception {
        return submissionRepository.findAll();
    }

    @Override
    public List<Submission> getTaskSubmissionByTaskId(Long taskId) {
        return submissionRepository.findAllByTaskId(taskId);
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
