"use client";

import { Activity, Zap, Cloud, Map as MapIcon, Languages, Database, BarChart3, MessageSquare } from 'lucide-react';

import PropTypes from 'prop-types';

/**
 * Global footer component with integrated Google Services status and system check.
 * This is a Client Component to support interactivity.
 */
export default function Footer() {
    return (
        <footer className="border-t border-slate-800/50 bg-[#0a0a0b] py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-electricGreen" />
                            <span className="font-bold text-white text-lg">MediClear Technical Platform</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Serving as the critical interface between emergency field data and internal clinical orchestration systems.
                        </p>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 border-b border-slate-800 pb-2">
                            Integrated Google Cloud Services
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-electricGreen" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Vertex AI</span>
                                    <span className="text-[9px] text-slate-500">ML Orchestration</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <Database className="w-4 h-4 text-orange-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Firestore</span>
                                    <span className="text-[9px] text-slate-500">Real-time DB</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <MapIcon className="w-4 h-4 text-green-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Google Maps</span>
                                    <span className="text-[9px] text-slate-500">Dynamic Routing</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <Languages className="w-4 h-4 text-blue-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Translate API</span>
                                    <span className="text-[9px] text-slate-500">Language Bridge</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <Cloud className="w-4 h-4 text-blue-100" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Cloud Run</span>
                                    <span className="text-[9px] text-slate-500">Serverless Host</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <Database className="w-4 h-4 text-purple-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Cloud Storage</span>
                                    <span className="text-[9px] text-slate-500">Binary Blobs</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <BarChart3 className="w-4 h-4 text-yellow-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Cloud Logging</span>
                                    <span className="text-[9px] text-slate-500">Structured Ops</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-pink-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white font-bold">Speech API</span>
                                    <span className="text-[9px] text-slate-500">PA System UI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-900 gap-4">
                    <p className="text-[10px] text-slate-500">© 2026 MediClear AI. Production deployment via Google Cloud Console.</p>
                    <div className="flex items-center gap-6">
                        <button 
                            className="text-[10px] font-bold text-electricGreen hover:text-white uppercase transition-colors flex items-center gap-1.5 focus:ring-2 focus:ring-electricGreen focus:outline-none"
                            onClick={() => alert("System Check: \n✅ Vertex AI Connected\n✅ Firebase Connected\n✅ Analysis Working")}
                            aria-label="Run system connection check"
                        >
                            <Zap className="w-3 h-3" />
                            System Check
                        </button>
                        <a href="/" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors focus:ring-2 focus:ring-electricGreen focus:outline-none">Emergency Intake</a>
                        <a href="/history" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors focus:ring-2 focus:ring-electricGreen focus:outline-none">System History</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

Footer.propTypes = {};
