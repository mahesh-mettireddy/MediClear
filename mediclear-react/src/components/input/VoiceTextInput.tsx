"use client";

import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface VoiceTextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

/**
 * Handles voice-to-text and manual text input for emergency descriptions.
 * Uses Web Speech API for real-time transcription.
 * @param {string} value - Current text value
 * @param {Function} onChange - Update callback
 */
export default function VoiceTextInput({ value, onChange, placeholder }: VoiceTextInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        onChange(currentTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [onChange]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      onChange(""); 
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-slate-400" /> Speech & Text
        </h2>
        <button
          onClick={toggleRecording}
          className={cn(
            "p-2 rounded-full transition-all duration-300 focus:ring-2 focus:ring-red-400 focus:outline-none",
            isRecording ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-slate-800 text-slate-400 hover:text-white"
          )}
          aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
          aria-pressed={isRecording}
        >
          {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>
      <label htmlFor="voice-input-textarea" className="sr-only">Describe the emergency</label>
      <textarea
        id="voice-input-textarea"
        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-electricGreen/50 focus:ring-1 focus:ring-electricGreen/30 resize-none transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby="voice-input-hint"
      />
      <p id="voice-input-hint" className="sr-only">Detailed description of the medical emergency, as spoken or typed.</p>
      {isRecording && (
        <div className="flex items-center gap-2 mt-3 text-red-500 text-sm font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Recording...
        </div>
      )}
    </div>
  );
}
