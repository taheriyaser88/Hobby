package com.hobby.repository.attachment;

import com.hobby.model.attachment.Attachment;
import com.hobby.model.event.Event;
import com.hobby.model.task.Task;
import com.hobby.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    
    List<Attachment> findByEvent(Event event);
    
    List<Attachment> findByTask(Task task);
    
    List<Attachment> findByUploadedBy(User uploadedBy);
    
    @Query("SELECT a FROM Attachment a WHERE a.fileType = :fileType")
    List<Attachment> findByFileType(@Param("fileType") String fileType);
    
    @Query("SELECT a FROM Attachment a WHERE a.fileName LIKE %:fileName%")
    List<Attachment> findByFileNameContaining(@Param("fileName") String fileName);
    
    @Query("SELECT a FROM Attachment a WHERE a.event = :event AND a.fileType = :fileType")
    List<Attachment> findByEventAndFileType(@Param("event") Event event, @Param("fileType") String fileType);
    
    @Query("SELECT a FROM Attachment a WHERE a.task = :task AND a.fileType = :fileType")
    List<Attachment> findByTaskAndFileType(@Param("task") Task task, @Param("fileType") String fileType);
    
    @Query("SELECT COUNT(a) FROM Attachment a WHERE a.event = :event")
    Long countByEvent(@Param("event") Event event);
    
    @Query("SELECT COUNT(a) FROM Attachment a WHERE a.task = :task")
    Long countByTask(@Param("task") Task task);
    
    @Query("SELECT COUNT(a) FROM Attachment a WHERE a.uploadedBy = :uploadedBy")
    Long countByUploadedBy(@Param("uploadedBy") User uploadedBy);
}
