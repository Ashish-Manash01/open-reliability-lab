package com.orl.orderservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderServiceController {

    @GetMapping("/order/health")
    public String health() {
        return "Order Service is UP";
    }
}
