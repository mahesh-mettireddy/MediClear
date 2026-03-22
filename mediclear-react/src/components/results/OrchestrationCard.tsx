"use client";

import { ShieldAlert, CheckCircle } from "lucide-react";

interface OrchestrationProps {
  orchestration: any;
}

/**
 * Manages hospital resource allocation and bed logistics.
 * @param {Object} orchestration - Orchestration data
 */
export default function OrchestrationCard({ orchestration }: OrchestrationProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
        <ShieldAlert className="w-5 h-5 text-purple-400" /> Hospital Orchestration
      </h3>
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 uppercase">Bed Required</span>
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded border border-purple-500/30 text-sm font-bold tracking-wider">
            {orchestration?.bed_type_required || "GENERAL"}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-500 uppercase">Specialist</span>
          <span className="text-white font-semibold flex items-center gap-1">
            {orchestration?.specialist_required || "N/A"}
          </span>
        </div>
        
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Resource Activation List</p>
          <ul className="space-y-2">
            {orchestration?.resources_to_activate?.map((res: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-electricGreen mt-0.5 shrink-0" />
                <span className="text-sm text-slate-200">{res}</span>
              </li>
            )) || <p className="text-sm text-slate-500">None</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
