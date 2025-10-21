package com.hobby.controller;

import com.hobby.model.event.Event;
import com.hobby.model.task.Task;
import com.hobby.model.task.TaskDependency;
import com.hobby.model.user.User;
import com.hobby.model.common.TaskStatus;
import com.hobby.model.common.TaskPriority;
import com.hobby.service.event.EventService;
import com.hobby.service.task.TaskService;
import com.hobby.service.task.TaskDependencyService;
import com.hobby.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskDependencyService taskDependencyService;

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    // Get all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        return ResponseEntity.ok(tasks);
    }

    // Get task by ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.findById(id);
        return task.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        try {
            Task createdTask = taskService.save(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Optional<Task> existingTask = taskService.findById(id);
        if (existingTask.isPresent()) {
            task.setId(id);
            Task updatedTask = taskService.save(task);
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Optional<Task> task = taskService.findById(id);
        if (task.isPresent()) {
            taskService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get tasks by event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Task>> getTasksByEvent(@PathVariable Long eventId) {
        Optional<Event> event = eventService.findById(eventId);
        if (event.isPresent()) {
            List<Task> tasks = taskService.findByEvent(event.get());
            return ResponseEntity.ok(tasks);
        }
        return ResponseEntity.notFound().build();
    }

    // Get tasks by assignee
    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<Task>> getTasksByAssignee(@PathVariable Long assigneeId) {
        Optional<User> assignee = userService.findById(assigneeId);
        if (assignee.isPresent()) {
            List<Task> tasks = taskService.findByAssignee(assignee.get());
            return ResponseEntity.ok(tasks);
        }
        return ResponseEntity.notFound().build();
    }

    // Get tasks by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable String status) {
        try {
            List<Task> tasks = taskService.findByStatus(status);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get tasks by priority
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable String priority) {
        try {
            List<Task> tasks = taskService.findByPriority(priority);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get overdue tasks
    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        List<Task> tasks = taskService.findOverdueTasks(LocalDateTime.now());
        return ResponseEntity.ok(tasks);
    }

    // Get active tasks
    @GetMapping("/active")
    public ResponseEntity<List<Task>> getActiveTasks() {
        List<Task> tasks = taskService.findActiveTasks();
        return ResponseEntity.ok(tasks);
    }

    // Search tasks by title
    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(@RequestParam String keyword) {
        List<Task> tasks = taskService.searchTasks(keyword);
        return ResponseEntity.ok(tasks);
    }

    // Assign task to user
    @PutMapping("/{taskId}/assign")
    public ResponseEntity<Task> assignTask(
            @PathVariable Long taskId,
            @RequestParam Long assigneeId) {
        try {
            Optional<Task> task = taskService.findById(taskId);
            Optional<User> assignee = userService.findById(assigneeId);
            
            if (task.isPresent() && assignee.isPresent()) {
                task.get().setAssignee(assignee.get());
                Task updatedTask = taskService.save(task.get());
                return ResponseEntity.ok(updatedTask);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update task status
    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam String status) {
        try {
            Optional<Task> task = taskService.findById(taskId);
            if (task.isPresent()) {
                TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
                task.get().setStatus(taskStatus);
                Task updatedTask = taskService.save(task.get());
                return ResponseEntity.ok(updatedTask);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Add task dependency
    @PostMapping("/{taskId}/dependencies")
    public ResponseEntity<TaskDependency> addTaskDependency(
            @PathVariable Long taskId,
            @RequestParam Long dependentTaskId,
            @RequestParam String type) {
        try {
            Optional<Task> task = taskService.findById(taskId);
            Optional<Task> dependentTask = taskService.findById(dependentTaskId);
            
            if (task.isPresent() && dependentTask.isPresent()) {
                TaskDependency dependency = taskDependencyService.addDependency(
                    task.get(), dependentTask.get(), type);
                return ResponseEntity.status(HttpStatus.CREATED).body(dependency);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get task dependencies
    @GetMapping("/{taskId}/dependencies")
    public ResponseEntity<List<TaskDependency>> getTaskDependencies(@PathVariable Long taskId) {
        Optional<Task> task = taskService.findById(taskId);
        if (task.isPresent()) {
            List<TaskDependency> dependencies = taskDependencyService.findByTask(task.get());
            return ResponseEntity.ok(dependencies);
        }
        return ResponseEntity.notFound().build();
    }

    // Remove task dependency
    @DeleteMapping("/{taskId}/dependencies/{dependentTaskId}")
    public ResponseEntity<Void> removeTaskDependency(
            @PathVariable Long taskId,
            @PathVariable Long dependentTaskId) {
        try {
            Optional<Task> task = taskService.findById(taskId);
            Optional<Task> dependentTask = taskService.findById(dependentTaskId);
            
            if (task.isPresent() && dependentTask.isPresent()) {
                taskDependencyService.removeDependency(task.get(), dependentTask.get());
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
