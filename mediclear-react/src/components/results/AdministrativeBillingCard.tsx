"use client";

import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdministrativeProps {
  admin: any;
}

/**
 * Summarizes billing codes, insurance, and pre-authorization status.
 * @param {Object} admin - Administrative routing data
 */
export default function AdministrativeBillingCard({ admin }: AdministrativeProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center justify-between">
        <span className="flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400" /> Administrative & Billing</span>
        {admin?.requires_immediate_human_review && (
          <span className="bg-priority-3 text-black text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Human Review
          </span>
        )}
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-500 mb-1">Insurance Carrier</p>
          <p className="text-sm font-semibold text-white">{admin?.insurance_carrier_detected || "Not Detected"}</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-500 mb-1">Pre-Auth Required</p>
          <p className={cn("text-sm font-bold", admin?.pre_authorization_required ? "text-priority-1" : "text-electricGreen")}>
            {admin?.pre_authorization_required ? "YES" : "NO"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-400 bg-slate-800 px-2 py-1 inline-block rounded mb-2 font-mono">ICD-10 CODES</p>
          <div className="space-y-1">
            {admin?.anticipated_icd_10_codes?.map((code: any, i: number) => (
              <div key={i} className="flex items-center justify-between bg-slate-950 p-2 rounded text-sm border border-slate-800/50">
                <span className="font-mono text-blue-300 w-16">{code.code}</span>
                <span className="text-slate-300 text-xs truncate flex-1 mx-2">{code.description}</span>
                {code.verified ? 
                  <CheckCircle className="w-3 h-3 text-electricGreen" /> : 
                  <AlertTriangle className="w-3 h-3 text-priority-3" />
                }
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 bg-slate-800 px-2 py-1 inline-block rounded mb-2 font-mono">CPT CODES</p>
          <div className="space-y-1">
            {admin?.anticipated_cpt_codes?.map((code: any, i: number) => (
              <div key={i} className="flex items-center justify-between bg-slate-950 p-2 rounded text-sm border border-slate-800/50">
                <span className="font-mono text-purple-300 w-16">{code.code}</span>
                <span className="text-slate-300 text-xs truncate flex-1 mx-2">{code.description}</span>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-bold uppercase", code.priority === "immediate" ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-400")}>
                  {code.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
