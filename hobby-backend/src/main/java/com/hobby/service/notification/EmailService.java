package com.hobby.service.notification;

import com.hobby.model.notification.Notification;
import com.hobby.model.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name:Hobby Manager}")
    private String appName;

    public void sendNotificationEmail(Notification notification) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(notification.getUser().getEmail());
            message.setSubject(appName + " - " + notification.getMessage());
            message.setText(buildEmailContent(notification));
            
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't throw exception to avoid breaking the main flow
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    public void sendEventReminderEmail(User user, String eventTitle, String eventTime, String eventLocation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject(appName + " - Event Reminder: " + eventTitle);
            message.setText(buildEventReminderContent(user, eventTitle, eventTime, eventLocation));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send event reminder email: " + e.getMessage());
        }
    }

    public void sendTaskReminderEmail(User user, String taskTitle, String taskDueDate) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject(appName + " - Task Reminder: " + taskTitle);
            message.setText(buildTaskReminderContent(user, taskTitle, taskDueDate));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send task reminder email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to " + appName + "!");
            message.setText(buildWelcomeEmailContent(user));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    private String buildEmailContent(Notification notification) {
        StringBuilder content = new StringBuilder();
        content.append("Hello ").append(notification.getUser().getFirstName()).append(",\n\n");
        content.append(notification.getMessage()).append("\n\n");
        
        if (notification.getLink() != null && !notification.getLink().isEmpty()) {
            content.append("Click here to view: ").append(notification.getLink()).append("\n\n");
        }
        
        content.append("Best regards,\n");
        content.append(appName).append(" Team");
        
        return content.toString();
    }

    private String buildEventReminderContent(User user, String eventTitle, String eventTime, String eventLocation) {
        StringBuilder content = new StringBuilder();
        content.append("Hello ").append(user.getFirstName()).append(",\n\n");
        content.append("This is a reminder for your upcoming event:\n\n");
        content.append("Event: ").append(eventTitle).append("\n");
        content.append("Time: ").append(eventTime).append("\n");
        
        if (eventLocation != null && !eventLocation.isEmpty()) {
            content.append("Location: ").append(eventLocation).append("\n");
        }
        
        content.append("\nWe hope to see you there!\n\n");
        content.append("Best regards,\n");
        content.append(appName).append(" Team");
        
        return content.toString();
    }

    private String buildTaskReminderContent(User user, String taskTitle, String taskDueDate) {
        StringBuilder content = new StringBuilder();
        content.append("Hello ").append(user.getFirstName()).append(",\n\n");
        content.append("This is a reminder for your upcoming task:\n\n");
        content.append("Task: ").append(taskTitle).append("\n");
        content.append("Due Date: ").append(taskDueDate).append("\n\n");
        content.append("Don't forget to complete it on time!\n\n");
        content.append("Best regards,\n");
        content.append(appName).append(" Team");
        
        return content.toString();
    }

    private String buildWelcomeEmailContent(User user) {
        StringBuilder content = new StringBuilder();
        content.append("Hello ").append(user.getFirstName()).append(",\n\n");
        content.append("Welcome to ").append(appName).append("!\n\n");
        content.append("We're excited to have you on board. You can now:\n");
        content.append("- Create and manage events\n");
        content.append("- Organize tasks and deadlines\n");
        content.append("- Connect with other users\n");
        content.append("- Track your progress and achievements\n\n");
        content.append("If you have any questions, feel free to reach out to our support team.\n\n");
        content.append("Best regards,\n");
        content.append(appName).append(" Team");
        
        return content.toString();
    }
}
