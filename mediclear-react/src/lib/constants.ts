export const UI_STRINGS = {
  EMPTY_HISTORY: "No cases yet. Analyze an emergency to get started.",
};

export const COLLECTIONS = {
  EMERGENCY_CASES: 'emergency_cases',
};

export const PROCESSING_MESSAGES = [
  "SYNTHESIZING CLINICAL DATA...",
  "PREDICTING DETERIORATION TRAJECTORY...",
  "EXTRACTING MEDICATION HISTORY...",
  "DETERMINING ESI TRIAGE LEVEL...",
  "CALCULATING ICD-10 & CPT CODES...",
  "ORCHESTRATING HOSPITAL RESOURCES...",
  "IDENTIFYING INSURANCE CARRIERS...",
  "GENERATING FAMILY ALERT...",
  "MAPPING ADMINISTRATIVE ROUTING..."
];

export const MODEL_PRIORITY = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];

export const SYSTEM_PROMPT = `
You are the core intelligence engine for MediClear, a real-time emergency pre-authorization and hospital orchestration system. Process all inputs and produce a battle-ready JSON payload.

INPUTS: Voice/text transcript + images of medical documents, pill bottles, handwritten notes.

INSTRUCTIONS: 1. SYNTHESIZE all inputs 2. PREDICT trajectory 3. ESI TRIAGE 1-5 4. ICD/CPT CODES 5. HOSPITAL RESOURCES 6. PRE-AUTHORIZE 7. FAMILY ALERT 8. FLAG GAPS.

CONSTRAINTS: Output ONLY valid JSON. No markdown. No backticks.

OUTPUT SCHEMA: {
  "patient_context": { "chief_complaint": "string", "estimated_age": "int", "extracted_medications": ["array"], "identified_allergies": ["array"], "identified_risks": ["array"], "communication_barrier": "boolean", "language": "string" },
  "clinical_assessment": { "clinical_reasoning": "string", "esi_triage_level": "Level 1-5", "deterioration_risk": { "likelihood": "HIGH/MED/LOW", "predicted_trajectory": "string", "window_minutes": "int" }, "missing_critical_data": ["array"] },
  "administrative_routing": { "insurance_carrier_detected": "string", "pre_authorization_required": "boolean", "anticipated_icd_10_codes": [{"code": "string", "description": "string", "verified": "boolean"}], "anticipated_cpt_codes": [{"code": "string", "description": "string", "verified": "boolean", "priority": "string"}], "confidence_score_overall": "int" },
  "hospital_orchestration": { "resources_to_activate": ["array"], "bed_type_required": "string", "specialist_required": "string", "primary_action_directive": "ALL-CAPS" },
  "family_communication": { "alert_message": "string", "next_of_kin_detected": "string", "consent_status": "string" }
}
`;

export const ESI_LEVELS = {
  'Level 1': { color: 'red', label: 'Resuscitation' },
  'Level 2': { color: 'orange', label: 'Emergent' },
  'Level 3': { color: 'yellow', label: 'Urgent' },
  'Level 4': { color: 'blue', label: 'Less Urgent' },
  'Level 5': { color: 'green', label: 'Non-Urgent' }
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_TEXT_LENGTH = 2000;
export const API_TIMEOUT = 30000;
