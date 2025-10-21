package com.hobby.service.event;

import com.hobby.model.event.EventCategory;
import com.hobby.repository.event.EventCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventCategoryService {

    @Autowired
    private EventCategoryRepository eventCategoryRepository;

    public EventCategory save(EventCategory eventCategory) {
        return eventCategoryRepository.save(eventCategory);
    }

    public Optional<EventCategory> findById(Long id) {
        return eventCategoryRepository.findById(id);
    }

    public Optional<EventCategory> findByName(String name) {
        return eventCategoryRepository.findByName(name);
    }

    public List<EventCategory> findAll() {
        return eventCategoryRepository.findAll();
    }

    public boolean existsByName(String name) {
        return eventCategoryRepository.existsByName(name);
    }


    public void deleteById(Long id) {
        eventCategoryRepository.deleteById(id);
    }

    public long count() {
        return eventCategoryRepository.count();
    }

    public EventCategory createCategory(String name, String description) {
        if (eventCategoryRepository.existsByName(name)) {
            throw new RuntimeException("Event category with name " + name + " already exists");
        }
        EventCategory category = new EventCategory(name, description, null);
        return eventCategoryRepository.save(category);
    }
}
