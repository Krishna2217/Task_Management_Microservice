package com.krishna.service;

import com.krishna.modal.Task;
import com.krishna.modal.TaskStatus;
import com.krishna.repository.TaskRepository;
import com.krishna.request.CreateTaskRequest;
import com.krishna.request.UpdateTaskRequest;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImplementation implements TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskServiceImplementation.class);
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private MeterRegistry meterRegistry;

    @Override
    public Task createTask(CreateTaskRequest request, String requesterRole) throws Exception {
        log.info("The requester role is {}", requesterRole);
        if(!requesterRole.equals("ROLE_ADMIN")){
          throw new Exception("Only admin can create task");
        }
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setImage(request.getImage());
        task.setTags(request.getTags());
        task.setDeadline(request.getDeadline());
        task.setStatus(TaskStatus.PENDING);
        Task saved = taskRepository.save(task);
        // scrapes as "tasks_total" not "tasks_created_total": OpenMetrics reserves the
        // "_created" counter suffix, so Micrometer's Prometheus naming convention strips it
        meterRegistry.counter("tasks.created").increment();
        return saved;
    }

    @Override
    public Task getTaskById(Long id) throws Exception {
        return taskRepository.findById(id).orElseThrow(()->new Exception("Task not found with id "+id));

    }

    @Override
    public Page<Task> getAllTasks(TaskStatus status, Long assignedUserId, Pageable pageable) {
        log.info("status is {}, assignedUserId is {}", status, assignedUserId);
        if (status != null && assignedUserId != null) {
            return taskRepository.findAllByAssignedUserIdAndStatus(assignedUserId, status, pageable);
        }
        if (status != null) {
            return taskRepository.findAllByStatus(status, pageable);
        }
        if (assignedUserId != null) {
            return taskRepository.findAllByAssignedUserId(assignedUserId, pageable);
        }
        return taskRepository.findAll(pageable);
    }

    @Override
    public Task updateTask(Long id, UpdateTaskRequest updatedTask, Long UserId) throws Exception {
        Task existingTask = getTaskById(id);
        existingTask.setTitle(updatedTask.getTitle());
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
        Task saved = taskRepository.save(task);
        meterRegistry.counter("tasks.assigned").increment();
        return saved;
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
         Task saved = taskRepository.save(task);
         meterRegistry.counter("tasks.completed").increment();
         return saved;
    }
}
