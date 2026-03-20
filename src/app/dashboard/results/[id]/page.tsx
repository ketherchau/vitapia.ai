"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Info, CheckCircle2, TrendingUp, Users, Database, Cpu, GitBranch, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SimulationChart3D from "@/components/SimulationChart3D";

export default function ReportDetail() {
  const pathname = usePathname();
  const simId = pathname.split("/").pop() || "SIM-8492";

  const [sim, setSim] = useState<Record<string, unknown> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

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

  const handleDownloadCSV = () => {
    if (!responses.length) return;
    const headers = ["Agent ID", "Age", "Gender", "Housing", "District", "Choice", "Reasoning"];
    const rows = responses.map((r: Record<string, unknown>) => {
      const demo = r.demographics as Record<string, string> || {};
      return [
        r.agent_id,
        demo.age || "",
        demo.gender || "",
        demo.housing || "",
        demo.district || "",
        `"${String(r.choice).replace(/"/g, '""')}"`,
        `"${String(r.reasoning).replace(/"/g, '""')}"`
      ].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vitapia_Sim_${sim.sim_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(responses.length / itemsPerPage);
  const currentVoices = responses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 pb-32 max-w-6xl mx-auto print:max-w-none print:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 print:mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/results" className="p-2 rounded-full hover:bg-zinc-800 transition-colors print:hidden">
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold text-white print:text-black">{String(sim.sim_id)}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                String(sim.status) === 'Completed' ? 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/20 print:border-black print:text-black' : 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20 animate-pulse'
              }`}>{String(sim.status)}</span>
            </div>
            <p className="text-zinc-500 print:text-gray-600">{String(sim.name)} • {String(sim.audience_profile)}</p>
          </div>
        </div>
        <div className="flex gap-3 print:hidden">
          <button onClick={handleDownloadCSV} className="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 font-bold hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Raw CSV
          </button>
          <button onClick={() => window.print()} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,133,0.3)]">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Context & Scenario (New section) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
      >
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800 print:border-gray-300 bg-zinc-900/30 print:bg-white">
          <h3 className="text-sm font-bold text-zinc-400 print:text-gray-500 uppercase tracking-widest mb-4">Background Scenario</h3>
          <p className="text-sm text-zinc-300 print:text-gray-800 whitespace-pre-wrap leading-relaxed">{String(sim.scenario_prompt || "No scenario provided.")}</p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-800 print:border-gray-300 bg-zinc-900/30 print:bg-white">
          <h3 className="text-sm font-bold text-zinc-400 print:text-gray-500 uppercase tracking-widest mb-4">Survey Question</h3>
          {(sim.questions as Array<{ text: string, options: string[] }>)?.map((q, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              <p className="text-sm font-bold text-white print:text-black mb-3">{q.text}</p>
              <div className="space-y-2">
                {q.options?.map((opt: string, oIdx: number) => (
                  <div key={oIdx} className="px-3 py-2 text-xs font-medium text-zinc-400 print:text-gray-600 bg-black/40 print:bg-gray-50 border border-zinc-800/50 print:border-gray-200 rounded-lg">
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Top Decision", value: topPct, sub: topChoice, icon: TrendingUp, color: "text-[#00E5FF]", printColor: "print:text-blue-600" },
          { label: "Responses", value: responses.length.toString(), sub: "Synthetic Agents", icon: Info, color: "text-red-400", printColor: "print:text-red-600" },
          { label: "Statistical Accuracy", value: (sim.results as Record<string, number>)?.accuracy_score ? `${(sim.results as Record<string, number>).accuracy_score.toFixed(1)}%` : "TBD", sub: "Based on MAE", icon: CheckCircle2, color: "text-[#00FF85]", printColor: "print:text-green-600" },
          { label: "Target Demo Match", value: "1,000", sub: "HK Census Baseline", icon: Users, color: "text-zinc-300", printColor: "print:text-gray-800" }
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[1.5rem] border border-zinc-800 print:border-gray-300 bg-zinc-950/80 print:bg-white shadow-lg relative overflow-hidden"
          >
            <div className={`absolute top-4 right-4 ${kpi.color} ${kpi.printColor}`}>
              <kpi.icon className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-sm font-medium text-zinc-500 print:text-gray-500 uppercase tracking-wide mb-2">{kpi.label}</p>
            <h3 className={`text-4xl font-black mb-1 ${kpi.color} ${kpi.printColor}`}>{kpi.value}</h3>
            <p className="text-xs text-zinc-500 print:text-gray-500">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* 3D Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-8 md:p-10 rounded-[2rem] border border-zinc-800 print:border-gray-300 bg-zinc-950/80 print:bg-white shadow-2xl relative print:hidden"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#00E5FF]/5 to-transparent pointer-events-none rounded-r-[2rem]" />
        
        <h3 className="text-2xl font-bold text-white mb-2">Behavioral Matrix Analysis</h3>
        <p className="text-zinc-400 mb-8 print:hidden">Interact with the 3D data structure to view how different demographics voted.</p>
        
        <div className="w-full h-[500px] relative bg-black/40 border border-zinc-800 rounded-[1.5rem] overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
          <SimulationChart3D responses={responses} />
        </div>
      </motion.div>

      {/* The AI Pipeline Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="p-8 md:p-10 rounded-[2rem] border border-zinc-800 bg-zinc-900/30 shadow-lg relative print:break-before-page"
      >
        <h3 className="text-2xl font-bold text-white print:text-black mb-2">The Generative Analytics Pipeline</h3>
        <p className="text-zinc-400 print:text-gray-600 mb-10">How Vitapia dynamically processes {responses.length.toLocaleString()} synthetic agents from origin to statistical insight.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 relative">
          {/* connecting lines for desktop */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-zinc-800 via-[#00E5FF]/50 to-zinc-800 z-0" />
          
          {[
            { step: "01", title: "Census Sampling", desc: "Agents injected with HK demographics (Age, Income, Housing)", icon: Database, color: "text-[#00E5FF]", bg: "bg-[#00E5FF]/10" },
            { step: "02", title: "Context Matrix", desc: "Scenario logic & budget constraints applied to individual profiles", icon: Cpu, color: "text-[#00FF85]", bg: "bg-[#00FF85]/10" },
            { step: "03", title: "Chain of Thought", desc: "LLMs execute individual reasoning and discrete choices autonomously", icon: GitBranch, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
            { step: "04", title: "Data Quantization", desc: "Natural language parsed into statistical arrays & dashboard metrics", icon: LayoutDashboard, color: "text-[#EC4899]", bg: "bg-[#EC4899]/10" }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center p-4 bg-zinc-950 print:bg-white rounded-2xl border border-zinc-800 print:border-gray-300">
              <div className={`w-16 h-16 rounded-2xl ${item.bg} border border-zinc-800 flex items-center justify-center mb-4`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <span className="text-xs font-black text-zinc-600 mb-1 uppercase tracking-widest">Step {item.step}</span>
              <h4 className="text-sm font-bold text-white print:text-black mb-2">{item.title}</h4>
              <p className="text-xs text-zinc-500 print:text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Focus Group Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6 print:break-before-page"
      >
        <h3 className="text-2xl font-bold text-white print:text-black mt-12 mb-6">Voices of the Swarm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVoices.map((voice: Record<string, unknown>, i: number) => {
            const demo = voice.demographics as Record<string, string>;
            const demoStr = `${demo?.age || "Adult"}, ${demo?.housing || "Private Housing"}`;
            const isTopChoice = voice.choice === topChoice;
            return (
            <div key={i} className="p-6 rounded-2xl border border-zinc-800 print:border-gray-300 bg-zinc-900/50 print:bg-white hover:bg-zinc-800/80 transition-colors break-inside-avoid">
              <div className="flex items-center justify-between border-b border-zinc-800/50 print:border-gray-200 pb-4 mb-4">
                <div>
                  <span className="text-xs font-mono text-[#00FF85] bg-[#00FF85]/10 print:bg-green-100 print:text-green-800 px-2 py-1 rounded">{String(voice.agent_id)}</span>
                </div>
                <span className="text-xs text-zinc-500 print:text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> {demo?.district || "Hong Kong"}</span>
              </div>
              <p className="text-sm italic text-zinc-300 print:text-gray-800 mb-4 leading-relaxed">&quot;{String(voice.reasoning)}&quot;</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className={`w-2 h-2 rounded-full ${isTopChoice ? 'bg-[#00FF85] print:bg-green-500' : 'bg-red-400 print:bg-red-500'}`} />
                <span className="text-xs text-zinc-500 print:text-gray-600 truncate max-w-[150px]">{String(voice.choice)}</span>
                <span className="text-xs text-zinc-600 print:text-gray-400 ml-auto truncate">{demoStr}</span>
              </div>
            </div>
          )})}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 print:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors text-sm font-bold"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors text-sm font-bold"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
