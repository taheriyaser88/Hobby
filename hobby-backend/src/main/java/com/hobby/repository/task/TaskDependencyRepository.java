package com.hobby.repository.task;

import com.hobby.model.task.Task;
import com.hobby.model.task.TaskDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskDependencyRepository extends JpaRepository<TaskDependency, Long> {
    
    List<TaskDependency> findByTask(Task task);
    
    List<TaskDependency> findByDependentTask(Task dependentTask);
    
    @Query("SELECT td FROM TaskDependency td WHERE td.task = :task AND td.dependencyType = :dependencyType")
    List<TaskDependency> findByTaskAndDependencyType(@Param("task") Task task, @Param("dependencyType") String dependencyType);
    
    @Query("SELECT td FROM TaskDependency td WHERE td.dependentTask = :dependentTask AND td.dependencyType = :dependencyType")
    List<TaskDependency> findByDependentTaskAndDependencyType(@Param("dependentTask") Task dependentTask, @Param("dependencyType") String dependencyType);
    
    @Query("SELECT td.dependentTask FROM TaskDependency td WHERE td.task = :task")
    List<Task> findDependentTasksByTask(@Param("task") Task task);
    
    @Query("SELECT td.task FROM TaskDependency td WHERE td.dependentTask = :dependentTask")
    List<Task> findTasksByDependentTask(@Param("dependentTask") Task dependentTask);
    
    @Query("SELECT COUNT(td) FROM TaskDependency td WHERE td.task = :task")
    Long countDependenciesByTask(@Param("task") Task task);
    
    @Query("SELECT COUNT(td) FROM TaskDependency td WHERE td.dependentTask = :dependentTask")
    Long countDependentsByTask(@Param("dependentTask") Task dependentTask);
    
    boolean existsByTaskAndDependentTask(Task task, Task dependentTask);
    
    Optional<TaskDependency> findByTaskAndDependentTask(Task task, Task dependentTask);
}
