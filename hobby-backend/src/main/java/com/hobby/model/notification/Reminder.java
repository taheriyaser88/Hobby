package com.hobby.model.notification;

import com.hobby.model.common.BaseEntity;
import com.hobby.model.event.Event;
import com.hobby.model.task.Task;
import com.hobby.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder extends BaseEntity {
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;
    
    @Column(name = "reminder_date_time", nullable = false)
    private LocalDateTime reminderDateTime;
    
    @Size(max = 200)
    @Column(name = "message")
    private String message;
    
    @Size(max = 50)
    @Column(name = "type")
    private String type; // EMAIL, SMS, IN_APP, PUSH
    
    @Size(max = 50)
    @Column(name = "method")
    private String method; // EMAIL, SMS, IN_APP, PUSH
    
    @Column(name = "is_sent", nullable = false)
    private Boolean isSent = false;
    
    @Column(name = "sent_date_time")
    private LocalDateTime sentDateTime;
    
    // Constructors
    public Reminder() {}
    
    public Reminder(User user, LocalDateTime reminderDateTime, String message, String type) {
        this.user = user;
        this.reminderDateTime = reminderDateTime;
        this.message = message;
        this.type = type;
    }
    
    // Getters and Setters
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public Task getTask() {
        return task;
    }
    
    public void setTask(Task task) {
        this.task = task;
    }
    
    public LocalDateTime getReminderDateTime() {
        return reminderDateTime;
    }
    
    public void setReminderDateTime(LocalDateTime reminderDateTime) {
        this.reminderDateTime = reminderDateTime;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Boolean getIsSent() {
        return isSent;
    }
    
    public void setIsSent(Boolean isSent) {
        this.isSent = isSent;
    }
    
    public LocalDateTime getSentDateTime() {
        return sentDateTime;
    }
    
    public void setSentDateTime(LocalDateTime sentDateTime) {
        this.sentDateTime = sentDateTime;
    }
    
    public String getMethod() {
        return method;
    }
    
    public void setMethod(String method) {
        this.method = method;
    }
    
    public LocalDateTime getReminderTime() {
        return reminderDateTime;
    }
    
    public void setSent(boolean sent) {
        this.isSent = sent;
        if (sent) {
            this.sentDateTime = LocalDateTime.now();
        }
    }
}
