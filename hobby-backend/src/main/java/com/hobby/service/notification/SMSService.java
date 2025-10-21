package com.hobby.service.notification;

import com.hobby.model.notification.Notification;
import com.hobby.model.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SMSService {

    @Value("${app.sms.provider:twilio}")
    private String smsProvider;

    @Value("${app.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${app.name:Hobby Manager}")
    private String appName;

    public void sendNotificationSMS(Notification notification) {
        if (!smsEnabled) {
            System.out.println("SMS notifications are disabled");
            return;
        }

        try {
            String message = buildSMSContent(notification);
            sendSMS(notification.getUser().getPhoneNumber(), message);
        } catch (Exception e) {
            System.err.println("Failed to send SMS notification: " + e.getMessage());
        }
    }

    public void sendEventReminderSMS(User user, String eventTitle, String eventTime) {
        if (!smsEnabled) {
            System.out.println("SMS notifications are disabled");
            return;
        }

        try {
            String message = buildEventReminderSMSContent(user, eventTitle, eventTime);
            sendSMS(user.getPhoneNumber(), message);
        } catch (Exception e) {
            System.err.println("Failed to send event reminder SMS: " + e.getMessage());
        }
    }

    public void sendTaskReminderSMS(User user, String taskTitle, String taskDueDate) {
        if (!smsEnabled) {
            System.out.println("SMS notifications are disabled");
            return;
        }

        try {
            String message = buildTaskReminderSMSContent(user, taskTitle, taskDueDate);
            sendSMS(user.getPhoneNumber(), message);
        } catch (Exception e) {
            System.err.println("Failed to send task reminder SMS: " + e.getMessage());
        }
    }

    private void sendSMS(String phoneNumber, String message) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            System.out.println("Phone number not provided for SMS");
            return;
        }

        // TODO: Implement actual SMS sending based on provider
        // This is a placeholder implementation
        System.out.println("Sending SMS to " + phoneNumber + ": " + message);
        
        // Example implementations for different providers:
        switch (smsProvider.toLowerCase()) {
            case "twilio":
                sendViaTwilio(phoneNumber, message);
                break;
            case "aws":
                sendViaAWS(phoneNumber, message);
                break;
            default:
                System.out.println("Unknown SMS provider: " + smsProvider);
        }
    }

    private void sendViaTwilio(String phoneNumber, String message) {
        // TODO: Implement Twilio SMS sending
        System.out.println("Twilio SMS: " + phoneNumber + " - " + message);
    }

    private void sendViaAWS(String phoneNumber, String message) {
        // TODO: Implement AWS SNS SMS sending
        System.out.println("AWS SMS: " + phoneNumber + " - " + message);
    }

    private String buildSMSContent(Notification notification) {
        return appName + ": " + notification.getMessage();
    }

    private String buildEventReminderSMSContent(User user, String eventTitle, String eventTime) {
        return appName + " - Event Reminder: " + eventTitle + " at " + eventTime;
    }

    private String buildTaskReminderSMSContent(User user, String taskTitle, String taskDueDate) {
        return appName + " - Task Reminder: " + taskTitle + " due " + taskDueDate;
    }
}
