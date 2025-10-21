package com.hobby.repository.tag;

import com.hobby.model.tag.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {
    
    Optional<Label> findByName(String name);
    
    @Query("SELECT l FROM Label l WHERE l.name LIKE %:name%")
    List<Label> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT l FROM Label l WHERE l.color = :color")
    List<Label> findByColor(@Param("color") String color);
    
    @Query("SELECT l FROM Label l JOIN l.events e WHERE e.id = :eventId")
    List<Label> findByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT l FROM Label l JOIN l.tasks task WHERE task.id = :taskId")
    List<Label> findByTaskId(@Param("taskId") Long taskId);
    
    @Query("SELECT COUNT(e) FROM Event e JOIN e.labels l WHERE l = :label")
    Long countEventsByLabel(@Param("label") Label label);
    
    @Query("SELECT COUNT(task) FROM Task task JOIN task.labels l WHERE l = :label")
    Long countTasksByLabel(@Param("label") Label label);
    
    boolean existsByName(String name);
}
