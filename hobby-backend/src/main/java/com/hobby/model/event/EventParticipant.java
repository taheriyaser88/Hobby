package com.hobby.model.event;

import com.hobby.model.common.BaseEntity;
import com.hobby.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "event_participants")
public class EventParticipant extends BaseEntity {
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "is_attending")
    private Boolean isAttending;
    
    @Column(name = "response_date")
    private java.time.LocalDateTime responseDate;
    
    @Size(max = 500)
    @Column(name = "notes")
    private String notes;
    
    // Constructors
    public EventParticipant() {}
    
    public EventParticipant(Event event, User user) {
        this.event = event;
        this.user = user;
    }
    
    // Getters and Setters
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Boolean getIsAttending() {
        return isAttending;
    }
    
    public void setIsAttending(Boolean isAttending) {
        this.isAttending = isAttending;
    }
    
    public java.time.LocalDateTime getResponseDate() {
        return responseDate;
    }
    
    public void setResponseDate(java.time.LocalDateTime responseDate) {
        this.responseDate = responseDate;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}
