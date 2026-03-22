package com.mediclear.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnalysisResult {
    private PatientContext patient_context;
    private ClinicalAssessment clinical_assessment;
    private AdministrativeRouting administrative_routing;
    private HospitalOrchestration hospital_orchestration;
    private FamilyCommunication family_communication;
    
    // Internal metadata
    private List<String> _document_urls;
    private String _perf;

    @Data
    public static class PatientContext {
        private String chief_complaint;
        private Integer estimated_age;
        private List<String> extracted_medications;
        private List<String> identified_allergies;
        private List<String> identified_risks;
        private Boolean communication_barrier;
        private String language;
    }

    @Data
    public static class ClinicalAssessment {
        private String clinical_reasoning;
        private String esi_triage_level;
        private DeteriorationRisk deterioration_risk;
        private List<String> missing_critical_data;
    }

    @Data
    public static class DeteriorationRisk {
        private String likelihood;
        private String predicted_trajectory;
        private Integer window_minutes;
    }

    @Data
    public static class AdministrativeRouting {
        private String insurance_carrier_detected;
        private Boolean pre_authorization_required;
        private List<IcdCode> anticipated_icd_10_codes;
        private List<CptCode> anticipated_cpt_codes;
        private Integer confidence_score_overall;
    }

    @Data
    public static class IcdCode {
        private String code;
        private String description;
        private Boolean verified;
    }

    @Data
    public static class CptCode {
        private String code;
        private String description;
        private Boolean verified;
        private String priority;
    }

    @Data
    public static class HospitalOrchestration {
        private List<String> resources_to_activate;
        private String bed_type_required;
        private String specialist_required;
        private String primary_action_directive;
    }

    @Data
    public static class FamilyCommunication {
        private String alert_message;
        private String next_of_kin_detected;
        private String consent_status;
        private String translated_alert_message;
        private String detected_language;
    }
}
