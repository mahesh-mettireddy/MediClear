"use client";

import { Activity, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ClinicalAssessmentProps {
  assessment: any;
}

/**
 * Visualizes AI reasoning, deterioration risk, and critical data gaps.
 * @param {Object} assessment - Clinical assessment object
 */
export default function ClinicalAssessmentCard({ assessment }: ClinicalAssessmentProps) {
  const [timeLeft, setTimeLeft] = useState(
    assessment?.deterioration_risk?.window_minutes ? assessment.deterioration_risk.window_minutes * 60 : 0
  );

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
        <Activity className="w-5 h-5 text-blue-400" /> Clinical Assessment
      </h3>
      <div className="space-y-4 flex-1">
        <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg">
          <p className="text-sm text-blue-100 leading-relaxed">
            {assessment?.clinical_reasoning || "Pending reasoning..."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Deterioration Risk</span>
            <span className={cn(
              "font-black text-lg",
              assessment?.deterioration_risk?.likelihood === "HIGH" ? "text-priority-1 animate-pulse" :
              assessment?.deterioration_risk?.likelihood === "MODERATE" ? "text-priority-3" : "text-priority-5"
            )}>
              {assessment?.deterioration_risk?.likelihood || "UNKNOWN"}
            </span>
          </div>
          <div className={cn(
            "border rounded-lg p-3 text-center flex flex-col justify-center items-center relative overflow-hidden",
            timeLeft < 300 ? "bg-red-950/40 border-red-900/50" : "bg-slate-950 border-slate-800"
          )}>
            <span className="text-[10px] text-slate-500 z-10 uppercase tracking-widest block mb-1">Critical Window</span>
            <span className={cn("font-mono text-2xl font-bold z-10", timeLeft < 300 ? "text-red-400" : "text-white")}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Predicted Trajectory
          </p>
          <p className="text-sm text-slate-300 italic border-l-2 border-slate-700 pl-3">
            &quot;{assessment?.deterioration_risk?.predicted_trajectory || "Unknown"}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
