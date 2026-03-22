"use client";

import { FileIcon } from "lucide-react";

interface ContextFieldsProps {
  age: string;
  setAge: (val: string) => void;
  eta: string;
  setEta: (val: string) => void;
  reporter: string;
  setReporter: (val: string) => void;
}

/**
 * Renders demographic and logistical input fields for the emergency triage.
 * @param {string} age - Estimated age of patient
 * @param {string} eta - Ambulance Arrival Time
 * @param {string} reporter - Role of person reporting
 */
export default function ContextFields({ age, setAge, eta, setEta, reporter, setReporter }: ContextFieldsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[350px]">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <FileIcon className="w-5 h-5 text-slate-400" /> Optional Context
      </h2>
      <div className="space-y-4 flex-1">
        <div>
          <label htmlFor="patient-age" className="block text-sm font-medium text-slate-400 mb-1">Patient approximate age</label>
          <input
            id="patient-age"
            type="number"
            className="w-full bg-slate-950 border border-slate-700 rounded-md p-2.5 text-white focus:outline-none focus:border-electricGreen/50 focus:ring-1 focus:ring-electricGreen/30 transition-colors"
            placeholder="e.g. 65"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            aria-describedby="age-hint"
          />
          <p id="age-hint" className="sr-only">Enter the estimated age of the patient.</p>
        </div>
        <div>
          <label htmlFor="ambulance-eta" className="block text-sm font-medium text-slate-400 mb-1">Ambulance ETA (minutes)</label>
          <input
            id="ambulance-eta"
            type="number"
            className="w-full bg-slate-950 border border-slate-700 rounded-md p-2.5 text-white focus:outline-none focus:border-electricGreen/50 focus:ring-1 focus:ring-electricGreen/30 transition-colors"
            placeholder="e.g. 15"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
            aria-describedby="eta-hint"
          />
          <p id="eta-hint" className="sr-only">Enter the estimated minutes until ambulance arrival.</p>
        </div>
        <div>
          <label htmlFor="reporter-role" className="block text-sm font-medium text-slate-400 mb-1">Reported by</label>
          <select
            id="reporter-role"
            className="w-full bg-slate-950 border border-slate-700 rounded-md p-2.5 text-white focus:outline-none focus:border-electricGreen/50 focus:ring-1 focus:ring-electricGreen/30 transition-colors"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            aria-label="Select who is reporting"
          >
            <option value="Unknown">Unknown</option>
            <option value="Patient">Patient</option>
            <option value="Family Member">Family Member / Caregiver</option>
            <option value="Paramedic">Paramedic / EMS</option>
          </select>
        </div>
      </div>
    </div>
  );
}
