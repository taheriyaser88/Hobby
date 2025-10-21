package com.hobby.service.task;

import com.hobby.model.task.Task;
import com.hobby.model.task.TaskDependency;
import com.hobby.repository.task.TaskDependencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskDependencyService {

    @Autowired
    private TaskDependencyRepository taskDependencyRepository;

    public TaskDependency save(TaskDependency dependency) {
        return taskDependencyRepository.save(dependency);
    }

    public Optional<TaskDependency> findById(Long id) {
        return taskDependencyRepository.findById(id);
    }

    public List<TaskDependency> findAll() {
        return taskDependencyRepository.findAll();
    }

    public List<TaskDependency> findByTask(Task task) {
        return taskDependencyRepository.findByTask(task);
    }

    public List<TaskDependency> findByDependentTask(Task dependentTask) {
        return taskDependencyRepository.findByDependentTask(dependentTask);
    }

    public List<TaskDependency> findByTaskAndDependencyType(Task task, String dependencyType) {
        return taskDependencyRepository.findByTaskAndDependencyType(task, dependencyType);
    }

    public List<TaskDependency> findByDependentTaskAndDependencyType(Task dependentTask, String dependencyType) {
        return taskDependencyRepository.findByDependentTaskAndDependencyType(dependentTask, dependencyType);
    }

    public List<Task> findDependentTasksByTask(Task task) {
        return taskDependencyRepository.findDependentTasksByTask(task);
    }

    public List<Task> findTasksByDependentTask(Task dependentTask) {
        return taskDependencyRepository.findTasksByDependentTask(dependentTask);
    }

    public long countDependenciesByTask(Task task) {
        return taskDependencyRepository.countDependenciesByTask(task);
    }

    public long countDependentsByTask(Task dependentTask) {
        return taskDependencyRepository.countDependentsByTask(dependentTask);
    }

    public boolean existsByTaskAndDependentTask(Task task, Task dependentTask) {
        return taskDependencyRepository.existsByTaskAndDependentTask(task, dependentTask);
    }

    public Optional<TaskDependency> findByTaskAndDependentTask(Task task, Task dependentTask) {
        return taskDependencyRepository.findByTaskAndDependentTask(task, dependentTask);
    }

    public void deleteById(Long id) {
        taskDependencyRepository.deleteById(id);
    }

    public long count() {
        return taskDependencyRepository.count();
    }

    public TaskDependency addDependency(Task task, Task dependentTask, String type) {
        if (taskDependencyRepository.existsByTaskAndDependentTask(task, dependentTask)) {
            throw new RuntimeException("Dependency already exists between these tasks");
        }
        TaskDependency dependency = new TaskDependency(task, dependentTask, type);
        return taskDependencyRepository.save(dependency);
    }

    public void removeDependency(Task task, Task dependentTask) {
        Optional<TaskDependency> dependency = taskDependencyRepository.findByTaskAndDependentTask(task, dependentTask);
        if (dependency.isPresent()) {
            taskDependencyRepository.delete(dependency.get());
        }
    }
}