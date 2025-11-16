package com.hobby.config;

import com.hobby.model.user.User;
import com.hobby.service.auth.JwtService;
import com.hobby.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final String frontendBaseUrl;
    private final String callbackPath;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;

    public OAuth2SuccessHandler(
        @Value("${app.frontend.base-url:https://eventmevent.com}") String frontendBaseUrl,
        @Value("${app.frontend.callback-path:/auth/callback}") String callbackPath
    ) {
        this.frontendBaseUrl = frontendBaseUrl.endsWith("/")
            ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
            : frontendBaseUrl;
        this.callbackPath = callbackPath.startsWith("/") ? callbackPath : "/" + callbackPath;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String stateParam = request.getParameter("state");
        String decodedState = "/";
        if (stateParam != null && !stateParam.isBlank()) {
            try {
                decodedState = URLDecoder.decode(stateParam, StandardCharsets.UTF_8);
            } catch (IllegalArgumentException ignored) {
                decodedState = "/";
            }
        }

        // Redirect directly to dashboard with success parameter
        UriComponentsBuilder redirectBuilder = UriComponentsBuilder
            .fromHttpUrl(frontendBaseUrl + "/dashboard")
            .queryParam("login", "success");

        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            // Optional logging for debugging - can be replaced with structured logging
            System.out.println("=== GOOGLE OAUTH2 SUCCESS ===");
            oauth2User.getAttributes().forEach((key, value) -> System.out.printf("  %s: %s%n", key, value));
            System.out.println("=============================");
            
            // Save or update user in database
            try {
                String email = oauth2User.getAttribute("email");
                String name = oauth2User.getAttribute("name");
                String picture = oauth2User.getAttribute("picture");
                String sub = oauth2User.getAttribute("sub"); // Google ID
                
                if (email != null && sub != null) {
                    // Parse name into first and last name
                    String firstName;
                    String lastName;
                    if (name != null && !name.isBlank()) {
                        String[] nameParts = name.split(" ", 2);
                        firstName = nameParts[0].trim();
                        lastName = nameParts.length > 1 ? nameParts[1].trim() : "";
                    } else {
                        // Fallback: use email username as first name
                        firstName = email.split("@")[0].trim();
                        lastName = "";
                    }
                    
                    // Ensure firstName and lastName are not blank (required by User entity)
                    if (firstName.isBlank()) {
                        firstName = "User";
                    }
                    if (lastName.isBlank()) {
                        lastName = " ";
                    }
                    
                    // Use google-sync endpoint instead (handled separately)
                    // For now, just find or create user
                    User savedUser;
                    Optional<User> existingUser = userService.findUserByEmail(email);
                    if (existingUser.isPresent()) {
                        savedUser = existingUser.get();
                        // Update if needed
                        savedUser = userService.updateUserIfNeeded(savedUser, name, picture);
                    } else {
                        savedUser = userService.createGoogleUser(email, name, picture);
                    }
                    System.out.println("User saved/updated: " + email);
                    
                    // Generate JWT token
                    if (savedUser != null) {
                        String fullName = name != null ? name : (firstName + " " + lastName).trim();
                        String token = jwtService.generateToken(savedUser.getId(), email, fullName, savedUser.getRole());
                        System.out.println("JWT token generated for user: " + email);
                        
                        // Add JWT token to redirect URL as query parameter
                        redirectBuilder.queryParam("token", URLEncoder.encode(token, StandardCharsets.UTF_8));
                    }
                }
            } catch (Exception e) {
                System.err.println("Error saving user: " + e.getMessage());
                e.printStackTrace();
            }
        }

        String redirectUrl = redirectBuilder.build(true).toUriString();
        response.sendRedirect(redirectUrl);
    }
}
