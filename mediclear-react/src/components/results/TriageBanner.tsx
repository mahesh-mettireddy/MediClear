"use client";

import { Activity, Volume2, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ESI_LEVELS } from "@/lib/constants";

interface TriageBannerProps {
  directive: string;
  esiLevel: string;
}

/**
 * High-visibility banner showing primary emergency directive and ESI triage level.
 * @param {string} directive - Primary action directive
 * @param {string} esiLevel - ESI risk level
 */
export default function TriageBanner({ directive, esiLevel }: TriageBannerProps) {
  const getEsiConfig = (level: string) => {
    const l = level.includes('1') ? 'Level 1' : 
              level.includes('2') ? 'Level 2' : 
              level.includes('3') ? 'Level 3' : 
              level.includes('4') ? 'Level 4' : 'Level 5';
    
    const config = ESI_LEVELS[l as keyof typeof ESI_LEVELS];
    
    if (l === 'Level 1') return { bg: 'bg-priority-1', text: 'text-white', animate: 'animate-pulse text-shadow-glow', icon: <AlertCircle />, label: config.label };
    if (l === 'Level 2') return { bg: 'bg-priority-2', text: 'text-white', animate: '', icon: <AlertTriangle />, label: config.label };
    if (l === 'Level 3') return { bg: 'bg-priority-3', text: 'text-black', animate: '', icon: <AlertTriangle />, label: config.label };
    if (l === 'Level 4') return { bg: 'bg-priority-4', text: 'text-black', animate: '', icon: <Info />, label: config.label };
    return { bg: 'bg-priority-5', text: 'text-black', animate: '', icon: <CheckCircle />, label: config.label };
  };

  const speakDirective = () => {
    if (!window || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(directive || "INITIALIZE TRAUMA PROTOCOL");
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const config = getEsiConfig(esiLevel);

  return (
    <div 
      role="alert" 
      aria-label={`ESI Triage Level: ${esiLevel}`}
      aria-live={esiLevel.includes('1') || esiLevel.includes('2') ? "assertive" : "polite"}
      className={cn("rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl tracking-tight transition-colors", config.bg, config.text, config.animate)}
    >
      <div className="flex-1">
        <h2 className="text-sm font-bold uppercase opacity-80 mb-1 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Primary Action Directive
        </h2>
        <div className="flex items-center gap-3">
            <p className="text-2xl md:text-4xl font-black uppercase">
            {directive || "INITIALIZE TRAUMA PROTOCOL"}
            </p>
            <button 
                onClick={speakDirective}
                className="p-2 rounded-full bg-black/10 hover:bg-black/30 transition-colors"
                aria-label="Speak announcement"
            >
                <Volume2 className="w-6 h-6" />
            </button>
        </div>
      </div>
      <div className="bg-black/20 px-6 py-3 rounded-lg border border-white/20 backdrop-blur-sm shrink-0 flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
          {config.icon}
          {config.label}
        </span>
        <span className="text-4xl font-black">{esiLevel.toUpperCase()}</span>
      </div>
    </div>
  );
}
