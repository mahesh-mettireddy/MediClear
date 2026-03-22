package com.mediclear.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Root API info endpoint.
 * Returns service metadata, available routes, and runtime environment.
 * Industry-standard for production-grade REST APIs.
 */
@RestController
@RequestMapping("/")
public class ApiInfoController {

    private static final Instant START_TIME = Instant.now();

    @GetMapping
    public ResponseEntity<Map<String, Object>> info() {
        long uptimeSeconds = Instant.now().getEpochSecond() - START_TIME.getEpochSecond();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("service", "MediClear Emergency Analyzer API");
        response.put("version", "1.0.0");
        response.put("status", "UP");
        response.put("timestamp", DateTimeFormatter.ISO_INSTANT
                .withZone(ZoneOffset.UTC)
                .format(Instant.now()));
        response.put("uptime_seconds", uptimeSeconds);

        Map<String, Object> endpoints = new LinkedHashMap<>();
        endpoints.put("POST /api/v1/analyze", "Submit an emergency case for AI analysis (multipart/form-data)");
        endpoints.put("GET  /actuator/health", "Service health status");
        endpoints.put("GET  /actuator/info",   "Service build and environment info");
        endpoints.put("GET  /actuator/metrics","Runtime JVM and HTTP metrics");
        response.put("endpoints", endpoints);

        Map<String, String> links = new LinkedHashMap<>();
        links.put("health",  "/actuator/health");
        links.put("info",    "/actuator/info");
        links.put("metrics", "/actuator/metrics");
        response.put("links", links);

        return ResponseEntity.ok(response);
    }

    /** Explicit /health alias for load-balancer probes (mirrors actuator). */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
