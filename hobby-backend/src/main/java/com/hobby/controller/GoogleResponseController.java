package com.hobby.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/google")
public class GoogleResponseController {

    @GetMapping("/response")
    public String showGoogleResponse() {
        System.out.println("=== GOOGLE OAUTH2 RESPONSE SIMULATION ===");
        System.out.println("1. User clicks 'Continue with Google'");
        System.out.println("2. Redirects to: https://accounts.google.com/o/oauth2/auth");
        System.out.println("3. User logs in to Google");
        System.out.println("4. Google redirects back with:");
        System.out.println("   - code: 4/0AX4XfWh...");
        System.out.println("   - state: chwvbJ6dV_vVnHnpZ8I-pMxOT9VCpL1O-ftMHPs7Sa8=");
        System.out.println("   - scope: openid profile email");
        System.out.println("5. Backend exchanges code for access token");
        System.out.println("6. Backend gets user info from Google");
        System.out.println("7. User is authenticated and redirected to success page");
        System.out.println("==========================================");
        
        return "Google OAuth2 response simulation - check console for details";
    }

    @GetMapping("/error")
    public String showGoogleError() {
        System.out.println("=== GOOGLE OAUTH2 ERROR SIMULATION ===");
        System.out.println("Common Google OAuth2 Errors:");
        System.out.println("1. invalid_client: Client ID is invalid");
        System.out.println("2. invalid_grant: Authorization code is invalid");
        System.out.println("3. access_denied: User denied permission");
        System.out.println("4. invalid_scope: Requested scope is invalid");
        System.out.println("5. server_error: Google server error");
        System.out.println("6. temporarily_unavailable: Service temporarily unavailable");
        System.out.println("=====================================");
        
        return "Google OAuth2 error simulation - check console for details";
    }
}
