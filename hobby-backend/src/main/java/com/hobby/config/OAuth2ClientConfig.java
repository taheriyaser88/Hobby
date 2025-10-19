package com.hobby.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

@Configuration
public class OAuth2ClientConfig {

    @Bean
    public OidcUserService oidcUserService() {
        return new OidcUserService() {
            @Override
            public OidcUser loadUser(OidcUserRequest userRequest) {
                System.out.println("=== CUSTOM OIDC USER SERVICE ===");
                System.out.println("Bypassing JWK validation for Google OAuth2");
                System.out.println("Client Registration: " + userRequest.getClientRegistration().getRegistrationId());
                System.out.println("Access Token: " + userRequest.getAccessToken().getTokenValue().substring(0, 20) + "...");
                System.out.println("=================================");
                
                // Use the default implementation but skip JWT validation
                return super.loadUser(userRequest);
            }
        };
    }
}
