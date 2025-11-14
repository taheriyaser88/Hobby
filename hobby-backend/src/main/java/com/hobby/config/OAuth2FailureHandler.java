package com.hobby.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    private final String frontendBaseUrl;
    private final String callbackPath;

    public OAuth2FailureHandler(
        @Value("${app.frontend.base-url:https://eventmevent.com}") String frontendBaseUrl,
        @Value("${app.frontend.callback-path:/auth/callback}") String callbackPath
    ) {
        this.frontendBaseUrl = frontendBaseUrl.endsWith("/")
            ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
            : frontendBaseUrl;
        this.callbackPath = callbackPath.startsWith("/") ? callbackPath : "/" + callbackPath;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        // Redirect to landing page with error parameter
        String redirectUrl = UriComponentsBuilder
            .fromHttpUrl(frontendBaseUrl)
            .queryParam("login", "error")
            .build(true)
            .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
