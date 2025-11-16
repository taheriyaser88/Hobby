package com.hobby.controller;

import com.hobby.dto.auth.GoogleSyncRequest;
import com.hobby.dto.auth.GoogleSyncResponse;
import com.hobby.model.user.User;
import com.hobby.service.auth.JwtService;
import com.hobby.service.user.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;

    @GetMapping("/test")
    public String test() {
        return "Auth controller is working!";
    }

    /**
     * POST /api/auth/google-sync
     * Sync Google OAuth user with backend
     * - If user exists: return existing user with saved role
     * - If user doesn't exist: create new user with USER role
     * - Returns user + JWT token (token includes role)
     */
    @PostMapping("/google-sync")
    public ResponseEntity<GoogleSyncResponse> googleSync(@Valid @RequestBody GoogleSyncRequest request) {
        // Try to find existing user by email
        Optional<User> existingUserOpt = userService.findUserByEmail(request.getEmail());
        
        User user;
        if (existingUserOpt.isPresent()) {
            // User exists - update if needed (avatar, fullName)
            user = existingUserOpt.get();
            user = userService.updateUserIfNeeded(
                user,
                request.getName(),
                request.getPicture()
            );
        } else {
            // User doesn't exist - create new user with USER role
            user = userService.createGoogleUser(
                request.getEmail(),
                request.getName(),
                request.getPicture()
            );
        }
        
        // Generate JWT token with role
        String token = jwtService.generateToken(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole()
        );
        
        // Create response DTO
        GoogleSyncResponse.UserData userData = new GoogleSyncResponse.UserData(
            user.getId().toString(),
            user.getFullName(),
            user.getEmail(),
            user.getAvatar(),
            user.getRole(),
            user.getCreatedAt()
        );
        
        GoogleSyncResponse response = new GoogleSyncResponse(userData, token);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> profile = new HashMap<>();
        String email = authentication.getName(); // From JWT or OAuth2
        
        // Try to find user in database
        if (email != null) {
            Optional<User> dbUser = userService.findByEmail(email);
            if (dbUser.isPresent()) {
                User user = dbUser.get();
                profile.put("id", user.getId());
                profile.put("email", user.getEmail());
                profile.put("fullName", user.getFullName());
                if (user.getAvatar() != null) {
                    profile.put("avatarUrl", user.getAvatar());
                }
            } else {
                // Fallback: use authentication name
                profile.put("id", email);
                profile.put("email", email);
            }
        } else {
            profile.put("id", authentication.getName());
            profile.put("email", authentication.getName());
        }
        
        return ResponseEntity.ok(profile);
    }
}
