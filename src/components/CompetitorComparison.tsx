"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Users, ShieldCheck, MapPin, Target, Briefcase } from 'lucide-react';

type Competitor = {
  name: string;
  enterpriseReady: { value: boolean; label: string };
  multiAgent: { value: boolean; label: string };
  asiaFocus: { value: boolean; label: string };
  compliance: { value: boolean; label: string };
  businessSaaS: { value: boolean; label: string };
  color: string;
  highlight?: boolean;
};

const competitors: Competitor[] = [
  {
    name: 'Aaru',
    enterpriseReady: { value: true, label: 'Proven (Unicorn)' },
    multiAgent: { value: true, label: 'Dynamic Populations' },
    asiaFocus: { value: false, label: 'US-Centric' },
    compliance: { value: true, label: 'US/EU Standards' },
    businessSaaS: { value: true, label: 'Enterprise Platform' },
    color: '#a1a1aa', // zinc-400
  },
  {
    name: 'Ditto / Evidenza',
    enterpriseReady: { value: true, label: 'Enterprise Focus' },
    multiAgent: { value: false, label: 'Static Personas' },
    asiaFocus: { value: false, label: 'Global / US Based' },
    compliance: { value: true, label: 'Standard Compliance' },
    businessSaaS: { value: true, label: 'B2B SaaS' },
    color: '#a1a1aa', 
  },
  {
    name: 'Bauhinia AI (Aivilization)',
    enterpriseReady: { value: false, label: 'Academic / Sandbox' },
    multiAgent: { value: true, label: 'Social Simulations' },
    asiaFocus: { value: true, label: 'HK Based' },
    compliance: { value: false, label: 'Research Focused' },
    businessSaaS: { value: false, label: 'Lacks SaaS Model' },
    color: '#a1a1aa', 
  },
  {
    name: 'Vitapia',
    enterpriseReady: { value: true, label: 'Commercial Ready' },
    multiAgent: { value: true, label: 'Dynamic Multi-Agent' },
    asiaFocus: { value: true, label: 'Deep Localized Data (C&SD)' },
    compliance: { value: true, label: 'PDPO-Compliant' },
    businessSaaS: { value: true, label: 'Decision Dominance SaaS' },
    color: '#00E5FF', // cyan
    highlight: true,
  },
];

type FeatureKey = 'enterpriseReady' | 'multiAgent' | 'asiaFocus' | 'compliance' | 'businessSaaS';

const features: { key: FeatureKey; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'enterpriseReady', label: 'Enterprise Ready', icon: Briefcase, description: 'Production-grade for large-scale operations' },
  { key: 'businessSaaS', label: 'Decision Dominance SaaS', icon: Target, description: 'Actionable business predictions for brands' },
  { key: 'multiAgent', label: 'Dynamic Multi-Agent', icon: Users, description: 'Interacting populations, not just static personas' },
  { key: 'asiaFocus', label: 'Asia / Localized Data', icon: MapPin, description: 'Deep demographic roleplay for HK/Greater Bay Area' },
  { key: 'compliance', label: 'Local Compliance', icon: ShieldCheck, description: 'PDPO & regional data sovereignty alignment' },
];

export default function CompetitorComparison() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-24 relative z-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          The <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Vitapia</span> Advantage
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          The first commercial, enterprise-ready multi-agent population simulator in Asia.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="overflow-x-auto rounded-[2rem] border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl p-2 sm:p-6"
      >
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr>
              <th className="p-4 sm:p-6 text-xl text-zinc-400 font-medium border-b border-zinc-800/50 w-1/4">Capability</th>
              {competitors.map((comp) => (
                <th key={comp.name} className={`p-4 sm:p-6 text-xl sm:text-2xl font-bold border-b border-zinc-800/50 text-center w-[18%] ${comp.highlight ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'text-zinc-100'}`}>
                  {comp.name}
                  {comp.highlight && (
                    <div className="text-sm font-normal text-cyan-400/80 mt-1 drop-shadow-none">
                      Our Edge
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {features.map((feat, idx) => (
              <motion.tr 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                key={feat.key} 
                className="group hover:bg-zinc-900/50 transition-colors"
              >
                <td className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 font-semibold text-zinc-200 text-lg">
                    <feat.icon className="w-5 h-5 text-cyan-500" />
                    {feat.label}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1 ml-8">
                    {feat.description}
                  </div>
                </td>
                {competitors.map((comp) => {
                  const data = comp[feat.key];
                  return (
                    <td 
                      key={`${feat.key}-${comp.name}`} 
                      className={`p-4 sm:p-6 text-center ${
                        comp.highlight 
                          ? 'bg-cyan-950/20 border-x border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]' 
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        {data.value ? (
                          <div className={`p-1.5 rounded-full ${comp.highlight ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-300'}`}>
                            <Check className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-full bg-zinc-900 text-zinc-600">
                            <X className="w-5 h-5" />
                          </div>
                        )}
                        <span className={`text-sm font-medium ${comp.highlight ? 'text-cyan-100' : 'text-zinc-400'}`}>
                          {data.label}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
