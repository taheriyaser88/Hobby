package com.hobby.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Google OAuth Sync Request DTO
 */
public class GoogleSyncRequest {
    
    @NotBlank
    @Size(max = 100)
    private String id;
    
    @Email
    @NotBlank
    @Size(max = 100)
    private String email;
    
    @NotBlank
    @Size(max = 200)
    private String name;
    
    @Size(max = 500)
    private String picture;
    
    // Constructors
    public GoogleSyncRequest() {}
    
    public GoogleSyncRequest(String id, String email, String name, String picture) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.picture = picture;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPicture() {
        return picture;
    }
    
    public void setPicture(String picture) {
        this.picture = picture;
    }
}






