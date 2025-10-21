package com.hobby.controller;

import com.hobby.model.event.Event;
import com.hobby.model.user.User;
import com.hobby.service.event.EventService;
import com.hobby.service.event.EventCategoryService;
import com.hobby.service.event.EventParticipantService;
import com.hobby.service.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventController.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @MockBean
    private EventCategoryService eventCategoryService;

    @MockBean
    private EventParticipantService eventParticipantService;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetAllEvents() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        when(eventService.findAll()).thenReturn(events);

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Test Event"));
    }

    @Test
    void testGetEventById() throws Exception {
        when(eventService.findById(1L)).thenReturn(Optional.of(testEvent));

        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value("Test Event"));
    }

    @Test
    void testGetEventByIdNotFound() throws Exception {
        when(eventService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateEvent() throws Exception {
        when(eventService.save(any(Event.class))).thenReturn(testEvent);

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value("Test Event"));
    }

    @Test
    void testUpdateEvent() throws Exception {
        when(eventService.findById(1L)).thenReturn(Optional.of(testEvent));
        when(eventService.save(any(Event.class))).thenReturn(testEvent);

        mockMvc.perform(put("/api/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value("Test Event"));
    }

    @Test
    void testUpdateEventNotFound() throws Exception {
        when(eventService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteEvent() throws Exception {
        when(eventService.findById(1L)).thenReturn(Optional.of(testEvent));

        mockMvc.perform(delete("/api/events/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteEventNotFound() throws Exception {
        when(eventService.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/events/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetEventsByOrganizer() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        when(userService.findById(1L)).thenReturn(Optional.of(testUser));
        when(eventService.findByOrganizer(testUser)).thenReturn(events);

        mockMvc.perform(get("/api/events/organizer/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Test Event"));
    }

    @Test
    void testGetUpcomingEvents() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        when(eventService.findUpcomingEvents(any(LocalDateTime.class))).thenReturn(events);

        mockMvc.perform(get("/api/events/upcoming"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Test Event"));
    }

    @Test
    void testSearchEvents() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        when(eventService.searchEvents("test")).thenReturn(events);

        mockMvc.perform(get("/api/events/search")
                .param("keyword", "test"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Test Event"));
    }
}
