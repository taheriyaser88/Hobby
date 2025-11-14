package com.hobby.config;

import org.springframework.context.annotation.Configuration;

/**
 * Google OAuth2 configuration is now handled by Spring Boot auto-configuration
 * from application.yml. This class is kept for potential future customizations.
 */
@Configuration
public class GoogleOAuth2Config {
    // Spring Boot will auto-configure OAuth2 from application.yml
    // No manual ClientRegistrationRepository needed
}
