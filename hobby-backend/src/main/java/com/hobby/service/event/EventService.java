package com.hobby.service.event;

import com.hobby.model.event.Event;
import com.hobby.model.common.EventType;
import com.hobby.model.common.EventPrivacy;
import com.hobby.model.user.User;
import com.hobby.repository.event.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event save(Event event) {
        return eventRepository.save(event);
    }

    public Optional<Event> findById(Long id) {
        return eventRepository.findById(id);
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public List<Event> findByOrganizer(User organizer) {
        return eventRepository.findByOrganizer(organizer);
    }

    public List<Event> findByEventType(EventType eventType) {
        return eventRepository.findByEventType(eventType);
    }

    public List<Event> findByPrivacy(EventPrivacy privacy) {
        return eventRepository.findByPrivacy(privacy);
    }

    public List<Event> findRecurringEvents() {
        return eventRepository.findByIsRecurringTrue();
    }

    public List<Event> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findByDateRange(startDate, endDate);
    }

    public List<Event> findUpcomingEvents(LocalDateTime now) {
        return eventRepository.findByStartDateTimeBetween(now, now.plusYears(1)); // Example: next year
    }

    public List<Event> findPastEvents(LocalDateTime endDate) {
        return eventRepository.findByEndDateBefore(endDate);
    }

    public List<Event> searchByTitle(String title) {
        return eventRepository.findByTitleContaining(title);
    }

    public List<Event> searchByLocation(String location) {
        return eventRepository.findByLocationContaining(location);
    }
    
    public List<Event> searchEvents(String keyword) {
        return eventRepository.findByTitleContaining(keyword);
    }
    
    public List<Event> findByCategory(com.hobby.model.event.EventCategory category) {
        return eventRepository.findByCategory(category);
    }

    public List<Event> findByParticipant(User user) {
        return eventRepository.findByParticipant(user);
    }

    public List<Event> findUserUpcomingEvents(User organizer, LocalDateTime startDate) {
        return eventRepository.findByOrganizerAndStartDateAfter(organizer, startDate);
    }

    public long countEventsByOrganizer(User organizer) {
        return eventRepository.countByOrganizer(organizer);
    }

    public void deleteById(Long id) {
        eventRepository.deleteById(id);
    }

    public long count() {
        return eventRepository.count();
    }

    public Event createEvent(String title, String description, EventType eventType, EventPrivacy privacy,
                           LocalDateTime startTime, LocalDateTime endTime, String location,
                           String googleMeetLink, boolean isRecurring, User organizer) {
        Event event = new Event(title, description, eventType, privacy, startTime, endTime, organizer);
        event.setLocation(location);
        event.setGoogleMeetLink(googleMeetLink);
        event.setIsRecurring(isRecurring);
        return eventRepository.save(event);
    }
}
