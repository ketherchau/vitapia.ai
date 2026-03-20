"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Info, CheckCircle2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ValidationChart3D from "@/components/ValidationChart3D";

export default function ReportDetail() {
  const pathname = usePathname();
  const simId = pathname.split("/").pop() || "SIM-8492";

  const [sim, setSim] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!simId) return;
    fetch(`/api/simulations/${simId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.simulation) {
          setSim(data.simulation);
        }
      })
      .catch(console.error);
  }, [simId]);

  if (!sim) {
    return <div className="p-20 text-center text-zinc-500 animate-pulse">Loading Simulation Analytics...</div>;
  }

  // Calculate top option choice dynamically
  const responses = (sim.results as Record<string, unknown>)?.agent_responses as Array<{ choice: string }> || [];
  const choiceCounts: Record<string, number> = {};
  responses.forEach((r: { choice: string }) => {
    choiceCounts[r.choice] = (choiceCounts[r.choice] || 0) + 1;
  });
  
  let topChoice = "N/A";
  let topPct = "0.0%";
  if (responses.length > 0) {
    const sorted = Object.entries(choiceCounts).sort((a, b) => b[1] - a[1]);
    topChoice = sorted[0][0];
    topPct = ((sorted[0][1] / responses.length) * 100).toFixed(1) + "%";
  }

  return (
    <div className="space-y-8 pb-32 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/results" className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold text-white">{String(sim.sim_id)}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                String(sim.status) === 'Completed' ? 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/20' : 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20 animate-pulse'
              }`}>{String(sim.status)}</span>
            </div>
            <p className="text-zinc-500">{String(sim.name)} • {String(sim.audience_profile)}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 font-bold hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Raw CSV
          </button>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,133,0.3)]">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Top Decision", value: topPct, sub: topChoice, icon: TrendingUp, color: "text-[#00E5FF]" },
          { label: "Responses", value: responses.length.toString(), sub: "Synthetic Agents", icon: Info, color: "text-red-400" },
          { label: "Statistical Accuracy", value: (sim.results as Record<string, number>)?.accuracy_score ? `${(sim.results as Record<string, number>).accuracy_score.toFixed(1)}%` : "TBD", sub: "Based on MAE", icon: CheckCircle2, color: "text-[#00FF85]" },
          { label: "Target Demo Match", value: "1,000", sub: "HK Census Baseline", icon: Users, color: "text-zinc-300" }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 shadow-lg relative overflow-hidden"
          >
            <div className={`absolute top-4 right-4 ${kpi.color}`}>
              <kpi.icon className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-2">{kpi.label}</p>
            <h3 className={`text-4xl font-black mb-1 ${kpi.color}`}>{kpi.value}</h3>
            <p className="text-xs text-zinc-500">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* 3D Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-8 md:p-10 rounded-[2rem] border border-zinc-800 bg-zinc-950/80 shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#00E5FF]/5 to-transparent pointer-events-none rounded-r-[2rem]" />
        
        <h3 className="text-2xl font-bold text-white mb-2">Behavioral Heatmap Validation</h3>
        <p className="text-zinc-400 mb-8">Interact with the 3D data structure to view agent decisions vs. demographic baseline.</p>
        
        {/* Re-using the interactive 3D component we built for the landing page */}
        <div className="w-full h-[500px] relative bg-black/40 border border-zinc-800 rounded-[1.5rem] overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
          <ValidationChart3D />
        </div>
      </motion.div>

      {/* Focus Group Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-white mt-12 mb-6">Voices of the Swarm</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: "HK_4092", demo: "Age 25-34, Private Housing", district: "Tsim Sha Tsui",
              quote: "At HK$32, I expect premium ingredients. Since the competitor offers similar taste for HK$25, my budget restricts me from switching for a daily coffee.",
              sentiment: "Negative (Price)"
            },
            {
              id: "HK_1021", demo: "Age 15-24, HOS Housing", district: "Kwun Tong",
              quote: "I am lactose intolerant and constantly looking for sugar-free options. The HK$32 price point is high, but the health benefits justify it as a weekend treat.",
              sentiment: "Positive (Health)"
            },
            {
              id: "HK_8829", demo: "Age 35-44, Private Housing", district: "Central & Western",
              quote: "I'd buy it weekly. It fits my lifestyle and the zero-sugar aspect is exactly what I look for after a gym session, regardless of the $7 premium.",
              sentiment: "Positive (Lifestyle)"
            }
          ].map((voice, i) => (
            <div key={i} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4 mb-4">
                <div>
                  <span className="text-xs font-mono text-[#00FF85] bg-[#00FF85]/10 px-2 py-1 rounded">{voice.id}</span>
                </div>
                <span className="text-xs text-zinc-500 flex items-center gap-1"><Users className="w-3 h-3" /> {voice.district}</span>
              </div>
              <p className="text-sm italic text-zinc-300 mb-4 leading-relaxed">&quot;{voice.quote}&quot;</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className={`w-2 h-2 rounded-full ${voice.sentiment.includes('Positive') ? 'bg-[#00FF85]' : 'bg-red-400'}`} />
                <span className="text-xs text-zinc-500">{voice.sentiment}</span>
                <span className="text-xs text-zinc-600 ml-auto">{voice.demo}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
