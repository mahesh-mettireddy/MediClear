"use client";

import { HeartPulse, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientContextProps {
  context: any;
}

/**
 * Displays patient demographics, medications, and risk factors.
 * @param {Object} context - Patient context object
 */
export default function PatientContextCard({ context }: PatientContextProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
        <HeartPulse className="w-5 h-5 text-electricGreen" /> Patient Context
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Chief Complaint</p>
          <p className="text-slate-200 font-medium">{context?.chief_complaint || "N/A"}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex-1">
            <p className="text-xs text-slate-500 uppercase">Age</p>
            <p className="text-lg font-semibold text-white">{context?.estimated_age || "Unknown"}</p>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex-1">
            <p className="text-xs text-slate-500 uppercase">Comm. Barrier</p>
            <p className={cn("text-lg font-semibold w-fit", context?.communication_barrier ? "text-priority-3" : "text-electricGreen")}>
              {context?.communication_barrier ? "DETECTED" : "NONE"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Medications</p>
          <div className="flex flex-wrap gap-2">
            {context?.extracted_medications?.length > 0 ? (
              context.extracted_medications.map((m: string, i: number) => (
                <span key={i} className="bg-electricGreen/10 text-electricGreen text-xs px-2 py-1 rounded-md border border-electricGreen/20">{m}</span>
              ))
            ) : (
              <span className="text-slate-500 text-sm italic">None detected</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-priority-3" /> Risk Factors
          </p>
          <ul className="text-sm text-slate-300 space-y-1 list-disc pl-4">
            {context?.identified_risks?.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            )) || <li className="text-slate-500 italic">None</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
