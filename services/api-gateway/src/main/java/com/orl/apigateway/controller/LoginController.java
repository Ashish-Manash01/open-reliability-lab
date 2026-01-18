package com.orl.apigateway.controller;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

/**
 * REST controller for login endpoint.
 * Forwards authentication requests to the auth-service with metrics tracking.
 */
@RestController
@RequestMapping("/api")
public class LoginController {

    private final RestTemplate authServiceRestTemplate;
    private final MeterRegistry meterRegistry;

    public LoginController(
            @Qualifier("authServiceRestTemplate") RestTemplate authServiceRestTemplate,
            MeterRegistry meterRegistry) {
        this.authServiceRestTemplate = authServiceRestTemplate;
        this.meterRegistry = meterRegistry;
    }

    /**
     * Login endpoint that forwards requests to auth-service.
     * Records metrics for latency and result (success/failure/timeout).
     *
     * @param body login request body
     * @return ResponseEntity from auth-service or 502/504 on error
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Object body) {
        String authServiceUrl = "http://localhost:8081/auth/login";
        String result = "failure";
        
        Timer.Sample sample = Timer.start(meterRegistry);
        
        try {
            ResponseEntity<?> response = authServiceRestTemplate.postForEntity(authServiceUrl, body, Object.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                result = "success";
                return response;
            } else if (response.getStatusCode().is5xxServerError()) {
                // Downstream error - return 502 Bad Gateway
                result = "failure";
                recordMetrics(sample, result);
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(response.getBody());
            }
            
            return response;
        } catch (ResourceAccessException e) {
            // Timeout or connection error - return 504 Gateway Timeout
            result = "timeout";
            recordMetrics(sample, result);
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                    .body("Request to auth-service timed out");
        } catch (HttpServerErrorException e) {
            // Downstream 5xx error - return 502 Bad Gateway
            result = "failure";
            recordMetrics(sample, result);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Auth service returned error: " + e.getMessage());
        } catch (Exception e) {
            // Other exceptions - return 500
            result = "failure";
            recordMetrics(sample, result);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error");
        } finally {
            // Metrics are recorded in catch blocks; only record if success not yet recorded
            if (result.equals("success")) {
                recordMetrics(sample, result);
            }
        }
    }

    /**
     * Record Micrometer metrics for auth-service call.
     *
     * @param sample timer sample
     * @param result success|failure|timeout
     */
    private void recordMetrics(Timer.Sample sample, String result) {
        // Record latency timer with multiple tags
        sample.stop(Timer.builder("auth_request_latency")
                .description("Latency of auth-service request in seconds")
                .tag("result", result)
                .tag("downstream", "auth-service")
                .register(meterRegistry));
        
        // Record request counter with multiple tags
        meterRegistry.counter("auth_requests_total",
                "result", result,
                "downstream", "auth-service").increment();
    }
}
