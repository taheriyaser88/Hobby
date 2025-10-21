package com.hobby.repository.comment;

import com.hobby.model.comment.Comment;
import com.hobby.model.event.Event;
import com.hobby.model.task.Task;
import com.hobby.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByEvent(Event event);
    
    List<Comment> findByTask(Task task);
    
    List<Comment> findByUser(User user);
    
    List<Comment> findByParentCommentIsNull();
    
    @Query("SELECT c FROM Comment c WHERE c.event = :event AND c.parentComment IS NULL")
    List<Comment> findTopLevelByEvent(@Param("event") Event event);
    
    @Query("SELECT c FROM Comment c WHERE c.task = :task AND c.parentComment IS NULL")
    List<Comment> findTopLevelByTask(@Param("task") Task task);
    
    @Query("SELECT c FROM Comment c WHERE c.parentComment = :parentComment")
    List<Comment> findByParentComment(@Param("parentComment") Comment parentComment);
    
    @Query("SELECT c FROM Comment c WHERE c.user = :user AND c.isEdited = true")
    List<Comment> findEditedByUser(@Param("user") User user);
    
    @Query("SELECT c FROM Comment c WHERE c.content LIKE %:content%")
    List<Comment> findByContentContaining(@Param("content") String content);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.event = :event")
    Long countByEvent(@Param("event") Event event);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.task = :task")
    Long countByTask(@Param("task") Task task);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.user = :user")
    Long countByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.parentComment = :parentComment")
    Long countRepliesByParentComment(@Param("parentComment") Comment parentComment);
}
