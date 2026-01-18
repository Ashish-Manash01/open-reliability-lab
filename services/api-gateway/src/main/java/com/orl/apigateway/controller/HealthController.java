package com.orl.apigateway.controller;

import com.orl.apigateway.service.PrometheusService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final PrometheusService prometheusService;

    public HealthController(PrometheusService prometheusService) {
        this.prometheusService = prometheusService;
    }

    @GetMapping("/health/summary")
    public Map<String, Object> healthSummary() {

        return Map.of(
            "api-gateway", status("api-gateway"),
            "auth-service", status("auth-service"),
            "order-service", status("order-service"),
            "payment-service", status("payment-service"),
            "chaos-service", status("chaos-service")
        );
    }

    private Map<String, Object> status(String job) {
        boolean up = prometheusService.isServiceUp(job);

        return Map.of(
            "status", up ? "UP" : "DOWN"
        );
    }
}
