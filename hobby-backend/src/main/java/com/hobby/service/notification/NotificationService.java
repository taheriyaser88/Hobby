package com.hobby.service.notification;

import com.hobby.model.notification.Notification;
import com.hobby.model.user.User;
import com.hobby.repository.notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    public List<Notification> findByUser(User user) {
        return notificationRepository.findByUser(user);
    }

    public List<Notification> findByUserAndIsReadFalse(User user) {
        return notificationRepository.findByUserAndIsReadFalse(user);
    }

    public List<Notification> findBySentAtAfter(LocalDateTime dateTime) {
        return notificationRepository.findBySentDateTimeAfter(dateTime);
    }

    public long countByUserAndIsReadFalse(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    public void deleteById(Long id) {
        notificationRepository.deleteById(id);
    }

    public long count() {
        return notificationRepository.count();
    }

    public void markAllAsReadForUser(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalse(user);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
}