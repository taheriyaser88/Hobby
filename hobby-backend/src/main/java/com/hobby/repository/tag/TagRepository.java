package com.hobby.repository.tag;

import com.hobby.model.tag.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByName(String name);
    
    @Query("SELECT t FROM Tag t WHERE t.name LIKE %:name%")
    List<Tag> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT t FROM Tag t WHERE t.color = :color")
    List<Tag> findByColor(@Param("color") String color);
    
    @Query("SELECT t FROM Tag t JOIN t.events e WHERE e.id = :eventId")
    List<Tag> findByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT t FROM Tag t JOIN t.tasks task WHERE task.id = :taskId")
    List<Tag> findByTaskId(@Param("taskId") Long taskId);
    
    @Query("SELECT COUNT(e) FROM Event e JOIN e.tags t WHERE t = :tag")
    Long countEventsByTag(@Param("tag") Tag tag);
    
    @Query("SELECT COUNT(task) FROM Task task JOIN task.tags t WHERE t = :tag")
    Long countTasksByTag(@Param("tag") Tag tag);
    
    boolean existsByName(String name);
}
