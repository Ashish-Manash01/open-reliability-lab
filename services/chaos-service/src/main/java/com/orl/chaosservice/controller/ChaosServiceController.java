package com.orl.chaosservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChaosServiceController {

    @GetMapping("/chaos/health")
    public String health() {
        return "Chaos Service is UP";
    }
}
