"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, BarChart3, AlertCircle, Calendar, Users, Target, Activity } from "lucide-react";
import Link from "next/link";

const fallbackSimulations = [
  {
    id: "SIM-8492",
    name: "Sugar-Free Oat Milk Launch (TST)",
    audience: "HK Baseline (1,000 Agents)",
    status: "Completed",
    date: "2026-03-19",
    time: "14:23",
    metrics: { accuracy: "97.2%", participants: 1000 },
    url: "/dashboard/results/SIM-8492"
  },
  {
    id: "SIM-8491",
    name: "Tsim Sha Tsui Mall Advertising Test",
    audience: "Kowloon Youth (500 Agents)",
    status: "Completed",
    date: "2026-03-18",
    time: "09:12",
    metrics: { accuracy: "94.5%", participants: 500 },
    url: "/dashboard/results/SIM-8491"
  }
];

type SimulationData = {
  id: string;
  name: string;
  audience: string;
  status: string;
  date: string;
  time: string;
  metrics: { accuracy: string; participants: number } | null;
  url: string;
};

export default function ResultsList() {
  const [simulations, setSimulations] = useState<SimulationData[]>(fallbackSimulations);

  useEffect(() => {
    fetch("/api/simulations")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.simulations && data.simulations.length > 0) {
          const mapped = data.simulations.map((sim: Record<string, string | number>) => {
            const dateStr = sim.created_at as string;
            const dateObj = new Date(dateStr);
            return {
              id: String(sim.sim_id),
              name: String(sim.name),
              audience: String(sim.audience_profile),
              status: String(sim.status),
              date: dateObj.toISOString().split("T")[0],
              time: dateObj.toTimeString().split("T")[1].substring(0, 5),
              metrics: sim.status === "Completed" ? { accuracy: "TBD", participants: 1000 } : null,
              url: sim.status === "Completed" ? `/dashboard/results/${sim.sim_id}` : "#"
            };
          });
          setSimulations(mapped);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Simulation Reports</h2>
          <p className="text-zinc-500">Access and export your historical predictive data.</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
        >
          New Simulation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {simulations.map((sim, i) => (
          <motion.div 
            key={sim.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
          >
            <div className="flex items-start gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                sim.status === "Completed" ? "bg-[#00FF85]/10 text-[#00FF85]" : 
                sim.status === "Running" ? "bg-[#00E5FF]/10 text-[#00E5FF]" :
                "bg-red-500/10 text-red-500"
              }`}>
                {sim.status === "Completed" ? <BarChart3 className="w-7 h-7" /> : 
                 sim.status === "Running" ? <Activity className="w-7 h-7 animate-pulse" /> : 
                 <AlertCircle className="w-7 h-7" />}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-zinc-500">{sim.id}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    sim.status === "Completed" ? "bg-[#00FF85]/20 text-[#00FF85]" : 
                    sim.status === "Running" ? "bg-[#00E5FF]/20 text-[#00E5FF]" :
                    "bg-red-500/20 text-red-500"
                  }`}>
                    {sim.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{sim.name}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {sim.audience}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {sim.date} ({sim.time})</span>
                  {sim.metrics && (
                    <span className="flex items-center gap-1.5 text-[#00E5FF]"><Target className="w-4 h-4" /> Est. Accuracy: {sim.metrics.accuracy}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                disabled={sim.status !== "Completed"}
                className="flex-1 md:flex-none px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Download CSV"
              >
                <Download className="w-5 h-5" />
              </button>
              <Link 
                href={sim.status === "Completed" ? sim.url : "#"}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  sim.status === "Completed" 
                    ? "bg-zinc-800 text-white hover:bg-[#00E5FF] hover:text-black shadow-[0_0_15px_rgba(0,229,255,0)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]" 
                    : "bg-zinc-900 text-zinc-600 cursor-not-allowed"
                }`}
              >
                View Report
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


