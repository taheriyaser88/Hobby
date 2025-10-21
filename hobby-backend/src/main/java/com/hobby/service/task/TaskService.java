package com.hobby.service.task;

import com.hobby.model.task.Task;
import com.hobby.model.common.TaskStatus;
import com.hobby.model.common.TaskPriority;
import com.hobby.model.event.Event;
import com.hobby.model.user.User;
import com.hobby.repository.task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public List<Task> findByEvent(Event event) {
        return taskRepository.findByEvent(event);
    }

    public List<Task> findByAssignee(User assignee) {
        return taskRepository.findByAssignee(assignee);
    }

    public List<Task> findByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    public List<Task> findByPriority(TaskPriority priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> findOverdueTasks(LocalDateTime now) {
        return taskRepository.findByEndDateTimeBefore(now);
    }
    
    public List<Task> findByStatus(String status) {
        try {
            TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
            return taskRepository.findByStatus(taskStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
    
    public List<Task> findByPriority(String priority) {
        try {
            TaskPriority taskPriority = TaskPriority.valueOf(priority.toUpperCase());
            return taskRepository.findByPriority(taskPriority);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid priority: " + priority);
        }
    }

    public List<Task> findActiveTasks() {
        return taskRepository.findByStatus(TaskStatus.IN_PROGRESS);
    }

    public List<Task> searchTasks(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public long countByEvent(Event event) {
        return taskRepository.countByEvent(event);
    }

    public long countByAssignee(User assignee) {
        return taskRepository.countByAssignee(assignee);
    }

    public long countByStatus(TaskStatus status) {
        return taskRepository.countByStatus(status);
    }

    public long countByPriority(TaskPriority priority) {
        return taskRepository.countByPriority(priority);
    }

    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }

    public long count() {
        return taskRepository.count();
    }

    public Task createTask(String title, String description, Event event, TaskPriority priority, 
                          LocalDateTime startDate, LocalDateTime dueDate, User assignee) {
        Task task = new Task(title, description, event);
        task.setPriority(priority);
        task.setStartDateTime(startDate);
        task.setEndDateTime(dueDate);
        task.setAssignee(assignee);
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, TaskStatus status) {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            task.get().setStatus(status);
            return taskRepository.save(task.get());
        }
        throw new RuntimeException("Task not found");
    }

    public Task updateTaskPriority(Long taskId, TaskPriority priority) {
        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent()) {
            task.get().setPriority(priority);
            return taskRepository.save(task.get());
        }
        throw new RuntimeException("Task not found");
    }
}
