package com.orl.authservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @GetMapping("/auth/health")
    public String health() {
        return "Auth Service is UP";
    }
}
