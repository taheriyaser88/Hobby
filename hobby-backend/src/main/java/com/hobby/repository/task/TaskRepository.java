package com.hobby.repository.task;

import com.hobby.model.task.Task;
import com.hobby.model.common.TaskStatus;
import com.hobby.model.common.TaskPriority;
import com.hobby.model.event.Event;
import com.hobby.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByEvent(Event event);
    
    List<Task> findByAssignee(User assignee);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByPriority(TaskPriority priority);
    
    @Query("SELECT t FROM Task t WHERE t.event = :event AND t.status = :status")
    List<Task> findByEventAndStatus(@Param("event") Event event, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.assignee = :assignee AND t.status = :status")
    List<Task> findByAssigneeAndStatus(@Param("assignee") User assignee, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.startDateTime >= :startDate AND t.endDateTime <= :endDate")
    List<Task> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Task t WHERE t.endDateTime <= :endDate AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasks(@Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Task t WHERE t.assignee = :assignee AND t.endDateTime <= :endDate AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasksByAssignee(@Param("assignee") User assignee, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Task t WHERE t.title LIKE %:title%")
    List<Task> findByTitleContaining(@Param("title") String title);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.event = :event")
    Long countByEvent(@Param("event") Event event);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignee = :assignee")
    Long countByAssignee(@Param("assignee") User assignee);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignee = :assignee AND t.status = :status")
    Long countByAssigneeAndStatus(@Param("assignee") User assignee, @Param("status") TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.assignee = :assignee AND t.status IN ('PENDING', 'IN_PROGRESS')")
    List<Task> findActiveTasksByAssignee(@Param("assignee") User assignee);
    
    List<Task> findByEndDateTimeBefore(LocalDateTime endDateTime);
    
    List<Task> findByTitleContainingIgnoreCase(String title);
    
    Long countByStatus(TaskStatus status);
    
    Long countByPriority(TaskPriority priority);
}
