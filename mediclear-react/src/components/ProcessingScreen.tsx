"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Activity } from "lucide-react";

import { PROCESSING_MESSAGES } from "@/lib/constants";

/**
 * Full-screen loading state with clinical animations and cycling status messages.
 * @param {string} message - Optional override for the loading message
 */
export default function ProcessingScreen({ message }: { message?: string }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROCESSING_MESSAGES.length);
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-in fade-in duration-500">
      
      {/* Heartbeat EKG Animation Container */}
      <div className="w-full max-w-lg h-32 relative flex items-center justify-center mb-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        {/* Static Grid Lines */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Animated Line */}
        <div className="absolute w-full h-full z-10 opacity-75 animate-heartbeat-line" style={{ background: "transparent" }}>
          <svg className="w-[1000px] h-full drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,50 200,50 220,10 240,90 260,50 500,50 520,30 540,70 560,50 1000,50"
            />
          </svg>
        </div>
        
        <Activity className="absolute text-electricGreen/20 w-16 h-16 z-0" strokeWidth={1} />
      </div>

      <div className="h-12 flex items-center justify-center mb-8 text-center" aria-live="polite" aria-label="Processing status">
        <h2 
          className="text-2xl font-bold text-white transition-opacity duration-300"
        >
          {message || PROCESSING_MESSAGES[messageIndex]}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-2 bg-slate-800 rounded-full overflow-hidden mb-12">
        <div 
          className="h-full bg-electricGreen rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all ease-out"
          style={{ width: "100%", animation: "fill-progress 4s linear forwards" }}
        />
      </div>

      {/* Loading Skeletons */}
      <div className="w-full max-w-md space-y-4">
        <div className="animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-slate-800 rounded"></div>
        </div>
        <div className="animate-pulse delay-75">
            <div className="h-4 bg-slate-800 rounded w-1/3 mb-4"></div>
            <div className="h-24 bg-slate-800 rounded"></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fill-progress {
          0% { width: 0%; transform: translateX(-100%); }
          100% { width: 100%; transform: translateX(0); }
        }
      `}} />
    </div>
  );
}

ProcessingScreen.propTypes = {
  message: PropTypes.string,
};
