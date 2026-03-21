"use client";

import React from 'react';
import { Check, X, Building2, BrainCircuit, Users, Zap, Gauge } from 'lucide-react';

type FeatureKey = 'speed' | 'cost' | 'bias' | 'scale' | 'dynamic';

type Competitor = {
  name: string;
  speed: string;
  cost: string;
  bias: string;
  scale: string;
  dynamic: boolean;
  color: string;
  highlight?: boolean;
};

const competitors: Competitor[] = [
  {
    name: 'Traditional Agencies',
    speed: 'Weeks / Months',
    cost: 'High ($50k+)',
    bias: 'High (Self-reported)',
    scale: 'Limited (N=100-1000)',
    dynamic: false,
    color: '#ef4444', // red
  },
  {
    name: 'Generic LLM APIs',
    speed: 'Instant',
    cost: 'Low ($1k)',
    bias: 'High (Hallucinations)',
    scale: 'High (Stateless)',
    dynamic: false,
    color: '#eab308', // yellow
  },
  {
    name: 'Vitapia.ai',
    speed: '24 Hours',
    cost: 'Medium ($5k)',
    bias: 'Low (Math Validated)',
    scale: 'Massive (N=10,000+)',
    dynamic: true,
    color: '#00E5FF', // cyan
    highlight: true,
  },
];

const features: { key: FeatureKey; label: string; icon: React.ElementType }[] = [
  { key: 'speed', label: 'Turnaround Time', icon: Zap },
  { key: 'cost', label: 'Average Cost', icon: Building2 },
  { key: 'bias', label: 'Data Bias/Error', icon: BrainCircuit },
  { key: 'scale', label: 'Sample Scale', icon: Users },
  { key: 'dynamic', label: 'Dynamic Interactions', icon: Gauge },
];

export default function CompetitorComparison() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-20 relative z-10">
      <div className="overflow-x-auto rounded-[2rem] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl p-6">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr>
              <th className="p-6 text-xl text-zinc-400 font-medium">Comparison Vector</th>
              {competitors.map((comp) => (
                <th key={comp.name} className={`p-6 text-2xl font-bold ${comp.highlight ? 'text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]' : 'text-white'}`}>
                  {comp.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {features.map((feat) => (
              <tr key={feat.key} className="group hover:bg-zinc-900/50 transition-colors">
                <td className="p-6 font-semibold text-zinc-300 flex items-center gap-3">
                  <feat.icon className="w-5 h-5 text-zinc-500" />
                  {feat.label}
                </td>
                {competitors.map((comp) => (
                  <td key={`${feat.key}-${comp.name}`} className={`p-6 text-lg ${comp.highlight ? 'text-white font-medium bg-[#00E5FF]/5 rounded-xl border border-[#00E5FF]/10 shadow-[inset_0_0_15px_rgba(0,229,255,0.05)]' : 'text-zinc-400'}`}>
                    {typeof comp[feat.key as keyof Competitor] === 'boolean' ? (
                      comp[feat.key as keyof Competitor] ? <Check className="w-6 h-6 text-green-500" /> : <X className="w-6 h-6 text-red-500" />
                    ) : (
                      comp[feat.key as keyof Competitor] as React.ReactNode
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}