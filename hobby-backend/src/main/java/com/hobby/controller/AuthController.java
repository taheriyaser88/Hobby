package com.hobby.controller;

import com.hobby.model.user.User;
import com.hobby.service.auth.JwtService;
import com.hobby.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
                profile.put("fullName", user.getFirstName() + " " + user.getLastName());
                if (user.getProfilePicture() != null) {
                    profile.put("avatarUrl", user.getProfilePicture());
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