package com.hobby.service.tag;

import com.hobby.model.tag.Label;
import com.hobby.repository.tag.LabelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LabelService {

    @Autowired
    private LabelRepository labelRepository;

    public Label save(Label label) {
        return labelRepository.save(label);
    }

    public Optional<Label> findById(Long id) {
        return labelRepository.findById(id);
    }

    public List<Label> findAll() {
        return labelRepository.findAll();
    }

    public Optional<Label> findByName(String name) {
        return labelRepository.findByName(name);
    }

    public boolean existsByName(String name) {
        return labelRepository.existsByName(name);
    }

    public void deleteById(Long id) {
        labelRepository.deleteById(id);
    }

    public long count() {
        return labelRepository.count();
    }

    public Label createLabel(String name, String color) {
        if (labelRepository.existsByName(name)) {
            throw new RuntimeException("Label with name " + name + " already exists");
        }
        Label label = new Label(name, color, null);
        return labelRepository.save(label);
    }
}