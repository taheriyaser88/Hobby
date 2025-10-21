package com.hobby.model.event;

import com.hobby.model.common.BaseEntity;
import com.hobby.model.common.EventType;
import com.hobby.model.common.EventPrivacy;
import com.hobby.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
public class Event extends BaseEntity {
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "title", nullable = false)
    private String title;
    
    @Size(max = 2000)
    @Column(name = "description")
    private String description;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "privacy", nullable = false)
    private EventPrivacy privacy;
    
    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;
    
    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;
    
    @Size(max = 500)
    @Column(name = "location")
    private String location;
    
    @Size(max = 500)
    @Column(name = "google_meet_link")
    private String googleMeetLink;
    
    @Column(name = "is_recurring", nullable = false)
    private Boolean isRecurring = false;
    
    @Size(max = 50)
    @Column(name = "recurrence_pattern")
    private String recurrencePattern; // DAILY, WEEKLY, MONTHLY, YEARLY
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private EventCategory category;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<EventParticipant> participants = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "event_tags",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<com.hobby.model.tag.Tag> tags = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "event_labels",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    private Set<com.hobby.model.tag.Label> labels = new HashSet<>();
    
    // Constructors
    public Event() {}
    
    public Event(String title, String description, EventType eventType, EventPrivacy privacy,
                LocalDateTime startDateTime, LocalDateTime endDateTime, User organizer) {
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.privacy = privacy;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.organizer = organizer;
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
    
    public EventType getEventType() {
        return eventType;
    }
    
    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }
    
    public EventPrivacy getPrivacy() {
        return privacy;
    }
    
    public void setPrivacy(EventPrivacy privacy) {
        this.privacy = privacy;
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
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getGoogleMeetLink() {
        return googleMeetLink;
    }
    
    public void setGoogleMeetLink(String googleMeetLink) {
        this.googleMeetLink = googleMeetLink;
    }
    
    public Boolean getIsRecurring() {
        return isRecurring;
    }
    
    public void setIsRecurring(Boolean isRecurring) {
        this.isRecurring = isRecurring;
    }
    
    public String getRecurrencePattern() {
        return recurrencePattern;
    }
    
    public void setRecurrencePattern(String recurrencePattern) {
        this.recurrencePattern = recurrencePattern;
    }
    
    public User getOrganizer() {
        return organizer;
    }
    
    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }
    
    public EventCategory getCategory() {
        return category;
    }
    
    public void setCategory(EventCategory category) {
        this.category = category;
    }
    
    public Set<EventParticipant> getParticipants() {
        return participants;
    }
    
    public void setParticipants(Set<EventParticipant> participants) {
        this.participants = participants;
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
    
    public LocalDateTime getStartTime() {
        return startDateTime;
    }
    
    public LocalDateTime getEndTime() {
        return endDateTime;
    }
}
