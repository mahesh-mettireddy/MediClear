"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Save, Activity, Map as MapIcon, Zap } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import TriageBanner from "./results/TriageBanner";
import PatientContextCard from "./results/PatientContextCard";
import ClinicalAssessmentCard from "./results/ClinicalAssessmentCard";
import OrchestrationCard from "./results/OrchestrationCard";
import AdministrativeBillingCard from "./results/AdministrativeBillingCard";
import FamilyCommunicationCard from "./results/FamilyCommunicationCard";

import { AnalysisResult } from "@/lib/types";

interface ResultsProps {
  data: AnalysisResult;
  onReset: () => void;
  onSave: (data: AnalysisResult) => Promise<void>;
}

/**
 * Main dashboard for visualizing emergency triage results.
 * @param {Object} data - Analysis payload
 * @param {Function} onReset - Callback to start a new analysis
 * @param {Function} onSave - Callback to save record to history
 */
export default function ResultsDashboard({ data, onReset, onSave }: ResultsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {} // Geolocation blocked
      );
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) return null;

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapCenter = location ? `${location.lat},${location.lng}` : "Emergency+Hospitals";
  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=${mapsApiKey}&q=emergency+hospitals&center=${mapCenter}&zoom=13`;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 pb-12">
      <div className="relative group">
        <ErrorBoundary>
          <TriageBanner 
            directive={data.hospital_orchestration?.primary_action_directive} 
            esiLevel={data.clinical_assessment?.esi_triage_level} 
          />
        </ErrorBoundary>
        
        {/* Performance Metric */}
        <div className="mt-2 flex items-center justify-end gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Zap className="w-3 h-3 text-electricGreen" />
            <span>⚡ Analyzed in {data._perf}s using Vertex AI asia-south1</span>
        </div>

        {data._cached && (
          <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest backdrop-blur-sm shadow-lg shadow-blue-500/10">
              Cached Result
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ErrorBoundary>
          <PatientContextCard context={data.patient_context} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ClinicalAssessmentCard assessment={data.clinical_assessment} />
        </ErrorBoundary>
        <ErrorBoundary>
          <OrchestrationCard orchestration={data.hospital_orchestration} />
        </ErrorBoundary>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBoundary>
          <AdministrativeBillingCard admin={data.administrative_routing} />
        </ErrorBoundary>
        <ErrorBoundary>
          <FamilyCommunicationCard 
            comms={data.family_communication} 
            missingData={data.clinical_assessment?.missing_critical_data}
          />
        </ErrorBoundary>
      </div>

      {/* NEAREST HOSPITALS — GOOGLE MAPS EMBED */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg animate-in fade-in duration-1000 delay-300">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <MapIcon className="w-4 h-4 text-electricGreen" /> Nearest Emergency Hospitals
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Live Routing via Google Maps API</span>
        </div>
        <div className="w-full h-[300px] bg-slate-950 grayscale-[0.5] contrast-[1.2]">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl}
            ></iframe>
        </div>
      </div>

      <details className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden group">
        <summary className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors flex items-center justify-between font-bold text-xs text-slate-400 uppercase tracking-widest">
          <span>Technical Deployment Details</span>
          <PlusCircle className="w-4 h-4 group-open:rotate-45 transition-transform" />
        </summary>
        <div className="p-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Model</span>
            <span className="text-xs text-white">gemini-2.0-flash-001 (Vertex AI)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Region</span>
            <span className="text-xs text-white">asia-south1</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Database</span>
            <span className="text-xs text-white">Firebase Firestore</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Hosting</span>
            <span className="text-xs text-white">Google Cloud Run</span>
          </div>
        </div>
      </details>

      <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-800/50">
        <button 
          onClick={onReset}
          className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-slate-500 focus:outline-none"
          aria-label="Start a new emergency analysis"
        >
          <PlusCircle className="w-5 h-5" /> NEW EMERGENCY
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-electricGreen/10 hover:bg-electricGreen/20 border border-electricGreen/30 text-electricGreen py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-electricGreen focus:outline-none"
          aria-label="Save current analysis to case history"
        >
          {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "SAVING TO HISTORICAL LOG..." : "SAVE TO CASE HISTORY"}
        </button>
      </div>
    </div>
  );
}
