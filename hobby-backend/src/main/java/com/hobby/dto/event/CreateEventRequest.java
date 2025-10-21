package com.hobby.dto.event;

import com.hobby.model.common.EventType;
import com.hobby.model.common.EventPrivacy;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Event type is required")
    private EventType eventType;

    @NotNull(message = "Privacy is required")
    private EventPrivacy privacy;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Size(max = 2048, message = "Google Meet link must not exceed 2048 characters")
    private String googleMeetLink;

    private boolean isRecurring = false;

    @NotNull(message = "Organizer ID is required")
    private Long organizerId;

    private Long categoryId;

    // Constructors
    public CreateEventRequest() {}

    public CreateEventRequest(String title, String description, EventType eventType, EventPrivacy privacy,
                             LocalDateTime startTime, LocalDateTime endTime, String location,
                             String googleMeetLink, boolean isRecurring, Long organizerId, Long categoryId) {
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.privacy = privacy;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.googleMeetLink = googleMeetLink;
        this.isRecurring = isRecurring;
        this.organizerId = organizerId;
        this.categoryId = categoryId;
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

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
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

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
