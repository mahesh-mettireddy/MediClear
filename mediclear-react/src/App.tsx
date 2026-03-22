"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import InputScreen from "@/components/InputScreen";
import ProcessingScreen from "@/components/ProcessingScreen";
import { saveCaseToHistory, getTodayEmergencyCount, trackEvent } from "@/lib/firebase-client";
import { compressImage } from "@/lib/mediclear-utils";
import ResultsDashboard from "@/components/ResultsDashboard";

/**
 * Main application Entry Point.
 * Manages high-level state machine between input, processing, and visualization.
 */
export default function Home() {
  const [appState, setAppState] = useState<"input" | "processing" | "results" | "error">("input");
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [processingMessage, setProcessingMessage] = useState("Initializing analysis...");
  const [emergenciesToday, setEmergenciesToday] = useState(0);

  // Load today's emergency count on mount
  useEffect(() => {
    async function loadStats() {
      const count = await getTodayEmergencyCount();
      setEmergenciesToday(count);
    }
    loadStats();
    // Refresh count roughly every minute for live effect
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Triggers the AI analysis workflow.
   * Compresses images before sending multi-modal payload to Vertex API.
   * @param {Object} payload - User-provided input data
   */
  const handleAnalyze = async (payload: { description: string; files: File[]; age: string; eta: string; reporter: string }, retryCount = 0) => {
    setAppState("processing");
    setProcessingMessage("Sending data to Vertex AI...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout as requested
    const slowMsg = setTimeout(() => setProcessingMessage("Taking longer than expected... hang tight."), 15000);

    try {
      const formData = new FormData();
      formData.append("description", payload.description);
      formData.append("age", payload.age);
      formData.append("eta", payload.eta);
      formData.append("reporter", payload.reporter);
      
      setProcessingMessage("Compressing medical documents...");
      const compressedFiles = await Promise.all(payload.files.map(compressImage));
      compressedFiles.forEach(file => formData.append("files", (file as any)));

      setProcessingMessage("Uploading to Vertex AI and running analysis...");
      const response = await fetch("https://mediclear-java-backend-383564348838.asia-south1.run.app/api/v1/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearTimeout(slowMsg);

      if (!response.ok) {
        const errData = await response.json();
        setAnalysisResult(errData);
        throw new Error(errData.error || "Failed to analyze emergency.");
      }

      const result = await response.json();
      
      // Tracking event
      trackEvent('emergency_analyzed', {
        esi_level: result.clinical_assessment?.esi_triage_level,
        confidence_score: result.administrative_routing?.confidence_score_overall
      });

      setAnalysisResult(result);
      setAppState("results");
    } catch (err: any) {
      clearTimeout(timeoutId);
      clearTimeout(slowMsg);
      
      if (err.name === 'AbortError' && retryCount === 0) {
          setProcessingMessage("Analysis timed out. Retrying...");
          return handleAnalyze(payload, 1); // Auto retry once
      }

      let message = err instanceof Error ? err.message : "An unexpected error occurred.";
      if (err.name === 'AbortError') {
          message = "Analysis timed out. Please check your connection and try again.";
      }
      setErrorMessage(message);
      setAppState("error");
    }
  };

  /**
   * Persists an analysis result for historical tracking.
   * @param {Object} data - Final result payload
   */
  const handleSaveToHistory = async (data: any) => {
    try {
      await saveCaseToHistory(data);
      // Update local count immediately
      setEmergenciesToday(prev => prev + 1);
      alert("Case saved successfully! You can view it in the History tab.");
    } catch (e: any) {
      alert(e.message || "Failed to sync case to Cloud. Local copy preserved.");
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-8rem)]">
      {/* Live Counter for Home Screen */}
      <AnimatePresence>
        {appState === "input" && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm self-center px-4 py-2 rounded-full mb-8"
            >
                <div className="w-2 h-2 rounded-full bg-electricGreen animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="text-white">{emergenciesToday}</span> Emergencies Processed Today
                </span>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {appState === "input" && (
          <motion.div 
            key="input" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <InputScreen onAnalyze={handleAnalyze} />
          </motion.div>
        )}
        
        {appState === "processing" && (
          <motion.div 
            key="processing" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <ProcessingScreen message={processingMessage} />
          </motion.div>
        )}

        {appState === "results" && analysisResult && (
          <motion.div 
            key="results" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <ResultsDashboard 
              data={analysisResult} 
              onSave={handleSaveToHistory}
              onReset={() => {
                setAnalysisResult(null);
                setAppState("input");
              }} 
            />
          </motion.div>
        )}

        {appState === "error" && (
          <motion.div 
            key="error" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-left bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚠</span>
              </div>
              <h2 className="text-white font-bold text-2xl tracking-tight">Analysis Blocked</h2>
            </div>
            
            <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4 mb-6">
              <p className="text-red-300 font-mono text-sm break-words">{errorMessage}</p>
            </div>

            {analysisResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-8 max-h-[200px] overflow-y-auto">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-tighter">Raw Server Trace</p>
                <pre className="text-[10px] text-slate-400 font-mono whitespace-pre-wrap lowercase">
                  {typeof analysisResult === 'string' ? analysisResult : JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>
            )}

            <button 
              onClick={() => {
                setAnalysisResult(null);
                setAppState("input");
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-bold transition-all border border-slate-700 shadow-lg"
            >
              Go Back & Fix Input
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
