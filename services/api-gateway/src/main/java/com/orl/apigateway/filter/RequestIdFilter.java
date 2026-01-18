package com.orl.apigateway.filter;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

/**
 * Servlet filter that generates and manages a unique request ID for each HTTP request.
 * The request ID is stored in the MDC (Mapped Diagnostic Context) under the key "requestId"
 * and is automatically cleared after the request is processed.
 */
@Component
public class RequestIdFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_KEY = "requestId";

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        // Generate a unique request ID
        String requestId = UUID.randomUUID().toString();
        
        try {
            // Store the request ID in MDC
            MDC.put(REQUEST_ID_KEY, requestId);
            
            // Add request ID to response headers for tracing
            response.setHeader("X-Request-ID", requestId);
            
            // Continue with the filter chain
            filterChain.doFilter(request, response);
        } finally {
            // Clear the MDC after request processing
            MDC.remove(REQUEST_ID_KEY);
        }
    }
}
