package com.mediclear.backend.controller;

import com.mediclear.backend.dto.AnalysisResult;
import com.mediclear.backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class EmergencyAnalyzerController {

    private final GeminiService geminiService;

    public EmergencyAnalyzerController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeEmergency(
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "age", required = false) String age,
            @RequestParam(value = "eta", required = false) String eta,
            @RequestParam(value = "reporter", required = false) String reporter,
            @RequestParam(value = "files", required = false) MultipartFile[] files) throws Exception {
        
        long startTime = System.currentTimeMillis();
        List<Map<String, Object>> parts = new ArrayList<>();

            StringBuilder contextBuilder = new StringBuilder();
            if (description != null && !description.isEmpty()) {
                contextBuilder.append("Emergency Description: ").append(description.replaceAll("<[^>]*>?", "")).append("\n");
            }
            if (age != null && !age.isEmpty()) {
                contextBuilder.append("Patient Estimated Age: ").append(age).append("\n");
            }
            if (eta != null && !eta.isEmpty()) {
                contextBuilder.append("Estimated Time of Arrival: ").append(eta).append("\n");
            }
            if (reporter != null && !reporter.isEmpty()) {
                contextBuilder.append("Reported By: ").append(reporter).append("\n");
            }

            if (contextBuilder.length() > 0) {
                parts.add(Map.of("text", contextBuilder.toString()));
            }

            if (files != null) {
                for (MultipartFile file : files) {
                    if (file.isEmpty()) continue;
                    
                    String mimeType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
                    
                    if (mimeType.startsWith("image/") || mimeType.equals("application/pdf")) {
                        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                        parts.add(Map.of("inlineData", Map.of(
                                "mimeType", mimeType,
                                "data", base64
                        )));
                    } else {
                        String textContent = new String(file.getBytes());
                        parts.add(Map.of("text", "Document Content (" + file.getOriginalFilename() + "): " + 
                                (textContent.length() > 2000 ? textContent.substring(0, 2000) : textContent)));
                    }
                }
            }

            if (parts.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Provide at least a description or a document."));
            }

            AnalysisResult result = geminiService.analyze(parts);
            
            double perfSeconds = (System.currentTimeMillis() - startTime) / 1000.0;
            result.set_perf(String.format("%.1f", perfSeconds));
            result.set_document_urls(Collections.emptyList());

            return ResponseEntity.ok(result);
    }
}
