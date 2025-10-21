package com.hobby.model.task;

import com.hobby.model.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "task_dependencies")
public class TaskDependency extends BaseEntity {
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dependent_task_id", nullable = false)
    private Task dependentTask;
    
    @Size(max = 200)
    @Column(name = "dependency_type")
    private String dependencyType; // FINISH_TO_START, START_TO_START, FINISH_TO_FINISH, START_TO_FINISH
    
    @Column(name = "lag_days")
    private Integer lagDays;
    
    // Constructors
    public TaskDependency() {}
    
    public TaskDependency(Task task, Task dependentTask) {
        this.task = task;
        this.dependentTask = dependentTask;
    }
    
    public TaskDependency(Task task, Task dependentTask, String dependencyType) {
        this.task = task;
        this.dependentTask = dependentTask;
        this.dependencyType = dependencyType;
    }
    
    // Getters and Setters
    public Task getTask() {
        return task;
    }
    
    public void setTask(Task task) {
        this.task = task;
    }
    
    public Task getDependentTask() {
        return dependentTask;
    }
    
    public void setDependentTask(Task dependentTask) {
        this.dependentTask = dependentTask;
    }
    
    public String getDependencyType() {
        return dependencyType;
    }
    
    public void setDependencyType(String dependencyType) {
        this.dependencyType = dependencyType;
    }
    
    public Integer getLagDays() {
        return lagDays;
    }
    
    public void setLagDays(Integer lagDays) {
        this.lagDays = lagDays;
    }
}
