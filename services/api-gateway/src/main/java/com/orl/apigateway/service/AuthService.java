package com.orl.apigateway.service;

import com.orl.apigateway.dto.LoginRequest;
import com.orl.apigateway.dto.LoginResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service to handle authentication by forwarding requests to the auth-service.
 */
@Service
public class AuthService {

    private final RestTemplate restTemplate;
    
    @Value("${auth-service.url}")
    private String authServiceUrl;

    public AuthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Forward login request to auth-service and return the response.
     *
     * @param loginRequest the login request with username and password
     * @return LoginResponse with the token from auth-service
     */
    public LoginResponse login(LoginRequest loginRequest) {
        String authServiceLoginUrl = authServiceUrl + "/auth/login";
        return restTemplate.postForObject(authServiceLoginUrl, loginRequest, LoginResponse.class);
    }
}
