package com.hobby.service.event;

import com.hobby.model.event.Event;
import com.hobby.model.event.EventParticipant;
import com.hobby.model.user.User;
import com.hobby.repository.event.EventParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventParticipantService {

    @Autowired
    private EventParticipantRepository eventParticipantRepository;

    public EventParticipant save(EventParticipant eventParticipant) {
        return eventParticipantRepository.save(eventParticipant);
    }

    public Optional<EventParticipant> findById(Long id) {
        return eventParticipantRepository.findById(id);
    }

    public List<EventParticipant> findByEvent(Event event) {
        return eventParticipantRepository.findByEvent(event);
    }

    public List<EventParticipant> findByUser(User user) {
        return eventParticipantRepository.findByUser(user);
    }

    public Optional<EventParticipant> findByEventAndUser(Event event, User user) {
        return eventParticipantRepository.findByEventAndUser(event, user);
    }

    public long countByEvent(Event event) {
        return eventParticipantRepository.countByEvent(event);
    }

    public long countByUser(User user) {
        return eventParticipantRepository.countByUser(user);
    }


    public boolean existsByEventAndUser(Event event, User user) {
        return eventParticipantRepository.existsByEventAndUser(event, user);
    }

    public void deleteById(Long id) {
        eventParticipantRepository.deleteById(id);
    }

    public long count() {
        return eventParticipantRepository.count();
    }

    public EventParticipant addParticipant(Event event, User user, Boolean isAttending) {
        if (eventParticipantRepository.existsByEventAndUser(event, user)) {
            throw new RuntimeException("User is already a participant in this event");
        }
        EventParticipant participant = new EventParticipant(event, user);
        participant.setIsAttending(isAttending);
        return eventParticipantRepository.save(participant);
    }

    public EventParticipant updateParticipantStatus(Event event, User user, Boolean isAttending) {
        Optional<EventParticipant> participant = eventParticipantRepository.findByEventAndUser(event, user);
        if (participant.isPresent()) {
            participant.get().setIsAttending(isAttending);
            return eventParticipantRepository.save(participant.get());
        }
        throw new RuntimeException("Participant not found");
    }

    public void removeParticipant(Event event, User user) {
        Optional<EventParticipant> participant = eventParticipantRepository.findByEventAndUser(event, user);
        if (participant.isPresent()) {
            eventParticipantRepository.delete(participant.get());
        }
    }
}
