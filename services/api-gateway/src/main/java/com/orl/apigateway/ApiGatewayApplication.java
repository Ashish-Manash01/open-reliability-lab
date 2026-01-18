package com.orl.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    /**
     * Dedicated RestTemplate bean for auth-service calls.
     * Configured with:
     * - Connection timeout: 1 second (1000ms)
     * - Read timeout: 2 seconds (2000ms)
     */
    @Bean("authServiceRestTemplate")
    public RestTemplate authServiceRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(1000);  // Connection timeout: 1 second
        factory.setReadTimeout(2000);     // Read timeout: 2 seconds
        return new RestTemplate(factory);
    }

    /**
     * Dedicated RestTemplate bean for orders-service calls.
     * Configured with:
     * - Connection timeout: 1 second (1000ms)
     * - Read timeout: 2 seconds (2000ms)
     */
    @Bean("ordersServiceRestTemplate")
    public RestTemplate ordersServiceRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(1000);  // Connection timeout: 1 second
        factory.setReadTimeout(2000);     // Read timeout: 2 seconds
        return new RestTemplate(factory);
    }

    /**
     * Default RestTemplate bean for general use.
     */
    @Bean
    @Primary
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
