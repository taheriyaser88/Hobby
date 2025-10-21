package com.hobby.repository.notification;

import com.hobby.model.event.Event;
import com.hobby.model.notification.Reminder;
import com.hobby.model.task.Task;
import com.hobby.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    
    List<Reminder> findByUser(User user);
    
    List<Reminder> findByEvent(Event event);
    
    List<Reminder> findByTask(Task task);
    
    List<Reminder> findByIsSentFalse();
    
    List<Reminder> findByIsSentTrue();
    
    @Query("SELECT r FROM Reminder r WHERE r.user = :user AND r.isSent = false")
    List<Reminder> findUnsentByUser(@Param("user") User user);
    
    @Query("SELECT r FROM Reminder r WHERE r.reminderDateTime <= :dateTime AND r.isSent = false")
    List<Reminder> findDueReminders(@Param("dateTime") LocalDateTime dateTime);
    
    @Query("SELECT r FROM Reminder r WHERE r.user = :user AND r.reminderDateTime <= :dateTime AND r.isSent = false")
    List<Reminder> findDueRemindersByUser(@Param("user") User user, @Param("dateTime") LocalDateTime dateTime);
    
    @Query("SELECT r FROM Reminder r WHERE r.type = :type")
    List<Reminder> findByType(@Param("type") String type);
    
    @Query("SELECT r FROM Reminder r WHERE r.user = :user AND r.type = :type")
    List<Reminder> findByUserAndType(@Param("user") User user, @Param("type") String type);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.user = :user AND r.isSent = false")
    Long countUnsentByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.event = :event")
    Long countByEvent(@Param("event") Event event);
    
    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.task = :task")
    Long countByTask(@Param("task") Task task);
    
    List<Reminder> findByReminderDateTimeBeforeAndIsSentFalse(LocalDateTime reminderDateTime);
    
    Long countByUserAndIsSentFalse(User user);
}
