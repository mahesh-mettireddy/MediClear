"use client";

import { Send, AlertTriangle, Languages } from "lucide-react";
import { useState } from "react";

interface FamilyCommsProps {
  comms: any;
  missingData: string[];
}

/**
 * Generates and sends family alerts, and flags critical missing data.
 * Includes Google Translate integration for communication barriers.
 * @param {Object} comms - Family communication data
 * @param {string[]} missingData - List of critical missing data
 */
export default function FamilyCommunicationCard({ comms, missingData }: FamilyCommsProps) {
  const [alertSent, setAlertSent] = useState(false);

  // Map language codes to flag emojis (simple subset)
  const getFlag = (langCode: string) => {
      const map: Record<string, string> = {
          'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'hi': '🇮🇳', 
          'zh': '🇨🇳', 'ja': '🇯🇵', 'ar': '🇸🇦', 'pt': '🇧🇷',
          'ru': '🇷🇺', 'it': '🇮🇹', 'ko': '🇰🇷'
      };
      return map[langCode.toLowerCase().substring(0, 2)] || '🌐';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center justify-between">
        <span className="flex items-center gap-2"><Send className="w-5 h-5 text-blue-400" /> Family Communication</span>
        <span className="text-xs font-mono text-slate-400 px-2 py-1 bg-slate-950 border border-slate-800 rounded">
          {comms?.consent_status || "UNKNOWN"}
        </span>
      </h3>

      <div className="flex-1 flex flex-col">
        <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 block mb-1">Next of Kin</span>
          <span className="text-sm text-white font-medium">{comms?.next_of_kin_detected || "Not Detected"}</span>
        </div>

        <div className="space-y-4 flex-1 mb-4">
            <div>
                <p className="text-xs text-slate-500 mb-2 font-semibold">Automated English Alert</p>
                <div className="bg-[#128C7E]/20 border border-[#128C7E]/50 rounded-2xl p-4 rounded-tl-sm relative">
                    <p className="text-sm text-[#e9edef] leading-relaxed">
                        {comms?.alert_message || "No message generated."}
                    </p>
                    <span className="absolute bottom-2 right-3 text-[10px] text-green-500 font-mono opacity-80">WhatsApp Draft (EN)</span>
                </div>
            </div>

            {comms?.translated_alert_message && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-xs text-electricGreen mb-2 flex items-center gap-2 font-semibold">
                        <Languages className="w-3 h-3" /> 
                        Google Translate: {comms.detected_language} {getFlag(comms.detected_language)}
                    </p>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 rounded-tl-sm relative">
                        <p className="text-sm text-blue-100 leading-relaxed italic">
                            {comms.translated_alert_message}
                        </p>
                        <span className="absolute bottom-2 right-3 text-[10px] text-blue-400 font-mono opacity-80 uppercase tracking-tighter">Auto-Translated</span>
                    </div>
                </div>
            )}
        </div>

        <button 
          onClick={() => { setAlertSent(true); setTimeout(() => setAlertSent(false), 3000); }}
          className="bg-slate-800 hover:bg-slate-700 text-white w-full py-3 rounded-lg font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> 
          {alertSent ? "Alert Sent to Family" : "Approve & Send Alert"}
        </button>
      </div>

      {/* MISSING DATA FLAG */}
      {missingData?.length > 0 && (
        <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Missing Critical Data
          </p>
          <ul className="text-xs text-red-200 list-square pl-4 space-y-1">
            {missingData.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
