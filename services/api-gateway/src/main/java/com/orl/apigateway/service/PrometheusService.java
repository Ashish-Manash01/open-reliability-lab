package com.orl.apigateway.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class PrometheusService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PROMETHEUS_URL =
            "http://prometheus:9090/api/v1/query";

    public boolean isServiceUp(String jobName) {
        String query = "up{job=\"" + jobName + "\"}";
        String url = PROMETHEUS_URL + "?query=" + query;

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null) return false;

        var data = (Map) response.get("data");
        var result = (java.util.List<?>) data.get("result");

        if (result.isEmpty()) return false;

        var value = (java.util.List<?>) ((Map) result.get(0)).get("value");

        return "1".equals(value.get(1).toString());
    }
}
