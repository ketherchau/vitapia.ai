"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const competitors = [
  {
    id: 'vitapia',
    name: 'Vitapia',
    description: 'Dynamic Enterprise & Asia-Localized',
    position: { left: '75%', top: '25%' },
    isVitapia: true,
  },
  {
    id: 'aaru',
    name: 'Aaru',
    description: 'Dynamic Enterprise & US-centric',
    position: { left: '25%', top: '25%' },
    isVitapia: false,
  },
  {
    id: 'bauhinia',
    name: 'Bauhinia AI (Aivilization)',
    description: 'Academic Sandbox & HK/Asia based',
    position: { left: '75%', top: '75%' },
    isVitapia: false,
  },
  {
    id: 'ditto',
    name: 'Ditto / Evidenza',
    description: 'Static Personas & Global/US',
    position: { left: '25%', top: '75%' },
    isVitapia: false,
  }
];

export default function CompetitorComparison() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-24 relative z-10 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
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
        className="relative w-full aspect-square md:aspect-[16/9] lg:aspect-[2/1] rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-2xl p-4 md:p-8 overflow-hidden"
      >
        {/* Grid Background Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        {/* Quadrant Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-full h-[1px] bg-zinc-700/80 absolute top-1/2 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
          <div className="h-full w-[1px] bg-zinc-700/80 absolute left-1/2 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
        </div>

        {/* Axis Labels */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-zinc-400 text-xs md:text-sm font-semibold tracking-widest uppercase bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800/50 z-10">
          Dynamic Multi-Agent / Commercial
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-500 text-xs md:text-sm font-semibold tracking-widest uppercase bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800/50 z-10">
          Static Personas / Sandbox
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs md:text-sm font-semibold tracking-widest uppercase -rotate-90 origin-center bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800/50 z-10 whitespace-nowrap">
          US / Global Focus
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs md:text-sm font-semibold tracking-widest uppercase rotate-90 origin-center bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800/50 z-10 whitespace-nowrap">
          Asia / Localized
        </div>

        {/* Quadrant Watermarks */}
        <div className="absolute top-[15%] right-[15%] text-cyan-500/10 font-black text-2xl md:text-4xl lg:text-5xl text-center pointer-events-none z-0 tracking-tighter w-1/3 leading-tight">
          THE SWEET SPOT<br/>
          <span className="text-lg md:text-2xl lg:text-3xl text-cyan-400/20 font-bold uppercase tracking-widest mt-2 block">Decision Dominance</span>
        </div>

        {/* Competitor Nodes */}
        {competitors.map((comp, idx) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
            whileInView={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 + (idx * 0.15), type: "spring", stiffness: 200, damping: 20 }}
            className="absolute z-20 flex flex-col items-center justify-center group"
            style={{ left: comp.position.left, top: comp.position.top }}
          >
            {/* The Node/Point */}
            <div className={`relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 transition-transform duration-300 group-hover:scale-110 ${
              comp.isVitapia 
                ? 'bg-cyan-950 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)]' 
                : 'bg-zinc-900 border-zinc-600 shadow-xl'
            }`}>
              {comp.isVitapia ? (
                <BrainCircuit className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
              ) : (
                <div className="w-3 h-3 md:w-4 md:h-4 bg-zinc-500 rounded-full" />
              )}
              
              {/* Pulse effect for Vitapia */}
              {comp.isVitapia && (
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping" />
              )}
            </div>

            {/* Label Card */}
            <div className={`mt-4 p-3 md:p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 w-48 md:w-64 text-center ${
              comp.isVitapia 
                ? 'bg-cyan-950/40 border-cyan-500/40 group-hover:border-cyan-400 group-hover:bg-cyan-900/40' 
                : 'bg-zinc-900/80 border-zinc-800 group-hover:border-zinc-600'
            }`}>
              <h3 className={`font-bold text-base md:text-lg mb-1 ${
                comp.isVitapia ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-zinc-200'
              }`}>
                {comp.name}
              </h3>
              <p className={`text-xs md:text-sm font-medium ${
                comp.isVitapia ? 'text-cyan-100/80' : 'text-zinc-500'
              }`}>
                {comp.description}
              </p>
            </div>
          </motion.div>
        ))}

      </motion.div>
    </div>
  );
}
