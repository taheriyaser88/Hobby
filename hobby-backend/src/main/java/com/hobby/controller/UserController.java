package com.hobby.controller;

import com.hobby.enums.Role;
import com.hobby.dto.common.PagedResponse;
import com.hobby.model.user.User;
import com.hobby.model.user.Permission;
import com.hobby.service.user.UserService;
import com.hobby.service.user.RoleService;
import com.hobby.service.user.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping({"/api/users", "/users"})
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PermissionService permissionService;

    // Get current authenticated user
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> profile = new HashMap<>();
        
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            
            // Extract user info from OAuth2User
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            String picture = oauth2User.getAttribute("picture");
            String sub = oauth2User.getAttribute("sub"); // Google ID
            
            profile.put("id", sub != null ? sub : email);
            profile.put("email", email);
            profile.put("fullName", name);
            profile.put("avatarUrl", picture);
            
            // Try to find user in database
            if (email != null) {
                Optional<User> dbUser = userService.findByEmail(email);
                if (dbUser.isPresent()) {
                    User user = dbUser.get();
                    profile.put("id", user.getId());
                    profile.put("fullName", user.getFullName());
                    if (user.getAvatar() != null) {
                        profile.put("avatarUrl", user.getAvatar());
                    }
                    // Add role
                    if (user.getRole() != null) {
                        profile.put("role", user.getRole().name());
                    }
                }
            }
        } else {
            // Fallback for other authentication types
            profile.put("id", authentication.getName());
            profile.put("email", authentication.getName());
        }
        
        return ResponseEntity.ok(profile);
    }

    // Get all users
    @GetMapping
    public ResponseEntity<PagedResponse<User>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        var result = userService.searchPaged(search, page, size);
        var body = new PagedResponse<>(
                result.getContent(),
                result.getTotalElements(),
                page,
                size
        );
        return ResponseEntity.ok(body);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get user by email (query parameter)
    @GetMapping("/by-email")
    public ResponseEntity<?> getUserByEmailQuery(@RequestParam String email) {
        try {
            Optional<User> user = userService.findByEmail(email);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Get user by email (path variable)
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.findByEmail(email);
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


    // Get user role
    @GetMapping("/{id}/role")
    public ResponseEntity<Role> getUserRole(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent() && user.get().getRole() != null) {
            return ResponseEntity.ok(user.get().getRole());
        }
        return ResponseEntity.notFound().build();
    }

    // Update user role (only SUPER_ADMIN can change roles)
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role) {
        try {
            Optional<User> userOpt = userService.findById(id);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user = userService.assignRole(user, role);
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
