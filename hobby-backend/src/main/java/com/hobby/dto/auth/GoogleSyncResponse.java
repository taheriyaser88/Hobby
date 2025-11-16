package com.hobby.dto.auth;

import com.hobby.enums.Role;

import java.time.LocalDateTime;

/**
 * Google OAuth Sync Response DTO
 * Contains user data and JWT token
 */
public class GoogleSyncResponse {
    
    private UserData user;
    private String token;
    
    // Constructors
    public GoogleSyncResponse() {}
    
    public GoogleSyncResponse(UserData user, String token) {
        this.user = user;
        this.token = token;
    }
    
    // Getters and Setters
    public UserData getUser() {
        return user;
    }
    
    public void setUser(UserData user) {
        this.user = user;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    /**
     * User Data nested class
     */
    public static class UserData {
        private String id;
        private String fullName;
        private String email;
        private String avatar;
        private Role role;
        private LocalDateTime createdAt;
        
        // Constructors
        public UserData() {}
        
        public UserData(String id, String fullName, String email, String avatar, Role role, LocalDateTime createdAt) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.avatar = avatar;
            this.role = role;
            this.createdAt = createdAt;
        }
        
        // Getters and Setters
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getFullName() {
            return fullName;
        }
        
        public void setFullName(String fullName) {
            this.fullName = fullName;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getAvatar() {
            return avatar;
        }
        
        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }
        
        public Role getRole() {
            return role;
        }
        
        public void setRole(Role role) {
            this.role = role;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}


