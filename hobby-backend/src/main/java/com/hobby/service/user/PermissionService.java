package com.hobby.service.user;

import com.hobby.model.user.Permission;
import com.hobby.repository.user.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public Optional<Permission> findById(Long id) {
        return permissionRepository.findById(id);
    }

    public Optional<Permission> findByName(String name) {
        return permissionRepository.findByName(name);
    }

    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }

    public boolean existsByName(String name) {
        return permissionRepository.existsByName(name);
    }


    public void deleteById(Long id) {
        permissionRepository.deleteById(id);
    }

    public long count() {
        return permissionRepository.count();
    }

    public Permission createPermission(String name, String description) {
        if (permissionRepository.existsByName(name)) {
            throw new RuntimeException("Permission with name " + name + " already exists");
        }
        Permission permission = new Permission(name, description, null, null);
        return permissionRepository.save(permission);
    }
}
