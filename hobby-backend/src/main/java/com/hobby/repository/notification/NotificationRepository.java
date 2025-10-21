package com.hobby.repository.notification;

import com.hobby.model.notification.Notification;
import com.hobby.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUser(User user);
    
    List<Notification> findByUserAndIsReadFalse(User user);
    
    List<Notification> findByUserAndIsReadTrue(User user);
    
    List<Notification> findByType(String type);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.type = :type")
    List<Notification> findByUserAndType(@Param("user") User user, @Param("type") String type);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.sentDateTime >= :startDate")
    List<Notification> findByUserAndSentDateAfter(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.title LIKE %:title%")
    List<Notification> findByUserAndTitleContaining(@Param("user") User user, @Param("title") String title);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    Long countUnreadByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user")
    Long countByUser(@Param("user") User user);
    
    @Query("SELECT n FROM Notification n WHERE n.sentDateTime IS NULL")
    List<Notification> findUnsentNotifications();
    
    List<Notification> findBySentDateTimeAfter(LocalDateTime sentDateTime);
    
    Long countByUserAndIsReadFalse(User user);
}
