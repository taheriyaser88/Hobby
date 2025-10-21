package com.hobby.controller;

import com.hobby.model.event.Event;
import com.hobby.model.event.EventCategory;
import com.hobby.model.event.EventParticipant;
import com.hobby.model.user.User;
import com.hobby.service.event.EventService;
import com.hobby.service.event.EventCategoryService;
import com.hobby.service.event.EventParticipantService;
import com.hobby.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventCategoryService eventCategoryService;

    @Autowired
    private EventParticipantService eventParticipantService;

    @Autowired
    private UserService userService;

    // Get all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.findAll();
        return ResponseEntity.ok(events);
    }

    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.findById(id);
        return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new event
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        try {
            Event createdEvent = eventService.save(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update event
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        Optional<Event> existingEvent = eventService.findById(id);
        if (existingEvent.isPresent()) {
            event.setId(id);
            Event updatedEvent = eventService.save(event);
            return ResponseEntity.ok(updatedEvent);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        Optional<Event> event = eventService.findById(id);
        if (event.isPresent()) {
            eventService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get events by organizer
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long organizerId) {
        Optional<User> organizer = userService.findById(organizerId);
        if (organizer.isPresent()) {
            List<Event> events = eventService.findByOrganizer(organizer.get());
            return ResponseEntity.ok(events);
        }
        return ResponseEntity.notFound().build();
    }

    // Get upcoming events
    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        List<Event> events = eventService.findUpcomingEvents(LocalDateTime.now());
        return ResponseEntity.ok(events);
    }

    // Search events by title
    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String keyword) {
        List<Event> events = eventService.searchEvents(keyword);
        return ResponseEntity.ok(events);
    }

    // Get events by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable Long categoryId) {
        Optional<EventCategory> category = eventCategoryService.findById(categoryId);
        if (category.isPresent()) {
            List<Event> events = eventService.findByCategory(category.get());
            return ResponseEntity.ok(events);
        }
        return ResponseEntity.notFound().build();
    }

    // Add participant to event
    @PostMapping("/{eventId}/participants")
    public ResponseEntity<EventParticipant> addParticipant(
            @PathVariable Long eventId,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "INVITED") String status) {
        try {
            Optional<Event> event = eventService.findById(eventId);
            Optional<User> user = userService.findById(userId);
            
            if (event.isPresent() && user.isPresent()) {
                EventParticipant participant = eventParticipantService.addParticipant(
                    event.get(), user.get(), status.equals("ACCEPTED"));
                return ResponseEntity.status(HttpStatus.CREATED).body(participant);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get event participants
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<EventParticipant>> getEventParticipants(@PathVariable Long eventId) {
        Optional<Event> event = eventService.findById(eventId);
        if (event.isPresent()) {
            List<EventParticipant> participants = eventParticipantService.findByEvent(event.get());
            return ResponseEntity.ok(participants);
        }
        return ResponseEntity.notFound().build();
    }

    // Update participant status
    @PutMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<EventParticipant> updateParticipantStatus(
            @PathVariable Long eventId,
            @PathVariable Long userId,
            @RequestParam String status) {
        try {
            Optional<Event> event = eventService.findById(eventId);
            Optional<User> user = userService.findById(userId);
            
            if (event.isPresent() && user.isPresent()) {
                EventParticipant participant = eventParticipantService.updateParticipantStatus(
                    event.get(), user.get(), status.equals("ACCEPTED"));
                return ResponseEntity.ok(participant);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Remove participant from event
    @DeleteMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<Void> removeParticipant(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        try {
            Optional<Event> event = eventService.findById(eventId);
            Optional<User> user = userService.findById(userId);
            
            if (event.isPresent() && user.isPresent()) {
                eventParticipantService.removeParticipant(event.get(), user.get());
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
