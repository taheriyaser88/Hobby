package com.hobby.service.notification;

import com.hobby.model.event.Event;
import com.hobby.model.notification.Reminder;
import com.hobby.model.task.Task;
import com.hobby.model.user.User;
import com.hobby.repository.notification.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public Reminder save(Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    public Optional<Reminder> findById(Long id) {
        return reminderRepository.findById(id);
    }

    public List<Reminder> findAll() {
        return reminderRepository.findAll();
    }

    public List<Reminder> findByUser(User user) {
        return reminderRepository.findByUser(user);
    }

    public List<Reminder> findByEvent(Event event) {
        return reminderRepository.findByEvent(event);
    }

    public List<Reminder> findByTask(Task task) {
        return reminderRepository.findByTask(task);
    }

    public List<Reminder> findByReminderTimeBeforeAndIsSentFalse(LocalDateTime dateTime) {
        return reminderRepository.findByReminderDateTimeBeforeAndIsSentFalse(dateTime);
    }

    public long countByUserAndIsSentFalse(User user) {
        return reminderRepository.countByUserAndIsSentFalse(user);
    }

    public void deleteById(Long id) {
        reminderRepository.deleteById(id);
    }

    public long count() {
        return reminderRepository.count();
    }
}