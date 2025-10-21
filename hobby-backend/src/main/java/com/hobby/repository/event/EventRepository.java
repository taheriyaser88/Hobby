package com.hobby.repository.event;

import com.hobby.model.event.Event;
import com.hobby.model.common.EventType;
import com.hobby.model.common.EventPrivacy;
import com.hobby.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByOrganizer(User organizer);
    
    List<Event> findByEventType(EventType eventType);
    
    List<Event> findByPrivacy(EventPrivacy privacy);
    
    List<Event> findByIsRecurringTrue();
    
    @Query("SELECT e FROM Event e WHERE e.startDateTime >= :startDate AND e.endDateTime <= :endDate")
    List<Event> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.startDateTime >= :startDate")
    List<Event> findByStartDateAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT e FROM Event e WHERE e.endDateTime <= :endDate")
    List<Event> findByEndDateBefore(@Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.title LIKE %:title%")
    List<Event> findByTitleContaining(@Param("title") String title);
    
    @Query("SELECT e FROM Event e WHERE e.location LIKE %:location%")
    List<Event> findByLocationContaining(@Param("location") String location);
    
    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.user = :user")
    List<Event> findByParticipant(@Param("user") User user);
    
    @Query("SELECT e FROM Event e WHERE e.organizer = :organizer AND e.startDateTime >= :startDate")
    List<Event> findByOrganizerAndStartDateAfter(@Param("organizer") User organizer, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(e) FROM Event e WHERE e.organizer = :organizer")
    Long countByOrganizer(@Param("organizer") User organizer);
    
    List<Event> findByStartDateTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    List<Event> findByCategory(com.hobby.model.event.EventCategory category);
}
