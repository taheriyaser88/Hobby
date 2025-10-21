package com.hobby.service.attachment;

import com.hobby.model.attachment.Attachment;
import com.hobby.model.event.Event;
import com.hobby.model.task.Task;
import com.hobby.model.user.User;
import com.hobby.repository.attachment.AttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    public Attachment save(Attachment attachment) {
        return attachmentRepository.save(attachment);
    }

    public Optional<Attachment> findById(Long id) {
        return attachmentRepository.findById(id);
    }

    public List<Attachment> findAll() {
        return attachmentRepository.findAll();
    }

    public List<Attachment> findByEvent(Event event) {
        return attachmentRepository.findByEvent(event);
    }

    public List<Attachment> findByTask(Task task) {
        return attachmentRepository.findByTask(task);
    }

    public List<Attachment> findByUploadedBy(User uploadedBy) {
        return attachmentRepository.findByUploadedBy(uploadedBy);
    }

    public List<Attachment> findByFileType(String fileType) {
        return attachmentRepository.findByFileType(fileType);
    }

    public List<Attachment> searchByFileName(String fileName) {
        return attachmentRepository.findByFileNameContaining(fileName);
    }

    public List<Attachment> findByEventAndFileType(Event event, String fileType) {
        return attachmentRepository.findByEventAndFileType(event, fileType);
    }

    public List<Attachment> findByTaskAndFileType(Task task, String fileType) {
        return attachmentRepository.findByTaskAndFileType(task, fileType);
    }

    public long countByEvent(Event event) {
        return attachmentRepository.countByEvent(event);
    }

    public long countByTask(Task task) {
        return attachmentRepository.countByTask(task);
    }

    public long countByUploadedBy(User uploadedBy) {
        return attachmentRepository.countByUploadedBy(uploadedBy);
    }

    public void deleteById(Long id) {
        attachmentRepository.deleteById(id);
    }

    public long count() {
        return attachmentRepository.count();
    }

    public Attachment createAttachment(String fileName, String fileUrl, String fileType, User uploadedBy) {
        Attachment attachment = new Attachment(fileName, fileUrl, uploadedBy);
        attachment.setFileType(fileType);
        return attachmentRepository.save(attachment);
    }

    public Attachment attachToEvent(Long attachmentId, Event event) {
        Optional<Attachment> attachment = attachmentRepository.findById(attachmentId);
        if (attachment.isPresent()) {
            attachment.get().setEvent(event);
            return attachmentRepository.save(attachment.get());
        }
        throw new RuntimeException("Attachment not found");
    }

    public Attachment attachToTask(Long attachmentId, Task task) {
        Optional<Attachment> attachment = attachmentRepository.findById(attachmentId);
        if (attachment.isPresent()) {
            attachment.get().setTask(task);
            return attachmentRepository.save(attachment.get());
        }
        throw new RuntimeException("Attachment not found");
    }
}
