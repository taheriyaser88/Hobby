package com.hobby.service;

import com.hobby.model.event.Event;
import com.hobby.model.user.User;
import com.hobby.repository.event.EventRepository;
import com.hobby.service.event.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@example.com");

        testEvent = new Event();
        testEvent.setId(1L);
        testEvent.setTitle("Test Event");
        testEvent.setDescription("Test Description");
        testEvent.setStartDateTime(LocalDateTime.now().plusDays(1));
        testEvent.setEndDateTime(LocalDateTime.now().plusDays(1).plusHours(2));
        testEvent.setOrganizer(testUser);
    }

    @Test
    void testSaveEvent() {
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        Event savedEvent = eventService.save(testEvent);

        assertNotNull(savedEvent);
        assertEquals(testEvent.getTitle(), savedEvent.getTitle());
        verify(eventRepository, times(1)).save(testEvent);
    }

    @Test
    void testFindEventById() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));

        Optional<Event> foundEvent = eventService.findById(1L);

        assertTrue(foundEvent.isPresent());
        assertEquals(testEvent.getTitle(), foundEvent.get().getTitle());
        verify(eventRepository, times(1)).findById(1L);
    }

    @Test
    void testFindEventByIdNotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Event> foundEvent = eventService.findById(1L);

        assertFalse(foundEvent.isPresent());
        verify(eventRepository, times(1)).findById(1L);
    }

    @Test
    void testFindAllEvents() {
        List<Event> events = Arrays.asList(testEvent);
        when(eventRepository.findAll()).thenReturn(events);

        List<Event> foundEvents = eventService.findAll();

        assertEquals(1, foundEvents.size());
        assertEquals(testEvent.getTitle(), foundEvents.get(0).getTitle());
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void testFindEventsByOrganizer() {
        List<Event> events = Arrays.asList(testEvent);
        when(eventRepository.findByOrganizer(testUser)).thenReturn(events);

        List<Event> foundEvents = eventService.findByOrganizer(testUser);

        assertEquals(1, foundEvents.size());
        assertEquals(testEvent.getTitle(), foundEvents.get(0).getTitle());
        verify(eventRepository, times(1)).findByOrganizer(testUser);
    }

    @Test
    void testDeleteEvent() {
        doNothing().when(eventRepository).deleteById(1L);

        eventService.deleteById(1L);

        verify(eventRepository, times(1)).deleteById(1L);
    }

    @Test
    void testCountEvents() {
        when(eventRepository.count()).thenReturn(1L);

        long count = eventService.count();

        assertEquals(1L, count);
        verify(eventRepository, times(1)).count();
    }
}
