package com.hobby.repository.event;

import com.hobby.model.event.Event;
import com.hobby.model.event.EventParticipant;
import com.hobby.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    
    List<EventParticipant> findByEvent(Event event);
    
    List<EventParticipant> findByUser(User user);
    
    Optional<EventParticipant> findByEventAndUser(Event event, User user);
    
    @Query("SELECT ep FROM EventParticipant ep WHERE ep.event = :event AND ep.isAttending = true")
    List<EventParticipant> findByEventAndAttending(@Param("event") Event event);
    
    @Query("SELECT ep FROM EventParticipant ep WHERE ep.event = :event AND ep.isAttending = false")
    List<EventParticipant> findByEventAndNotAttending(@Param("event") Event event);
    
    @Query("SELECT ep FROM EventParticipant ep WHERE ep.user = :user AND ep.isAttending = true")
    List<EventParticipant> findByUserAndAttending(@Param("user") User user);
    
    @Query("SELECT COUNT(ep) FROM EventParticipant ep WHERE ep.event = :event AND ep.isAttending = true")
    Long countAttendingByEvent(@Param("event") Event event);
    
    @Query("SELECT COUNT(ep) FROM EventParticipant ep WHERE ep.event = :event")
    Long countByEvent(@Param("event") Event event);
    
    boolean existsByEventAndUser(Event event, User user);
    
    Long countByUser(User user);
}
