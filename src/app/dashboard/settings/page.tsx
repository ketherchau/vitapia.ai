"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, Key, Database, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Platform Settings</h2>
        <p className="text-zinc-500">Manage your account, organization, and orchestration preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation / Tabs Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "profile", label: "Profile", icon: User, active: true },
            { id: "security", label: "Security", icon: Shield },
            { id: "api", label: "API Keys", icon: Key },
            { id: "notifications", label: "Alerts", icon: Bell },
            { id: "data", label: "Data Management", icon: Database }
          ].map(tab => (
            <button key={tab.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              tab.active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content area */}
        <div className="md:col-span-3 space-y-6">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
            <h3 className="text-lg font-bold text-white mb-6">Profile Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#00FF85] p-1">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className="text-xl font-bold text-white">DH</span>
                  </div>
                </div>
                <div>
                  <button className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white font-medium hover:bg-zinc-800 transition-colors">
                    Upload new avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Full Name</label>
                  <input type="text" defaultValue="Degen Higgs" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Email Address</label>
                  <input type="email" defaultValue="admin@vitapia.ai" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-400 cursor-not-allowed" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">Organization / Workspace</label>
                <input type="text" defaultValue="Vitapia HQ" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black font-bold hover:scale-105 transition-transform shadow-lg">
                Save Changes
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-[#00E5FF]" /> Orchestrator Sync</h3>
            <p className="text-sm text-zinc-400 mb-6">Your Next.js dashboard is natively connected to the AWS microservice handling AI agent generation.</p>
            
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">Orchestrator Connection</p>
                <p className="text-xs text-zinc-500 mt-1">Status: Active • Latency: 42ms</p>
              </div>
              <div className="px-3 py-1 bg-[#00FF85]/10 text-[#00FF85] rounded-full text-xs font-bold uppercase tracking-widest border border-[#00FF85]/20">
                Connected
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
