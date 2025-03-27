package com.krishna.service;

import com.krishna.modal.Task;
import com.krishna.modal.TaskStatus;
import com.krishna.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImplementation implements TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskServiceImplementation.class);
    @Autowired
    private TaskRepository taskRepository;

    @Override
    public Task createTask(Task task, String requesterRole) throws Exception {
        log.info("The requester role is {}", requesterRole);
        if(!requesterRole.equals("ROLE_ADMIN")){
          throw new Exception("Only admin can create task");
        }
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Override
    public Task getTaskById(Long id) throws Exception {
        return taskRepository.findById(id).orElseThrow(()->new Exception("Task not found with id "+id));

    }

    @Override
    public List<Task> getAllTasks(TaskStatus status) throws Exception {
        log.info("status is {}", status);
        List<Task> allTask = taskRepository.findAll();
        List<Task> filteredTask = allTask.stream().filter(
                task->status==null || task.getStatus().name().equalsIgnoreCase(status.toString())

        ).collect(Collectors.toList());
        return filteredTask;
    }

    @Override
    public Task updateTask(Long id, Task updatedTask, Long UserId) throws Exception {
        Task existingTask = getTaskById(id);
        if(updatedTask.getTitle()!=null){
            existingTask.setTitle(updatedTask.getTitle());
        }
        if(updatedTask.getDescription()!=null){
            existingTask.setDescription(updatedTask.getDescription());
        }
        if(updatedTask.getImage()!=null){
            existingTask.setImage(updatedTask.getImage());
        }
        if(updatedTask.getTags()!=null){
            existingTask.setTags(updatedTask.getTags());
        }
        if(updatedTask.getDeadline()!=null){
            existingTask.setDeadline(updatedTask.getDeadline());
        }
        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(Long id) throws Exception {
        getTaskById(id);
        taskRepository.deleteById(id);
    }

    @Override
    public Task assignToUser(Long userId, Long taskId) throws Exception {
        Task task = getTaskById(taskId);
        task.setAssignedUserId(userId);
        task.setStatus(TaskStatus.DONE);
        return taskRepository.save(task);
    }

    @Override
    public List<Task> assignedUsersTask(Long userId, TaskStatus status) {
        log.info("status is {}", status);
        List<Task> allTask = taskRepository.findAllByAssignedUserId(userId);
        List<Task> filteredTask = allTask.stream().filter(
                task->status==null || task.getStatus().name().equalsIgnoreCase(status.toString())
        ).collect(Collectors.toList());
        return filteredTask;
    }

    @Override
    public Task completeTask(Long taskId) throws Exception {
       Task task = getTaskById(taskId);
         task.setStatus(TaskStatus.DONE);
         return taskRepository.save(task);
    }
}
