/**
 * Shared TypeScript interfaces for MediClear analysis results.
 */

export interface PatientContext {
  chief_complaint: string;
  estimated_age: number;
  extracted_medications: string[];
  identified_allergies: string[];
  identified_risks: string[];
  communication_barrier: boolean;
  language: string;
}

export interface DeteriorationRisk {
  likelihood: "HIGH" | "MED" | "LOW";
  predicted_trajectory: string;
  window_minutes: number;
}

export interface ClinicalAssessment {
  clinical_reasoning: string;
  esi_triage_level: string;
  deterioration_risk: DeteriorationRisk;
  missing_critical_data: string[];
}

export interface CodeInfo {
  code: string;
  description: string;
  verified: boolean;
  priority?: string;
}

export interface AdministrativeRouting {
  insurance_carrier_detected: string;
  pre_authorization_required: boolean;
  anticipated_icd_10_codes: CodeInfo[];
  anticipated_cpt_codes: CodeInfo[];
  confidence_score_overall: number;
}

export interface HospitalOrchestration {
  resources_to_activate: string[];
  bed_type_required: string;
  specialist_required: string;
  primary_action_directive: string;
}

export interface FamilyCommunication {
  alert_message: string;
  next_of_kin_detected: string;
  consent_status: string;
  translated_alert_message?: string;
  detected_language?: string;
}

export interface AnalysisResult {
  patient_context: PatientContext;
  clinical_assessment: ClinicalAssessment;
  administrative_routing: AdministrativeRouting;
  hospital_orchestration: HospitalOrchestration;
  family_communication: FamilyCommunication;
  _document_urls?: string[];
  _perf?: string;
  _cached?: boolean;
}
