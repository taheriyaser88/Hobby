package com.hobby.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                      Authentication authentication) throws IOException, ServletException {
        
        System.out.println("=== GOOGLE OAUTH2 SUCCESS ===");
        System.out.println("Authentication: " + authentication.getName());
        System.out.println("Principal: " + authentication.getPrincipal());
        
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            System.out.println("OAuth2User Attributes:");
            oauth2User.getAttributes().forEach((key, value) -> {
                System.out.println("  " + key + ": " + value);
            });
        }
        
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Query String: " + request.getQueryString());
        System.out.println("=============================");
        
        // Redirect to frontend success page
        response.sendRedirect("http://localhost:4200/success");
    }
}
