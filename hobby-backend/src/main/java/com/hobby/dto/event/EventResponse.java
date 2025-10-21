package com.hobby.dto.event;

import com.hobby.model.common.EventType;
import com.hobby.model.common.EventPrivacy;
import com.hobby.dto.user.UserResponse;
import com.hobby.dto.event.EventCategoryResponse;

import java.time.LocalDateTime;
import java.util.List;

public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private EventType eventType;
    private EventPrivacy privacy;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String googleMeetLink;
    private boolean isRecurring;
    private UserResponse organizer;
    private EventCategoryResponse category;
    private List<EventParticipantResponse> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public EventResponse() {}

    public EventResponse(Long id, String title, String description, EventType eventType, EventPrivacy privacy,
                        LocalDateTime startTime, LocalDateTime endTime, String location,
                        String googleMeetLink, boolean isRecurring, UserResponse organizer,
                        EventCategoryResponse category, List<EventParticipantResponse> participants,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.privacy = privacy;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.googleMeetLink = googleMeetLink;
        this.isRecurring = isRecurring;
        this.organizer = organizer;
        this.category = category;
        this.participants = participants;
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

    public UserResponse getOrganizer() {
        return organizer;
    }

    public void setOrganizer(UserResponse organizer) {
        this.organizer = organizer;
    }

    public EventCategoryResponse getCategory() {
        return category;
    }

    public void setCategory(EventCategoryResponse category) {
        this.category = category;
    }

    public List<EventParticipantResponse> getParticipants() {
        return participants;
    }

    public void setParticipants(List<EventParticipantResponse> participants) {
        this.participants = participants;
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
