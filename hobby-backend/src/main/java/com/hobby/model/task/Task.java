package com.hobby.model.task;

import com.hobby.model.common.BaseEntity;
import com.hobby.model.common.TaskPriority;
import com.hobby.model.common.TaskStatus;
import com.hobby.model.event.Event;
import com.hobby.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tasks")
public class Task extends BaseEntity {
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "title", nullable = false)
    private String title;
    
    @Size(max = 2000)
    @Column(name = "description")
    private String description;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TaskStatus status = TaskStatus.PENDING;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;
    
    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;
    
    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;
    
    @Column(name = "completed_date_time")
    private LocalDateTime completedDateTime;
    
    @Column(name = "estimated_hours")
    private Integer estimatedHours;
    
    @Column(name = "actual_hours")
    private Integer actualHours;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;
    
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TaskDependency> dependencies = new HashSet<>();
    
    @OneToMany(mappedBy = "dependentTask", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<TaskDependency> dependents = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "task_tags",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<com.hobby.model.tag.Tag> tags = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "task_labels",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private Set<com.hobby.model.tag.Label> labels = new HashSet<>();
    
    // Constructors
    public Task() {}
    
    public Task(String title, String description, Event event) {
        this.title = title;
        this.description = description;
        this.event = event;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
    public TaskPriority getPriority() {
        return priority;
    }
    
    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }
    
    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }
    
    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }
    
    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }
    
    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }
    
    public LocalDateTime getCompletedDateTime() {
        return completedDateTime;
    }
    
    public void setCompletedDateTime(LocalDateTime completedDateTime) {
        this.completedDateTime = completedDateTime;
    }
    
    public Integer getEstimatedHours() {
        return estimatedHours;
    }
    
    public void setEstimatedHours(Integer estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
    
    public Integer getActualHours() {
        return actualHours;
    }
    
    public void setActualHours(Integer actualHours) {
        this.actualHours = actualHours;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public User getAssignee() {
        return assignee;
    }
    
    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }
    
    public Set<TaskDependency> getDependencies() {
        return dependencies;
    }
    
    public void setDependencies(Set<TaskDependency> dependencies) {
        this.dependencies = dependencies;
    }
    
    public Set<TaskDependency> getDependents() {
        return dependents;
    }
    
    public void setDependents(Set<TaskDependency> dependents) {
        this.dependents = dependents;
    }
    
    public Set<com.hobby.model.tag.Tag> getTags() {
        return tags;
    }
    
    public void setTags(Set<com.hobby.model.tag.Tag> tags) {
        this.tags = tags;
    }
    
    public Set<com.hobby.model.tag.Label> getLabels() {
        return labels;
    }
    
    public void setLabels(Set<com.hobby.model.tag.Label> labels) {
        this.labels = labels;
    }
    
    public LocalDateTime getDueDate() {
        return endDateTime;
    }
}
