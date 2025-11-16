package com.hobby.service.user;

import com.hobby.enums.Role;
import com.hobby.model.user.User;
import com.hobby.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public long count() {
        return userRepository.count();
    }

    /**
     * Search users with pagination. If search is blank, returns all paged.
     */
    public Page<User> searchPaged(String search, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.max(1, size));
        if (search == null || search.isBlank()) {
            return userRepository.findAll(pageable);
        }
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
    }

    /**
     * Find user by email
     * @param email - User email
     * @return Optional<User>
     */
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Create new user from Google OAuth profile
     * Default role: USER
     * @param email - User email
     * @param fullName - User full name
     * @param avatar - User avatar URL
     * @return Created User
     */
    public User createGoogleUser(String email, String fullName, String avatar) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFullName(fullName);
        newUser.setAvatar(avatar);
        newUser.setRole(Role.USER); // Default role
        newUser.setCreatedAt(LocalDateTime.now());
        return userRepository.save(newUser);
    }

    /**
     * Update user if needed (e.g., update avatar or fullName)
     * @param user - Existing user
     * @param fullName - New full name (optional)
     * @param avatar - New avatar URL (optional)
     * @return Updated User
     */
    public User updateUserIfNeeded(User user, String fullName, String avatar) {
        boolean updated = false;
        
        if (fullName != null && !fullName.equals(user.getFullName())) {
            user.setFullName(fullName);
            updated = true;
        }
        
        if (avatar != null && !avatar.equals(user.getAvatar())) {
            user.setAvatar(avatar);
            updated = true;
        }
        
        if (updated) {
            return userRepository.save(user);
        }
        
        return user;
    }

    /**
     * Assign role to user (only SUPER_ADMIN can change roles)
     * @param user - User to assign role
     * @param role - New role
     * @return Updated User
     */
    public User assignRole(User user, Role role) {
        user.setRole(role);
        return userRepository.save(user);
    }
}
