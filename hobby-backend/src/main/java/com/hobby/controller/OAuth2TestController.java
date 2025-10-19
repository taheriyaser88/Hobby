package com.hobby.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2TestController {

    @GetMapping("/test")
    public String testOAuth2(HttpServletRequest request) {
        System.out.println("=== OAUTH2 TEST ENDPOINT ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Query String: " + request.getQueryString());
        
        System.out.println("Headers:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            System.out.println("  " + headerName + ": " + headerValue);
        }
        
        System.out.println("Parameters:");
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            System.out.println("  " + paramName + ": " + paramValue);
        }
        
        System.out.println("=============================");
        
        return "OAuth2 test endpoint called - check console for details";
    }

    @GetMapping("/callback")
    public String simulateGoogleCallback(HttpServletRequest request) {
        System.out.println("=== SIMULATED GOOGLE CALLBACK ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Query String: " + request.getQueryString());
        
        System.out.println("Simulated Google Response:");
        System.out.println("  code: 4/0AX4XfWh...");
        System.out.println("  state: chwvbJ6dV_vVnHnpZ8I-pMxOT9VCpL1O-ftMHPs7Sa8=");
        System.out.println("  scope: openid profile email");
        
        System.out.println("================================");
        
        return "Simulated Google callback - check console for details";
    }
}
