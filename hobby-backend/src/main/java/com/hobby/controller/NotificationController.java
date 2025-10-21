package com.hobby.controller;

import com.hobby.model.notification.Notification;
import com.hobby.model.notification.Reminder;
import com.hobby.model.user.User;
import com.hobby.service.notification.NotificationService;
import com.hobby.service.notification.ReminderService;
import com.hobby.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private UserService userService;

    // Get all notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.findAll();
        return ResponseEntity.ok(notifications);
    }

    // Get notification by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.findById(id);
        return notification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get notifications by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            List<Notification> notifications = notificationService.findByUser(user.get());
            return ResponseEntity.ok(notifications);
        }
        return ResponseEntity.notFound().build();
    }

    // Get unread notifications by user
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            List<Notification> notifications = notificationService.findByUserAndIsReadFalse(user.get());
            return ResponseEntity.ok(notifications);
        }
        return ResponseEntity.notFound().build();
    }

    // Get notification count by user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getNotificationCountByUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            long count = notificationService.countByUserAndIsReadFalse(user.get());
            return ResponseEntity.ok(count);
        }
        return ResponseEntity.notFound().build();
    }

    // Create notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        try {
            Notification createdNotification = notificationService.save(notification);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdNotification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update notification
    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notification) {
        Optional<Notification> existingNotification = notificationService.findById(id);
        if (existingNotification.isPresent()) {
            notification.setId(id);
            Notification updatedNotification = notificationService.save(notification);
            return ResponseEntity.ok(updatedNotification);
        }
        return ResponseEntity.notFound().build();
    }

    // Mark notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.findById(id);
        if (notification.isPresent()) {
            notification.get().setRead(true);
            Notification updatedNotification = notificationService.save(notification.get());
            return ResponseEntity.ok(updatedNotification);
        }
        return ResponseEntity.notFound().build();
    }

    // Mark all notifications as read for user
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            notificationService.markAllAsReadForUser(user.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.findById(id);
        if (notification.isPresent()) {
            notificationService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get all reminders
    @GetMapping("/reminders")
    public ResponseEntity<List<Reminder>> getAllReminders() {
        List<Reminder> reminders = reminderService.findAll();
        return ResponseEntity.ok(reminders);
    }

    // Get reminder by ID
    @GetMapping("/reminders/{id}")
    public ResponseEntity<Reminder> getReminderById(@PathVariable Long id) {
        Optional<Reminder> reminder = reminderService.findById(id);
        return reminder.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get reminders by user
    @GetMapping("/reminders/user/{userId}")
    public ResponseEntity<List<Reminder>> getRemindersByUser(@PathVariable Long userId) {
        Optional<User> user = userService.findById(userId);
        if (user.isPresent()) {
            List<Reminder> reminders = reminderService.findByUser(user.get());
            return ResponseEntity.ok(reminders);
        }
        return ResponseEntity.notFound().build();
    }

    // Get pending reminders
    @GetMapping("/reminders/pending")
    public ResponseEntity<List<Reminder>> getPendingReminders() {
        List<Reminder> reminders = reminderService.findByReminderTimeBeforeAndIsSentFalse(LocalDateTime.now());
        return ResponseEntity.ok(reminders);
    }

    // Create reminder
    @PostMapping("/reminders")
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder) {
        try {
            Reminder createdReminder = reminderService.save(reminder);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReminder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update reminder
    @PutMapping("/reminders/{id}")
    public ResponseEntity<Reminder> updateReminder(@PathVariable Long id, @RequestBody Reminder reminder) {
        Optional<Reminder> existingReminder = reminderService.findById(id);
        if (existingReminder.isPresent()) {
            reminder.setId(id);
            Reminder updatedReminder = reminderService.save(reminder);
            return ResponseEntity.ok(updatedReminder);
        }
        return ResponseEntity.notFound().build();
    }

    // Mark reminder as sent
    @PutMapping("/reminders/{id}/sent")
    public ResponseEntity<Reminder> markReminderAsSent(@PathVariable Long id) {
        Optional<Reminder> reminder = reminderService.findById(id);
        if (reminder.isPresent()) {
            reminder.get().setSent(true);
            Reminder updatedReminder = reminderService.save(reminder.get());
            return ResponseEntity.ok(updatedReminder);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete reminder
    @DeleteMapping("/reminders/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        Optional<Reminder> reminder = reminderService.findById(id);
        if (reminder.isPresent()) {
            reminderService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
