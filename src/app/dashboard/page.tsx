"use client";

import { Activity, Clock, Zap, ArrowRight, BarChart3, AlertCircle, Users } from "lucide-react";
import Link from "next/link";

const recentSimulations = [
  {
    id: "SIM-8492",
    name: "Sugar-Free Oat Milk Launch",
    audience: "HK Baseline (1,000 Agents)",
    status: "Completed",
    date: "2026-03-19",
    cost: "100 Credits"
  },
  {
    id: "SIM-8491",
    name: "Tsim Sha Tsui Mall Advertising Test",
    audience: "Kowloon Youth (500 Agents)",
    status: "Completed",
    date: "2026-03-18",
    cost: "50 Credits"
  },
  {
    id: "SIM-8490",
    name: "Insurance Premium Pricing Elasticity",
    audience: "HK High-Income (2,000 Agents)",
    status: "Failed (API Timeout)",
    date: "2026-03-15",
    cost: "Refunded"
  }
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Banner */}
      <div className="p-8 md:p-10 rounded-[2rem] border border-zinc-800 bg-gradient-to-r from-zinc-900 to-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00E5FF]/20 to-transparent blur-[80px]" />
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 relative z-10">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00FF85]">Admin.</span></h2>
        <p className="text-lg text-zinc-400 max-w-2xl relative z-10">
          Your synthetic populations are standing by. You have <strong className="text-white">1,250 simulation credits</strong> remaining in your Tier 1: Pulse Check plan.
        </p>
        <Link 
          href="/dashboard/new" 
          className="inline-flex items-center gap-3 px-6 py-3 mt-8 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform relative z-10"
        >
          Launch New Simulation <Zap className="w-4 h-4 text-[#00E5FF]" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF]">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Total Simulations</p>
            <h3 className="text-3xl font-black text-white">24</h3>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-[#00FF85]/10 text-[#00FF85]">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Agents Spawned</p>
            <h3 className="text-3xl font-black text-white">45,500</h3>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-zinc-800 text-white">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Avg Turnaround</p>
            <h3 className="text-3xl font-black text-white">24 <span className="text-xl text-zinc-600">sec</span></h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Recent Pulse Checks</h3>
          <Link href="/dashboard/results" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">View all &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/20">
                <th className="p-5 text-xs font-mono uppercase tracking-wider text-zinc-500">ID</th>
                <th className="p-5 text-xs font-mono uppercase tracking-wider text-zinc-500">Scenario Name</th>
                <th className="p-5 text-xs font-mono uppercase tracking-wider text-zinc-500">Audience</th>
                <th className="p-5 text-xs font-mono uppercase tracking-wider text-zinc-500">Date</th>
                <th className="p-5 text-xs font-mono uppercase tracking-wider text-zinc-500">Status</th>
                <th className="p-5 text-xs font-mono uppercase tracking-wider text-zinc-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {recentSimulations.map((sim, i) => (
                <tr key={i} className="hover:bg-zinc-900/50 transition-colors group">
                  <td className="p-5 text-sm font-medium text-zinc-400">{sim.id}</td>
                  <td className="p-5 text-sm font-bold text-white">{sim.name}</td>
                  <td className="p-5 text-sm text-zinc-400">{sim.audience}</td>
                  <td className="p-5 text-sm text-zinc-500">{sim.date}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      sim.status === "Completed" ? "bg-[#00FF85]/10 text-[#00FF85]" : "bg-red-500/10 text-red-500"
                    }`}>
                      {sim.status === "Completed" ? <BarChart3 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {sim.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium text-[#00E5FF] hover:underline flex items-center justify-end gap-1 ml-auto">
                      View Report <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

