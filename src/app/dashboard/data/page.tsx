"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon, AlertCircle, RefreshCw } from "lucide-react";

export default function DataConnections() {
  return (
    <div className="space-y-8 pb-32 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Data Connections</h2>
          <p className="text-zinc-500">Connect CRM, POS, and Marketing platforms to validate synthetic predictions against real-world data.</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,133,0.3)]">
          <LinkIcon className="w-4 h-4" /> Connect Data Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "Shopify", status: "Connected", sync: "Syncing...", icon: "🛍️", color: "text-[#00FF85]" },
          { name: "Salesforce", status: "Disconnected", sync: "Last sync: 2 days ago", icon: "☁️", color: "text-zinc-500" },
          { name: "Google Analytics", status: "Connected", sync: "Synced 1h ago", icon: "📊", color: "text-[#00E5FF]" }
        ].map((source, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-2xl border border-zinc-800">
                {source.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{source.name}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${source.status === 'Connected' ? 'bg-[#00FF85]' : 'bg-zinc-600'}`} />
                  <span className={`text-sm ${source.status === 'Connected' ? 'text-zinc-300' : 'text-zinc-600'}`}>{source.status}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center">
              <span className="text-xs text-zinc-500">{source.sync}</span>
              {source.status === 'Connected' ? (
                <button className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-400">
                  <RefreshCw className="w-4 h-4" />
                </button>
              ) : (
                <button className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  Reconnect
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-8 rounded-[2rem] border border-dashed border-zinc-800 bg-zinc-900/20 text-center"
      >
        <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Ground Truth Validation Module</h3>
        <p className="text-zinc-500 max-w-lg mx-auto mb-6">
          Connect your actual sales figures to measure the Mean Absolute Error (MAE) of the synthetic audience. The AI model will fine-tune itself based on your real-world conversions.
        </p>
        <button className="px-6 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm font-bold hover:bg-zinc-700 transition-colors">
          Configure Validation API
        </button>
      </motion.div>
    </div>
  );
}
