package com.hobby.dto.task;

import java.time.LocalDateTime;

public class TaskDependencyResponse {

    private Long id;
    private TaskResponse task;
    private TaskResponse dependentTask;
    private String type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public TaskDependencyResponse() {}

    public TaskDependencyResponse(Long id, TaskResponse task, TaskResponse dependentTask, String type,
                                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.task = task;
        this.dependentTask = dependentTask;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaskResponse getTask() {
        return task;
    }

    public void setTask(TaskResponse task) {
        this.task = task;
    }

    public TaskResponse getDependentTask() {
        return dependentTask;
    }

    public void setDependentTask(TaskResponse dependentTask) {
        this.dependentTask = dependentTask;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
