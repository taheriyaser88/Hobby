package com.hobby.model.tag;

import com.hobby.model.common.BaseEntity;
import com.hobby.model.event.Event;
import com.hobby.model.task.Task;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
public class Tag extends BaseEntity {
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "name", nullable = false, unique = true)
    private String name;
    
    @Size(max = 7)
    @Column(name = "color")
    private String color; // Hex color code
    
    @Size(max = 200)
    @Column(name = "description")
    private String description;
    
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private Set<Event> events = new HashSet<>();
    
    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private Set<Task> tasks = new HashSet<>();
    
    // Constructors
    public Tag() {}
    
    public Tag(String name, String color, String description) {
        this.name = name;
        this.color = color;
        this.description = description;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Set<Event> getEvents() {
        return events;
    }
    
    public void setEvents(Set<Event> events) {
        this.events = events;
    }
    
    public Set<Task> getTasks() {
        return tasks;
    }
    
    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }
}
