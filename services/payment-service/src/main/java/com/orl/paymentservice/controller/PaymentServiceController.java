package com.orl.paymentservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentServiceController {

    @GetMapping("/payment/health")
    public String health() {
        return "Payment Service is UP";
    }
}
