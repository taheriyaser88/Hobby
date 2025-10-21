package com.hobby.model.notification;

import com.hobby.model.common.BaseEntity;
import com.hobby.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "title", nullable = false)
    private String title;
    
    @Size(max = 1000)
    @Column(name = "message")
    private String message;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    @Column(name = "read_date_time")
    private LocalDateTime readDateTime;
    
    @Size(max = 50)
    @Column(name = "type")
    private String type; // EMAIL, SMS, IN_APP, PUSH
    
    @Size(max = 200)
    @Column(name = "action_url")
    private String actionUrl;
    
    @Size(max = 500)
    @Column(name = "link")
    private String link;
    
    @Column(name = "sent_date_time")
    private LocalDateTime sentDateTime;
    
    // Constructors
    public Notification() {}
    
    public Notification(String title, String message, User user, String type) {
        this.title = title;
        this.message = message;
        this.user = user;
        this.type = type;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public LocalDateTime getReadDateTime() {
        return readDateTime;
    }
    
    public void setReadDateTime(LocalDateTime readDateTime) {
        this.readDateTime = readDateTime;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getActionUrl() {
        return actionUrl;
    }
    
    public void setActionUrl(String actionUrl) {
        this.actionUrl = actionUrl;
    }
    
    public LocalDateTime getSentDateTime() {
        return sentDateTime;
    }
    
    public void setSentDateTime(LocalDateTime sentDateTime) {
        this.sentDateTime = sentDateTime;
    }
    
    public String getLink() {
        return link;
    }
    
    public void setLink(String link) {
        this.link = link;
    }
    
    public void setRead(boolean read) {
        this.isRead = read;
        if (read) {
            this.readDateTime = LocalDateTime.now();
        }
    }
}
