package com.hobby.service.user;

import com.hobby.model.user.Role;
import com.hobby.repository.user.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public Role save(Role role) {
        return roleRepository.save(role);
    }

    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }

    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }

    public long count() {
        return roleRepository.count();
    }

    public Role createRole(String name, String description) {
        if (roleRepository.existsByName(name)) {
            throw new RuntimeException("Role with name " + name + " already exists");
        }
        Role role = new Role(name, description);
        return roleRepository.save(role);
    }
}
