package com.orl.apigateway.controller;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * REST controller for orders operations.
 * Forwards order requests to the orders-service.
 */
@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private final RestTemplate ordersServiceRestTemplate;

    @Value("${orders-service.url}")
    private String ordersServiceUrl;

    public OrdersController(
            @Qualifier("ordersServiceRestTemplate") RestTemplate ordersServiceRestTemplate) {
        this.ordersServiceRestTemplate = ordersServiceRestTemplate;
    }

    /**
     * Create a new order.
     * Forwards the request to orders-service and returns the downstream response.
     *
     * @param orderData the order request body
     * @return ResponseEntity with downstream response status and body
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Object orderData) {
        String ordersServiceUrl = this.ordersServiceUrl + "/orders";
        
        return ordersServiceRestTemplate.postForEntity(
                ordersServiceUrl,
                orderData,
                Object.class);
    }
}

