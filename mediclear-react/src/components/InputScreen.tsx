"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { Activity, Zap, Cloud } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import VoiceTextInput from "./input/VoiceTextInput";
import DocumentUpload from "./input/DocumentUpload";
import ContextFields from "./input/ContextFields";

interface InputScreenProps {
  onAnalyze: (payload: { description: string; files: File[]; age: string; eta: string; reporter: string }) => void;
}

/**
 * Main intake module for the MediClear emergency orchestration.
 * Manages state for speech, text, and visual document uploads.
 * @param {Function} onAnalyze - Analysis trigger callback
 */
export default function InputScreen({ onAnalyze }: InputScreenProps) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [age, setAge] = useState("");
  const [eta, setEta] = useState("");
  const [reporter, setReporter] = useState("Unknown");
  const [validationError, setValidationError] = useState("");

  const handleDemoLoad = () => {
    setDescription("65-year-old male presenting with acute substernal chest pain, diaphoresis, and left-arm numbness. Patient appears pale and confused. History of hypertension.");
    setAge("65");
    setEta("10");
    setReporter("EMS Unit 14");
    const dummyFile = new File(["Patient has a history of CAD and was prescribed Nitroglycerin 3 months ago. Last vitals: BP 160/95, HR 110, SpO2 94%."], "clinical_history.txt", { type: "text/plain" });
    setFiles([dummyFile]);
    setValidationError("");
  };

  const handleAnalyzeClick = () => {
    if (!description.trim() && files.length === 0) {
      setValidationError("Please describe the emergency or upload a document to proceed.");
      return;
    }
    setValidationError("");
    onAnalyze({ description, files, age, eta, reporter });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Emergency Intake</h1>
          <p className="text-slate-400">Provide real-time case data for immediate orchestration.</p>
          
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-electricGreen/80 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electricGreen opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electricGreen"></span>
              </span>
              Universal bridge between human intent and hospital systems
            </div>
          </div>
        </div>
        
        {/* Google Services Active Panel */}
        <div className="bg-slate-900 shadow-2xl border border-slate-800 rounded-xl p-4 min-w-[200px]">
          <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Cloud className="w-3 h-3" />
            Google Services Active
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-400">⚡ Vertex AI</span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-electricGreen uppercase">
                <span className="w-1 h-1 rounded-full bg-electricGreen" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-400">🔥 Firebase</span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-electricGreen uppercase">
                <span className="w-1 h-1 rounded-full bg-electricGreen" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-400">☁️ Cloud Run</span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-electricGreen uppercase">
                <span className="w-1 h-1 rounded-full bg-electricGreen" />
                Live
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-400">📊 Analytics</span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-electricGreen uppercase">
                <span className="w-1 h-1 rounded-full bg-electricGreen" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] text-slate-400">📝 Logging</span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-electricGreen uppercase">
                <span className="w-1 h-1 rounded-full bg-electricGreen" />
                Active
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDemoLoad}
            className="bg-slate-800 hover:bg-slate-700 text-electricGreen px-5 py-2.5 rounded-lg transition-colors text-sm font-semibold border border-electricGreen/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center gap-2 focus:ring-2 focus:ring-electricGreen focus:outline-none"
            aria-label="Load demo case with pre-filled medical emergency data"
          >
            <Activity className="w-4 h-4" />
            Load Demo Case
          </button>
          
          <button
            onClick={() => {
              handleDemoLoad();
              const demoFile = new File(["Patient has a history of CAD and was prescribed Nitroglycerin 3 months ago. Last vitals: BP 160/95, HR 110, SpO2 94%."], "clinical_history.txt", { type: "text/plain" });
              onAnalyze({
                description: "65-year-old male presenting with acute substernal chest pain, diaphoresis, and left-arm numbness. Patient appears pale and confused. History of hypertension.",
                files: [demoFile],
                age: "65",
                eta: "10",
                reporter: "EMS Unit 14",
              });
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-semibold border border-blue-400/20 flex items-center gap-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            aria-label="Run full end-to-end demo flow"
          >
            <Activity className="w-4 h-4" />
            Run Full Flow
          </button>
        </div>
      </div>

      {/* Alignment Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Accepts Inputs</h3>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">🎙️ Voice</span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">📷 Photos</span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">📄 Documents</span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">✍️ Handwritten Notes</span>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Outputs Generated</h3>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">🏥 Triage</span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">💊 Medical Codes</span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">🚨 Directives</span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400">👨‍👩‍👧 Family Alerts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ErrorBoundary>
          <VoiceTextInput 
            value={description} 
            onChange={setDescription} 
            placeholder="e.g. Patient sweating, left arm numb, age 65, confused..."
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <DocumentUpload files={files} onFilesChange={setFiles} />
        </ErrorBoundary>

        <ErrorBoundary>
          <ContextFields 
            age={age} setAge={setAge} 
            eta={eta} setEta={setEta} 
            reporter={reporter} setReporter={setReporter}
          />
        </ErrorBoundary>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {validationError && (
          <div className="w-full max-w-[500px] flex items-start gap-3 bg-red-950/50 border border-red-700/60 text-red-300 text-sm px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-red-400">⚠</span>
            <span>{validationError}</span>
          </div>
        )}
        <button
          onClick={handleAnalyzeClick}
          className="bg-electricGreen hover:bg-electricGreen-glow text-black font-black text-lg px-12 py-5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1 w-full md:w-auto md:min-w-[400px] animate-pulse-fast hover:animate-none uppercase tracking-widest focus:ring-4 focus:ring-electricGreen focus:outline-none"
          aria-label="Analyze emergency and orchestrate hospital response"
        >
          ORCHESTRATE RESPONSE
        </button>
      </div>
    </div>
  );
}

InputScreen.propTypes = {
  onAnalyze: PropTypes.func.isRequired,
};
