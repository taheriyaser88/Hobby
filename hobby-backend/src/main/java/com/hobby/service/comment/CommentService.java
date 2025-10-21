package com.hobby.service.comment;

import com.hobby.model.comment.Comment;
import com.hobby.model.event.Event;
import com.hobby.model.task.Task;
import com.hobby.model.user.User;
import com.hobby.repository.comment.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    public List<Comment> findByEvent(Event event) {
        return commentRepository.findByEvent(event);
    }

    public List<Comment> findByTask(Task task) {
        return commentRepository.findByTask(task);
    }

    public List<Comment> findByUser(User user) {
        return commentRepository.findByUser(user);
    }

    public List<Comment> findTopLevelComments() {
        return commentRepository.findByParentCommentIsNull();
    }

    public List<Comment> findTopLevelByEvent(Event event) {
        return commentRepository.findTopLevelByEvent(event);
    }

    public List<Comment> findTopLevelByTask(Task task) {
        return commentRepository.findTopLevelByTask(task);
    }

    public List<Comment> findByParentComment(Comment parentComment) {
        return commentRepository.findByParentComment(parentComment);
    }

    public List<Comment> findEditedByUser(User user) {
        return commentRepository.findEditedByUser(user);
    }

    public List<Comment> searchByContent(String content) {
        return commentRepository.findByContentContaining(content);
    }

    public long countByEvent(Event event) {
        return commentRepository.countByEvent(event);
    }

    public long countByTask(Task task) {
        return commentRepository.countByTask(task);
    }

    public long countByUser(User user) {
        return commentRepository.countByUser(user);
    }

    public long countRepliesByParentComment(Comment parentComment) {
        return commentRepository.countRepliesByParentComment(parentComment);
    }

    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }

    public long count() {
        return commentRepository.count();
    }

    public Comment createComment(User user, String content) {
        Comment comment = new Comment(content, user);
        return commentRepository.save(comment);
    }

    public Comment createEventComment(User user, Event event, String content) {
        Comment comment = new Comment(content, user);
        comment.setEvent(event);
        return commentRepository.save(comment);
    }

    public Comment createTaskComment(User user, Task task, String content) {
        Comment comment = new Comment(content, user);
        comment.setTask(task);
        return commentRepository.save(comment);
    }

    public Comment createReply(User user, Comment parentComment, String content) {
        Comment reply = new Comment(content, user);
        reply.setParentComment(parentComment);
        return commentRepository.save(reply);
    }

    public Comment updateComment(Long commentId, String content) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isPresent()) {
            comment.get().setContent(content);
            comment.get().setIsEdited(true);
            return commentRepository.save(comment.get());
        }
        throw new RuntimeException("Comment not found");
    }
}
