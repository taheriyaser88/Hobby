package com.hobby.controller;

import com.hobby.model.event.EventCategory;
import com.hobby.service.event.EventCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    @Autowired
    private EventCategoryService eventCategoryService;

    // Get all categories
    @GetMapping
    public ResponseEntity<List<EventCategory>> getAllCategories() {
        List<EventCategory> categories = eventCategoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<EventCategory> getCategoryById(@PathVariable Long id) {
        Optional<EventCategory> category = eventCategoryService.findById(id);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get category by name
    @GetMapping("/name/{name}")
    public ResponseEntity<EventCategory> getCategoryByName(@PathVariable String name) {
        Optional<EventCategory> category = eventCategoryService.findByName(name);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create category
    @PostMapping
    public ResponseEntity<EventCategory> createCategory(@RequestBody EventCategory category) {
        try {
            EventCategory createdCategory = eventCategoryService.save(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update category
    @PutMapping("/{id}")
    public ResponseEntity<EventCategory> updateCategory(@PathVariable Long id, @RequestBody EventCategory category) {
        Optional<EventCategory> existingCategory = eventCategoryService.findById(id);
        if (existingCategory.isPresent()) {
            category.setId(id);
            EventCategory updatedCategory = eventCategoryService.save(category);
            return ResponseEntity.ok(updatedCategory);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Optional<EventCategory> category = eventCategoryService.findById(id);
        if (category.isPresent()) {
            eventCategoryService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Check if category name exists
    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> checkCategoryNameExists(@PathVariable String name) {
        boolean exists = eventCategoryService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    // Get category count
    @GetMapping("/count")
    public ResponseEntity<Long> getCategoryCount() {
        long count = eventCategoryService.count();
        return ResponseEntity.ok(count);
    }
}
