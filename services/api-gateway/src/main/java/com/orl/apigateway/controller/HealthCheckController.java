package com.orl.apigateway.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for API Gateway health check and status endpoints.
 */
@RestController
@RequestMapping("/api")
public class HealthCheckController {

    /**
     * Health check endpoint that returns the status of the API Gateway.
     *
     * @return plain text message indicating the API Gateway is alive
     */
    @GetMapping(value = "/health-check", produces = MediaType.TEXT_PLAIN_VALUE)
    public String healthCheck() {
        return "API Gateway is alive";
    }
}
