package com.hobby.service.tag;

import com.hobby.model.tag.Tag;
import com.hobby.repository.tag.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public Tag save(Tag tag) {
        return tagRepository.save(tag);
    }

    public Optional<Tag> findById(Long id) {
        return tagRepository.findById(id);
    }

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public Optional<Tag> findByName(String name) {
        return tagRepository.findByName(name);
    }

    public boolean existsByName(String name) {
        return tagRepository.existsByName(name);
    }

    public void deleteById(Long id) {
        tagRepository.deleteById(id);
    }

    public long count() {
        return tagRepository.count();
    }

    public Tag createTag(String name, String color) {
        if (tagRepository.existsByName(name)) {
            throw new RuntimeException("Tag with name " + name + " already exists");
        }
        Tag tag = new Tag(name, color, null);
        return tagRepository.save(tag);
    }
}