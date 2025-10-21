package com.hobby.service.google;

import com.hobby.model.event.Event;
import com.hobby.model.user.User;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventAttendee;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class GoogleCalendarService {

    @Value("${google.credentials.file.path:}")
    private String credentialsFilePath;

    @Value("${google.application.name:Hobby Manager}")
    private String applicationName;

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Arrays.asList(CalendarScopes.CALENDAR);

    public com.google.api.services.calendar.model.Event createEvent(Event event, User user) throws IOException, GeneralSecurityException {
        Calendar service = getCalendarService(user);
        
        com.google.api.services.calendar.model.Event googleEvent = new com.google.api.services.calendar.model.Event()
                .setSummary(event.getTitle())
                .setDescription(event.getDescription())
                .setLocation(event.getLocation());

        // Set start time
        ZonedDateTime startTime = event.getStartTime().atZone(ZoneId.systemDefault());
        EventDateTime start = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(startTime.toInstant().toEpochMilli()))
                .setTimeZone(ZoneId.systemDefault().getId());
        googleEvent.setStart(start);

        // Set end time
        ZonedDateTime endTime = event.getEndTime().atZone(ZoneId.systemDefault());
        EventDateTime end = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(endTime.toInstant().toEpochMilli()))
                .setTimeZone(ZoneId.systemDefault().getId());
        googleEvent.setEnd(end);

        // Add attendees
        if (event.getParticipants() != null && !event.getParticipants().isEmpty()) {
            List<EventAttendee> attendees = event.getParticipants().stream()
                    .map(participant -> new EventAttendee().setEmail(participant.getUser().getEmail()))
                    .toList();
            googleEvent.setAttendees(attendees);
        }

        // Create the event
        return service.events().insert("primary", googleEvent).execute();
    }

    public com.google.api.services.calendar.model.Event updateEvent(Event event, User user, String googleEventId) throws IOException, GeneralSecurityException {
        Calendar service = getCalendarService(user);
        
        com.google.api.services.calendar.model.Event googleEvent = service.events().get("primary", googleEventId).execute();
        
        googleEvent.setSummary(event.getTitle())
                .setDescription(event.getDescription())
                .setLocation(event.getLocation());

        // Update start time
        ZonedDateTime startTime = event.getStartTime().atZone(ZoneId.systemDefault());
        EventDateTime start = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(startTime.toInstant().toEpochMilli()))
                .setTimeZone(ZoneId.systemDefault().getId());
        googleEvent.setStart(start);

        // Update end time
        ZonedDateTime endTime = event.getEndTime().atZone(ZoneId.systemDefault());
        EventDateTime end = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(endTime.toInstant().toEpochMilli()))
                .setTimeZone(ZoneId.systemDefault().getId());
        googleEvent.setEnd(end);

        // Update attendees
        if (event.getParticipants() != null && !event.getParticipants().isEmpty()) {
            List<EventAttendee> attendees = event.getParticipants().stream()
                    .map(participant -> new EventAttendee().setEmail(participant.getUser().getEmail()))
                    .toList();
            googleEvent.setAttendees(attendees);
        }

        // Update the event
        return service.events().update("primary", googleEventId, googleEvent).execute();
    }

    public void deleteEvent(User user, String googleEventId) throws IOException, GeneralSecurityException {
        Calendar service = getCalendarService(user);
        service.events().delete("primary", googleEventId).execute();
    }

    public com.google.api.services.calendar.model.Event getEvent(User user, String googleEventId) throws IOException, GeneralSecurityException {
        Calendar service = getCalendarService(user);
        return service.events().get("primary", googleEventId).execute();
    }

    private Calendar getCalendarService(User user) throws IOException, GeneralSecurityException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        
        // TODO: Implement proper credential handling for user
        // This is a simplified version - in production, you'd need to handle OAuth2 tokens properly
        Credential credential = getCredential(user);
        
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(applicationName)
                .build();
    }

    private Credential getCredential(User user) {
        // TODO: Implement proper credential retrieval for user
        // This should retrieve the user's OAuth2 token from the database
        // For now, return null - this needs to be implemented based on your OAuth2 flow
        return null;
    }
}
