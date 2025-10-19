package com.hobby.config;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, 
                                     AuthenticationException exception) throws IOException, ServletException {
        
        System.out.println("=== GOOGLE OAUTH2 FAILURE ===");
        System.out.println("Error: " + exception.getMessage());
        System.out.println("Exception: " + exception.getClass().getSimpleName());
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Query String: " + request.getQueryString());
        System.out.println("=============================");
        
        // Redirect to frontend with error
        response.sendRedirect("http://localhost:4200/login?error=true&message=" + 
                            java.net.URLEncoder.encode(exception.getMessage(), "UTF-8"));
    }
}
