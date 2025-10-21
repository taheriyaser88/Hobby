package com.hobby.controller;

import com.hobby.model.user.User;
import com.hobby.model.user.Role;
import com.hobby.model.user.Permission;
import com.hobby.service.user.UserService;
import com.hobby.service.user.RoleService;
import com.hobby.service.user.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PermissionService permissionService;

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.findByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get user by Google ID
    @GetMapping("/google/{googleId}")
    public ResponseEntity<User> getUserByGoogleId(@PathVariable String googleId) {
        Optional<User> user = userService.findByGoogleId(googleId);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create or update user
    @PostMapping
    public ResponseEntity<User> createOrUpdateUser(@RequestBody User user) {
        try {
            User savedUser = userService.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        Optional<User> existingUser = userService.findById(id);
        if (existingUser.isPresent()) {
            user.setId(id);
            User updatedUser = userService.save(user);
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            userService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Check if email exists
    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    // Check if Google ID exists
    @GetMapping("/exists/google/{googleId}")
    public ResponseEntity<Boolean> checkGoogleIdExists(@PathVariable String googleId) {
        boolean exists = userService.existsByGoogleId(googleId);
        return ResponseEntity.ok(exists);
    }

    // Get user roles
    @GetMapping("/{id}/roles")
    public ResponseEntity<List<Role>> getUserRoles(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            List<Role> roles = user.get().getRoles().stream().toList();
            return ResponseEntity.ok(roles);
        }
        return ResponseEntity.notFound().build();
    }

    // Add role to user
    @PostMapping("/{id}/roles")
    public ResponseEntity<User> addRoleToUser(
            @PathVariable Long id,
            @RequestParam Long roleId) {
        try {
            Optional<User> user = userService.findById(id);
            Optional<Role> role = roleService.findById(roleId);
            
            if (user.isPresent() && role.isPresent()) {
                user.get().addRole(role.get());
                User updatedUser = userService.save(user.get());
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Remove role from user
    @DeleteMapping("/{id}/roles/{roleId}")
    public ResponseEntity<User> removeRoleFromUser(
            @PathVariable Long id,
            @PathVariable Long roleId) {
        try {
            Optional<User> user = userService.findById(id);
            Optional<Role> role = roleService.findById(roleId);
            
            if (user.isPresent() && role.isPresent()) {
                user.get().removeRole(role.get());
                User updatedUser = userService.save(user.get());
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all roles
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.findAll();
        return ResponseEntity.ok(roles);
    }

    // Get role by ID
    @GetMapping("/roles/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        Optional<Role> role = roleService.findById(id);
        return role.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create role
    @PostMapping("/roles")
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        try {
            Role createdRole = roleService.save(role);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update role
    @PutMapping("/roles/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role role) {
        Optional<Role> existingRole = roleService.findById(id);
        if (existingRole.isPresent()) {
            role.setId(id);
            Role updatedRole = roleService.save(role);
            return ResponseEntity.ok(updatedRole);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete role
    @DeleteMapping("/roles/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        Optional<Role> role = roleService.findById(id);
        if (role.isPresent()) {
            roleService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Get all permissions
    @GetMapping("/permissions")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        List<Permission> permissions = permissionService.findAll();
        return ResponseEntity.ok(permissions);
    }

    // Get permission by ID
    @GetMapping("/permissions/{id}")
    public ResponseEntity<Permission> getPermissionById(@PathVariable Long id) {
        Optional<Permission> permission = permissionService.findById(id);
        return permission.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create permission
    @PostMapping("/permissions")
    public ResponseEntity<Permission> createPermission(@RequestBody Permission permission) {
        try {
            Permission createdPermission = permissionService.save(permission);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPermission);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update permission
    @PutMapping("/permissions/{id}")
    public ResponseEntity<Permission> updatePermission(@PathVariable Long id, @RequestBody Permission permission) {
        Optional<Permission> existingPermission = permissionService.findById(id);
        if (existingPermission.isPresent()) {
            permission.setId(id);
            Permission updatedPermission = permissionService.save(permission);
            return ResponseEntity.ok(updatedPermission);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete permission
    @DeleteMapping("/permissions/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        Optional<Permission> permission = permissionService.findById(id);
        if (permission.isPresent()) {
            permissionService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
