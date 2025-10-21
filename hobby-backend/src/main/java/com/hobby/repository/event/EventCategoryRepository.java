package com.hobby.repository.event;

import com.hobby.model.event.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {
    
    Optional<EventCategory> findByName(String name);
    
    @Query("SELECT ec FROM EventCategory ec WHERE ec.name LIKE %:name%")
    List<EventCategory> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT ec FROM EventCategory ec WHERE ec.color = :color")
    List<EventCategory> findByColor(@Param("color") String color);
    
    @Query("SELECT COUNT(e) FROM Event e WHERE e.category = :category")
    Long countEventsByCategory(@Param("category") EventCategory category);
    
    boolean existsByName(String name);
}
