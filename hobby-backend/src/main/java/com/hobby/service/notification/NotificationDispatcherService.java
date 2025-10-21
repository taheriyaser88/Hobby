package com.hobby.service.notification;

import com.hobby.model.notification.Notification;
import com.hobby.model.notification.Reminder;
import com.hobby.model.user.User;
import com.hobby.service.notification.NotificationService;
import com.hobby.service.notification.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationDispatcherService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SMSService smsService;

    @Scheduled(fixedRate = 60000) // Run every minute
    public void processPendingReminders() {
        List<Reminder> pendingReminders = reminderService.findByReminderTimeBeforeAndIsSentFalse(LocalDateTime.now());
        
        for (Reminder reminder : pendingReminders) {
            processReminder(reminder);
        }
    }

    @Async
    public void processReminder(Reminder reminder) {
        try {
            User user = reminder.getUser();
            String message = buildReminderMessage(reminder);
            
            // Create notification
            Notification notification = new Notification("Reminder", message, user, "REMINDER");
            notificationService.save(notification);
            
            // Send notifications based on method
            switch (reminder.getMethod().toUpperCase()) {
                case "EMAIL":
                    emailService.sendNotificationEmail(notification);
                    break;
                case "SMS":
                    smsService.sendNotificationSMS(notification);
                    break;
                case "IN_APP":
                    // In-app notifications are handled by the notification service
                    break;
                case "ALL":
                    emailService.sendNotificationEmail(notification);
                    smsService.sendNotificationSMS(notification);
                    break;
            }
            
            // Mark reminder as sent
            reminder.setSent(true);
            reminderService.save(reminder);
            
        } catch (Exception e) {
            System.err.println("Failed to process reminder: " + e.getMessage());
        }
    }

    @Async
    public void sendEventNotification(User user, String eventTitle, String eventTime, String eventLocation) {
        try {
            // Send email notification
            emailService.sendEventReminderEmail(user, eventTitle, eventTime, eventLocation);
            
            // Send SMS notification if enabled
            smsService.sendEventReminderSMS(user, eventTitle, eventTime);
            
            // Create in-app notification
            String message = "Event reminder: " + eventTitle + " at " + eventTime;
            Notification notification = new Notification("Event Reminder", message, user, "EVENT_REMINDER");
            notificationService.save(notification);
            
        } catch (Exception e) {
            System.err.println("Failed to send event notification: " + e.getMessage());
        }
    }

    @Async
    public void sendTaskNotification(User user, String taskTitle, String taskDueDate) {
        try {
            // Send email notification
            emailService.sendTaskReminderEmail(user, taskTitle, taskDueDate);
            
            // Send SMS notification if enabled
            smsService.sendTaskReminderSMS(user, taskTitle, taskDueDate);
            
            // Create in-app notification
            String message = "Task reminder: " + taskTitle + " due " + taskDueDate;
            Notification notification = new Notification("Task Reminder", message, user, "TASK_REMINDER");
            notificationService.save(notification);
            
        } catch (Exception e) {
            System.err.println("Failed to send task notification: " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeNotification(User user) {
        try {
            // Send welcome email
            emailService.sendWelcomeEmail(user);
            
            // Create in-app notification
            String message = "Welcome to " + user.getFirstName() + "! We're excited to have you on board.";
            Notification notification = new Notification("Welcome", message, user, "WELCOME");
            notificationService.save(notification);
            
        } catch (Exception e) {
            System.err.println("Failed to send welcome notification: " + e.getMessage());
        }
    }

    private String buildReminderMessage(Reminder reminder) {
        StringBuilder message = new StringBuilder();
        
        if (reminder.getEvent() != null) {
            message.append("Event Reminder: ").append(reminder.getEvent().getTitle());
            if (reminder.getEvent().getStartTime() != null) {
                message.append(" at ").append(reminder.getEvent().getStartTime());
            }
        } else if (reminder.getTask() != null) {
            message.append("Task Reminder: ").append(reminder.getTask().getTitle());
            if (reminder.getTask().getDueDate() != null) {
                message.append(" due ").append(reminder.getTask().getDueDate());
            }
        } else {
            message.append("Reminder: ").append(reminder.getReminderTime());
        }
        
        return message.toString();
    }
}
