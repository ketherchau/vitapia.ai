"use client";

import { useState, useRef } from "react";
import { Analytics } from "@vercel/analytics/next"
import { motion, useScroll, useTransform, AnimatePresence, color } from "framer-motion";
import Image from "next/image";
import ParticleSwarm from "@/components/ParticleSwarm";
import ScrollShape from "@/components/ScrollShape";
import ValidationChart3D from "@/components/ValidationChart3D";
import MarketValuationChart from "@/components/MarketValuationChart";
import CompetitorComparison from "@/components/CompetitorComparison";
import { ArrowRight, BarChart3, Users, Zap, Layers, Globe, Database, BrainCircuit, Activity, HeartHandshake, Box, Info, Linkedin, Github, Cpu, LineChart, Terminal, Building2 } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const container = useRef(null);

  // High-end scrolling effects mapped to scroll progression
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // Example parallax transform: move the 3D container slightly
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeUpConfig = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-10%" },
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          setIsModalOpen(false);
          setEmail("");
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Analytics />
      <main ref={container} className="relative min-h-[1000vh]">
        {/* 3D Background with parallax */}
        <motion.div style={{ y: backgroundY }} className="fixed inset-0 z-[-1] pointer-events-none">
          <ParticleSwarm />
        </motion.div>
        <ScrollShape />

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 overflow-hidden drop-shadow-[0_0_10px_rgba(0,255,133,0.3)]">
              {/* The user-provided logo */}
              <Image src="/logo-transparent.png" alt="Vitapia.ai Logo" fill className="object-contain" priority />
            </div>
            <span className="text-2xl cursor-pointer font-bold tracking-tight text-white text-shadow-hard hidden md:block">Vitapia.ai</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-full border border-[#00E5FF]/30 bg-black/40 backdrop-blur-xl hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]/60 transition-all text-sm font-semibold shadow-[0_0_15px_rgba(0,229,255,0.15)]"
          >
            Join Pilot
          </button>
        </nav>

        <div className="relative z-10 flex flex-col">

          {/* Section 1: Hero */}
          <section className="h-screen flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF] text-sm font-semibold mb-8 backdrop-blur-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_8px_#00E5FF]" />
              Asia&apos;s First Population-Scale AI Prediction Platform
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter max-w-5xl leading-[0.9]"
            >
              Synthetic <br /> <span className="text-gradient">Societies.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-8 text-xl md:text-3xl text-zinc-300 max-w-3xl text-shadow-hard font-light"
            >
              Replace slow surveys with high-fidelity digital twins of Cities.
              Simulate human decisions at scale - faster, smarter, less biased.
            </motion.p>
          </section>

          {/* Section 2: The Problem */}
          <section className="min-h-screen flex items-center px-6 md:px-24 py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
            <motion.div {...fadeUpConfig} className="max-w-3xl relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold mb-12 text-shadow-hard leading-tight">
                Market Research is <span className="text-red-400">Broken.</span>
              </h2>
              <motion.ul variants={staggerContainer} initial="initial" whileInView="whileInView" className="space-y-8 text-xl md:text-2xl text-zinc-300 text-shadow-hard">
                <motion.li variants={staggerItem} className="flex items-start gap-6 group">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 group-hover:border-red-500/50 transition-colors mt-1 backdrop-blur-md">
                    <BarChart3 className="w-8 h-8 text-red-400" />
                  </div>
                  <p><strong className="text-white block mb-1">Too Slow:</strong> Traditional surveys and focus groups take weeks to months to execute.</p>
                </motion.li>
                <motion.li variants={staggerItem} className="flex items-start gap-6 group">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 group-hover:border-orange-500/50 transition-colors mt-1 backdrop-blur-md">
                    <Users className="w-8 h-8 text-orange-400" />
                  </div>
                  <p><strong className="text-white block mb-1">Inherently Biased:</strong> Self-reported data is flawed. Niche segments are impossible to reach.</p>
                </motion.li>
                <motion.li variants={staggerItem} className="flex items-start gap-6 group">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 group-hover:border-yellow-500/50 transition-colors mt-1 backdrop-blur-md">
                    <Globe className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p><strong className="text-white block mb-1">The Impact:</strong> Brands miss rapid trends, leading to multi-million-dollar strategic failures in Asia&apos;s fast markets.</p>
                </motion.li>
              </motion.ul>
            </motion.div>
          </section>

          {/* Section 3: The Solution (Sticky Scroll equivalent) */}
          <section className="min-h-[150vh] relative px-6 md:px-24">
            <div className="sticky top-0 h-screen flex items-center justify-end">
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
              <motion.div {...fadeUpConfig} className="max-w-2xl text-right relative z-10">
                <h2 className="text-5xl md:text-7xl font-bold mb-12 text-shadow-hard leading-tight">
                  The Digital Twin of <br/><span className="text-gradient">Hong Kong.</span>
                </h2>
                <div className="space-y-6 text-xl text-zinc-300 text-left text-shadow-hard">
                  <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl hover:border-[#00E5FF]/40 transition-colors">
                    <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-4">
                      <Layers className="w-8 h-8 text-[#00E5FF]" /> Dynamic Synthetic Populations
                    </h3>
                    <p>We generate thousands of AI agents mathematically mirroring real census demographics (Age, Income, Housing, Occupation).</p>
                  </div>
                  <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl hover:border-[#00FF85]/40 transition-colors">
                    <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-4">
                      <Zap className="w-8 h-8 text-[#00FF85]" /> Autonomous Interaction
                    </h3>
                    <p>LLM-powered agents simulate real-world decisions (pricing, products, polling) using deep chain-of-thought economic reasoning.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Section 4: How It Works Engine */}
          <section className="min-h-screen flex flex-col items-center justify-center px-6 py-32 bg-black/60 backdrop-blur-lg border-y border-zinc-900">
            <motion.div {...fadeUpConfig} className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-shadow-hard mb-6">From Public Data to <span className="text-gradient">Predictive Power.</span></h2>
              <p className="text-2xl text-zinc-400 text-shadow-hard max-w-3xl mx-auto">Our four-step pipeline ingests raw reality and outputs actionable foresight.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                { icon: Database, title: "1. Ingest", desc: "Parse raw HK C&SD Census data (Age, Income, Housing, District)." },
                { icon: Box, title: "2. Spawn", desc: "Generate thousands of persistent, localized AI personas via async orchestrator." },
                { icon: BrainCircuit, title: "3. Simulate", desc: "Agents use Chain-of-Thought budgeting to react to your brand's scenarios." },
                { icon: Activity, title: "4. Analyze", desc: "Output statistically validated predictions on population market behavior." }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex flex-col items-center text-center hover:bg-zinc-800/80 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.1)]">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section 4.2: Competitor Comparison */}
          <section className="min-h-screen flex items-center px-6 md:px-24 py-24 relative overflow-hidden bg-gradient-to-b from-black to-zinc-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05),transparent_70%)] pointer-events-none" />
            <motion.div {...fadeUpConfig} className="max-w-7xl mx-auto relative z-10 w-full">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-hard leading-tight">
                  The New Standard in <span className="text-gradient">Prediction.</span>
                </h2>
                <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light">
                  How Vitapia compares against legacy methods and generic API wrappers.
                </p>
              </div>
              <CompetitorComparison />
            </motion.div>
          </section>

          {/* Section 4.5: Technical Architecture / White Paper */}
          <section className="py-32 px-6 bg-zinc-950 border-y border-zinc-900 relative overflow-hidden">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div {...fadeUpConfig} className="mb-20 text-center md:text-left flex flex-col md:flex-row gap-8 items-end justify-between">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold text-shadow-hard mb-6">Technical <span className="text-gradient">Architecture.</span></h2>
                  <p className="text-xl text-zinc-400 font-light max-w-2xl">
                    A transparent look into the Vitapia engine. How we bridge raw demographic data with high-concurrency LLM cognition.
                  </p>
                </div>
                <a href="/Vitapia_Whitepaper.pdf" download="Vitapia_Whitepaper.pdf" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors text-sm font-mono text-zinc-300 z-50 relative cursor-pointer hover:border-[#00E5FF]/50 hover:text-[#00E5FF]">
                  <Terminal className="w-4 h-4" /> View Whitepaper.pdf
                </a>
              </motion.div>

              <div className="space-y-6">
                {/* Layer 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-8 p-8 md:p-10 rounded-3xl border border-zinc-800 bg-black/50 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-zinc-800 group-hover:bg-[#00E5FF] transition-colors shadow-[0_0_15px_#00E5FF]" />
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-[#00E5FF] transition-colors">
                    <Database className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest">Layer 01 // The Social Matrix</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Temporal Knowledge Graphs (GraphDB)</h3>
                    <p className="text-zinc-400 leading-relaxed font-light mb-4">
                      Competitors simulate agents in vacuums. Vitapia agents live in a massively interconnected <strong className="text-white font-medium">Temporal Knowledge Graph</strong> (powered by Neo4j). Every agent is a node with weighted edges connecting them to synthetic family members, coworkers, and friends.
                    </p>
                    <p className="text-zinc-400 leading-relaxed font-light">
                      This allows us to simulate <strong className="text-[#00E5FF] font-medium">Network Contagion</strong>. If an agent &apos;buys&apos; a product, that state change ripples through their local graph network, dynamically altering the purchasing probabilities of their synthetic peers to mathematically model viral marketing and social proof.
                    </p>
                  </div>
                </motion.div>

                {/* Layer 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col md:flex-row gap-8 p-8 md:p-10 rounded-3xl border border-zinc-800 bg-black/50 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-zinc-800 group-hover:bg-[#00FF85] transition-colors shadow-[0_0_15px_#00FF85]" />
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-[#00FF85] transition-colors">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-[#00FF85] uppercase tracking-widest">Layer 02 // Cognitive Core</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Neuro-Symbolic Agent Architecture</h3>
                    <p className="text-zinc-400 leading-relaxed font-light mb-4">
                      Relying purely on LLMs for financial predictions introduces massive hallucination risks. Vitapia bridges deep learning with hard algorithmic logic via a <strong className="text-white font-medium">Neuro-Symbolic Engine</strong>.
                    </p>
                    <p className="text-zinc-400 leading-relaxed font-light">
                      The &quot;Symbolic&quot; layer is a deterministic physics engine that strictly calculates an agent&apos;s taxes, rent, MTR fares, and inflation impact down to the exact cent based on HK C&amp;SD economic formulas. The &quot;Neuro&quot; layer (the LLM) is then <em>only</em> permitted to calculate the emotional and psychographic variance on the remaining disposable income. 
                    </p>
                  </div>
                </motion.div>

                {/* Layer 3 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col md:flex-row gap-8 p-8 md:p-10 rounded-3xl border border-zinc-800 bg-black/50 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-zinc-800 group-hover:bg-[#00E5FF] transition-colors shadow-[0_0_15px_#00E5FF]" />
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-[#00E5FF] transition-colors">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest">Layer 03 // Proprietary Moat</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Continuous SLM Fine-Tuning (DPO)</h3>
                    <p className="text-zinc-400 leading-relaxed font-light mb-4">
                      API wrappers around OpenAI or Google are easily cloned. Vitapia&apos;s ultimate moat is our proprietary foundation model.
                    </p>
                    <p className="text-zinc-400 leading-relaxed font-light">
                      Using our Empirical Validation Engine, every time an agent deviates from real-world ground truth (e.g., Nielsen retail data), the Mean Absolute Error (MAE) is fed backwards into a <strong className="text-white font-medium">Direct Preference Optimization (DPO)</strong> pipeline. We continuously fine-tune our own localized Small Language Models (SLMs). Over time, the Vitapia &quot;HK-Brain&quot; becomes an impenetrable, highly specialized economic model that generic commercial APIs cannot match.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Section 5: Validation / Accuracy */}
          <section className="min-h-[150vh] flex flex-col items-center justify-center px-6 py-32 text-center relative overflow-hidden">
            <motion.div {...fadeUpConfig} className="max-w-[90vw] mx-auto z-10 w-full">
              <h2 className="text-5xl md:text-7xl font-bold mb-8 text-shadow-hard">Proven <span className="text-gradient">Accuracy.</span></h2>
              <p className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto mb-10 text-shadow-hard font-light">
                We simulated 100 synthetic HK residents against the real 2019/20 HK Household Expenditure Survey.
                Without manual prompting, our AI agents mathematically matched real Hong Kong human spending behavior.
              </p>

              {/* Interactive 3D Chart Canvas - Scaled up container to fit all questions */}
              <div className="w-full h-[600px] relative bg-black/40 border border-zinc-800 rounded-[2rem] backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-12 ring-1 ring-white/5 overflow-hidden">
                <ValidationChart3D />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-12 rounded-[2rem] border border-[#00E5FF]/30 bg-gradient-to-b from-[#00E5FF]/10 to-transparent backdrop-blur-md shadow-[0_0_30px_rgba(0,229,255,0.1)] relative group"
                >
                  <div className="text-7xl font-black text-[#00E5FF] mb-4 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">97.2%</div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl font-bold text-white">Statistical Accuracy</div>
                    <div className="relative flex items-center justify-center">
                      <Info className="w-6 h-6 text-zinc-500 hover:text-white cursor-help transition-colors" />
                      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-4 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <p className="text-sm text-zinc-300 font-normal leading-relaxed">
                          Calculated using <strong className="text-white">Mean Absolute Error (MAE)</strong> across 4 real-world data points vs 100 synthetic agents. <br/><br/>
                          <span className="text-[#00E5FF]">Formula:</span><br/> 100% - (MAE = 0.028) = 97.2%
                        </p>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-b border-r border-zinc-700 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xl text-zinc-300 text-shadow-hard">In Food Expenditure Share prediction vs. Real HK Ground Truth.</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-12 rounded-[2rem] border border-[#00FF85]/30 bg-gradient-to-b from-[#00FF85]/10 to-transparent backdrop-blur-md shadow-[0_0_30px_rgba(0,255,133,0.1)] relative group"
                >
                  <div className="text-7xl font-black text-[#00FF85] mb-4 drop-shadow-[0_0_15px_rgba(0,255,133,0.5)]">89.1%</div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl font-bold text-white">Discretionary Accuracy</div>
                    <div className="relative flex items-center justify-center">
                      <Info className="w-6 h-6 text-zinc-500 hover:text-white cursor-help transition-colors" />
                      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-4 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <p className="text-sm text-zinc-300 font-normal leading-relaxed">
                          Evaluated across 4 non-food spending categories (Transport, Services, Goods, Clothing) using <strong className="text-white">MAE</strong>.<br/><br/>
                          <span className="text-[#00FF85]">Formula:</span><br/> 100% - (MAE = 0.108) = 89.1%
                        </p>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-b border-r border-zinc-700 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xl text-zinc-300 text-shadow-hard">Successfully predicting the dominance of miscellaneous services in HK budgets.</p>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Section 6: Innovation & Deep Roleplay */}
          <section className="min-h-screen flex items-center px-6 md:px-24 py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-transparent pointer-events-none" />
            <motion.div {...fadeUpConfig} className="max-w-3xl relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold mb-12 text-shadow-hard leading-tight">
                Deep Demographic <br/><span className="text-gradient">Roleplay.</span>
              </h2>
              <div className="space-y-8 text-xl md:text-2xl text-zinc-300 text-shadow-hard font-light">
                <p>
                  <strong className="text-[#00E5FF] font-bold">Beyond Basic RAG:</strong> Injecting raw data makes AI robotic. We give agents <em>Household Size</em> and <em>Occupation</em> to trigger latent socio-economic reasoning.
                </p>
                <p>
                  <strong className="text-[#00FF85] font-bold">Asia-First Focus:</strong> Tuned specifically for Greater Bay Area cultural and linguistic nuances (Cantonese/English mix).
                </p>
                <p>
                  <strong className="text-white font-bold">Competitive Edge:</strong> No direct commercial rivals in Asia; academic models lack enterprise speed.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Section 7: Market Opportunity */}
          <section className="py-24 px-6 bg-black/60 backdrop-blur-lg border-y border-zinc-900 text-center">
            <motion.div {...fadeUpConfig} className="max-w-5xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-shadow-hard mb-16">A <span className="text-[#00E5FF]">US$20B+</span> Market Ready for Disruption.</h2>
              <MarketValuationChart />
            </motion.div>
          </section>

          {/* Section 8: Business Model */}
        <section className="min-h-screen flex items-center justify-center px-6 py-24 relative text-center">
          <motion.div {...fadeUpConfig} className="max-w-5xl w-full">
            <h2 className="text-5xl md:text-7xl font-bold mb-20 text-shadow-hard">B2B SaaS for <br/><span className="text-gradient">Decision Dominance.</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
              <div className="p-12 rounded-[2rem] border border-zinc-700 bg-zinc-900/80 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00E5FF] group-hover:h-2 transition-all" />
                <h3 className="text-3xl font-bold text-white mb-6">Tier 1: Pulse Check</h3>
                <p className="text-xl text-zinc-400 mb-8">Pay-per-simulation.</p>
                <ul className="space-y-4 text-lg text-zinc-300">
                  <li className="flex items-center gap-3"><span className="text-[#00E5FF]">✔</span> Test a product launch</li>
                  <li className="flex items-center gap-3"><span className="text-[#00E5FF]">✔</span> Against 1,000 synthetic agents</li>
                  <li className="flex items-center gap-3"><span className="text-[#00E5FF]">✔</span> 24-hour turnaround</li>
                </ul>
              </div>

              <div className="p-12 rounded-[2rem] border border-[#00FF85]/30 bg-zinc-900/80 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_30px_rgba(0,255,133,0.1)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF85] group-hover:h-2 transition-all" />
                <h3 className="text-3xl font-bold text-white mb-6">Tier 2: Enterprise Custom</h3>
                <p className="text-xl text-zinc-400 mb-8">Monthly SaaS Subscription.</p>
                <ul className="space-y-4 text-lg text-zinc-300">
                  <li className="flex items-center gap-3"><span className="text-[#00FF85]">✔</span> Upload your own CRM data</li>
                  <li className="flex items-center gap-3"><span className="text-[#00FF85]">✔</span> Spawn custom localized populations</li>
                  <li className="flex items-center gap-3"><span className="text-[#00FF85]">✔</span> Unlimited scenario testing API</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 8.2: Optimisation & Forecast */}
        <section className="min-h-[120vh] flex flex-col items-center justify-center px-6 py-32 bg-black/60 backdrop-blur-md border-y border-zinc-900 relative overflow-hidden text-center z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#00E5FF]/10 to-[#00FF85]/10 blur-[150px] rounded-full pointer-events-none z-0" />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto">
            <motion.div {...fadeUpConfig} className="mb-24">
              <h2 className="text-5xl md:text-7xl font-bold text-shadow-hard mb-8">
                Infinite Scale. <br className="md:hidden" />
                <span className="text-gradient">Limitless Forecasting.</span>
              </h2>
              <p className="text-xl md:text-2xl text-zinc-300 text-shadow-hard max-w-4xl mx-auto font-light leading-relaxed">
                We are architecting the future of urban simulation. Moving beyond basic consumer survey analytics into massive, multi-variable macro-level city modeling.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6 p-10 rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl group hover:border-[#00E5FF]/50 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.15)] group-hover:scale-110 transition-transform duration-500">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white">AWS Cloud Optimisation</h3>
                <p className="text-lg text-zinc-400 leading-relaxed font-light">
                  Our simulation core is designed to transition seamlessly to <strong className="text-white font-medium">AWS AI Cloud Services</strong> (SageMaker, Bedrock, & EKS). By leveraging elastic, auto-scaling compute clusters, we will horizontally scale our asynchronous orchestrator to simulate <strong className="text-[#00E5FF] font-medium">hundreds of thousands</strong> of concurrent AI agents, effectively mirroring entire city demographics in real-time without computational bottlenecking.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col gap-6 p-10 rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl group hover:border-[#00FF85]/50 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#00FF85] shadow-[0_0_20px_rgba(0,255,133,0.15)] group-hover:scale-110 transition-transform duration-500">
                  <LineChart className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white">Macro Forecasting</h3>
                <p className="text-lg text-zinc-400 leading-relaxed font-light">
                  Survey prediction is just our baseline. By equipping our synthetic populations with physics engines and historical macroeconomic data logic, Vitapia is expanding vertically. We will offer <strong className="text-white font-medium">City Development Analysis</strong> (predicting traffic and commercial shifts due to new MTR lines) and <strong className="text-[#00FF85] font-medium">Economic Forecasting</strong> (modeling district-level retail inflation resilience).
                </p>
              </motion.div>
            </div>
          </div>
        </section>

          {/* Section 8.5: Team */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-black/40 border-y border-zinc-900 backdrop-blur-xl relative z-10">
          <motion.div {...fadeUpConfig} className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-hard">Built for <span className="text-[#00E5FF] text-gradient">Execution.</span></h2>
            <p className="text-xl text-zinc-400 text-shadow-hard">A multi-disciplinary team combining frontier AI architecture, behavioral science, and empirical data validation.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "KETHER CHAU",
                role: "CEO & Technical Co-Founder",
                bio: "Visionary behind the Vitapia prediction engine. Bringing a rigorous background from HSBC and Crypto.com, Kether possesses deep expertise with more than 10 years of experience in high-concurrency systems. <br/><br/> His experience in highly regulated financial sectors ensures that Vitapia.ai is built with the security, auditability, and data integrity required by enterprise clients.",
                image: "/kether_profile.png",
                color: "from-[#00E5FF]/20",
                pastExperience: "Entrepreneur, Ex-HSBC, Ex-Crypto.com",
              },
              {
                name: "RAIN NG",
                role: "CMO & Co-Founder",
                bio: "Venture builder with proven experience launching startups and scaling enterprise growth. Over 15 years of experience in the marketing industry, holding leadership roles within top-tier agencies. <br/><br/> She has managed monthly ad budgets exceeding $120,000 on Meta and YouTube and has collaborated with global brands including L’Oréal Paris, Sony, PlayStation, 3M, and LG.",
                image: "/rain_profile.png",
                color: "from-[#00FF85]/20",
                pastExperience: "Entrepreneur, Ex-Perfect Medical",
              },
              {
                name: "JOSEPH CHENG",
                role: "CTO & AI Co-Founder",
                bio: "Seasoned Software Engineer, ML / NLP enthusiast. Expert in demographic grounding and mathematical validation. <br/><br/> A seasoned Software Engineer and ML enthusiast with more than 16 years of experience in the tech industry, with a background at Gogovan (GogoX). <br/><br/> Joseph brings the 'Unicorn-scale' engineering mindset required to handle millions of simultaneous AI agents.",
                image: "/joseph_profile.png",
                color: "from-[#00E5FF]/20",
                pastExperience: "Entrepreneur, Ex-GogoX"
              }
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                className="group flex flex-col items-center text-center p-8 rounded-3xl border border-zinc-800 bg-gradient-to-b to-zinc-900/50 backdrop-blur-md transition-all hover:border-zinc-600"
                style={{ backgroundImage: `linear-gradient(to bottom, transparent, rgba(10,10,10,0.8)), linear-gradient(to bottom, var(--tw-gradient-from), transparent)` }}
              >
                <div className={`w-40 h-40 rounded-full mb-6 p-1 bg-gradient-to-tr ${member.color} to-transparent relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                  <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-zinc-900 bg-zinc-800">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-[#00E5FF] font-medium text-sm mb-2 tracking-wider uppercase">{member.role}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-semibold text-zinc-300 bg-zinc-800 rounded-full border border-zinc-700 flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-[#00E5FF]" /> {member.pastExperience}
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-6 flex-grow" dangerouslySetInnerHTML={{ __html: member.bio }}></p>
                <div className="flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-[#00E5FF]/20 hover:text-[#00E5FF] transition-colors"><Linkedin className="w-5 h-5" /></a>
                  <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-[#00FF85]/20 hover:text-[#00FF85] transition-colors"><Github className="w-5 h-5" /></a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 8.7: Roadmap & Milestones */}
        {/* TODO: Add team section back later */}
        <section className="min-h-screen py-32 px-6 bg-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FF85]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div {...fadeUpConfig} className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-hard">The Path to <span className="text-gradient">Scale.</span></h2>
              <p className="text-xl md:text-2xl text-zinc-400 text-shadow-hard max-w-3xl mx-auto font-light">
                Our accelerated 6-month roadmap designed for the AWS x HKSTP startups idea launcher. From MVP to Enterprise Validation.
              </p>
            </motion.div>

            <div className="relative border-l border-zinc-800 ml-4 md:ml-12 pl-8 md:pl-16 space-y-16">
              {[
                {
                  phase: "Phase 1: Foundation",
                  time: "Months 1-2",
                  title: "Commercial Beta Launch + Validation & Calibration",
                  desc: "Official Public Beta Release: Open the self-service dashboard to the first cohort of 20 whitelisted users. Integrate Stripe API for live credit purchasing. Deploy the 'HK-Brain' SLM (Small Language Model) on AWS production environment. Onboard two local Hong Kong FMCG (Fast-Moving Consumer Goods) brands. Ingest their historical CRM data to spawn highly customized, hyper-local consumer segments. Run blind predictive scenarios against their upcoming product launches.",
                  icon: Database,
                  color: "text-[#00E5FF]",
                  bg: "bg-[#00E5FF]/10",
                  border: "border-[#00E5FF]/30"
                },
                {
                  phase: "Phase 2: Validation",
                  time: "Months 3-4",
                  title: "Enterprise API Deployment + Social Social Logic Expansion",
                  desc: "Product Launch Fulfillment: Officially release the Programmatic REST API for bulk enterprise usage. Documentation finalized for external developers. Onboard the first Tier-1 Marketing Agency as a pilot partner for a live campaign simulation. Temporal Knowledge Graph Integration: Activate the Neo4j-powered 'Network Contagion' feature, allowing clients to simulate word-of-mouth and social proof ripples across 500,000+ synthetic nodes.",
                  icon: BrainCircuit,
                  color: "text-[#00FF85]",
                  bg: "bg-[#00FF85]/10",
                  border: "border-[#00FF85]/30"
                },
                {
                  phase: "Phase 3: Expansion",
                  time: "Month 5",
                  title: "GBA Market Expansion",
                  desc: "Cross-Border Scaling: Ingest demographic datasets for Shenzhen and Guangzhou. Successfully run the first cross-city 'Greater Bay Area Consumer Sentiment' report for a multi-national FMCG client.",
                  icon: LineChart,
                  color: "text-[#00E5FF]",
                  bg: "bg-[#00E5FF]/10",
                  border: "border-[#00E5FF]/30"
                },
                {
                  phase: "Phase 4: Domination",
                  time: "Month 6",
                  title: "Product Maturity & Growth",
                  desc: "Full Commercial Release: Transition from Beta to v1.0. Achieve a milestone of 10+ paying corporate entities. Complete a 'Social Impact Report' demonstrating how our synthetic data protects PDPO privacy while providing actionable urban insights.",
                  icon: ArrowRight,
                  color: "text-[#00FF85]",
                  bg: "bg-[#00FF85]/10",
                  border: "border-[#00FF85]/30"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className={`absolute -left-[41px] md:-left-[73px] top-0 w-5 h-5 rounded-full border-4 border-black ${item.bg.replace('/10', '')} shadow-[0_0_10px_currentColor] ${item.color.replace('text-', '')}`} />
                  
                  <div className={`p-8 rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl group hover:${item.border} transition-all duration-300`}>
                    <div className="flex items-start gap-6">
                      <div className={`hidden md:flex w-16 h-16 rounded-2xl ${item.bg} items-center justify-center ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-sm font-bold uppercase tracking-widest ${item.color}`}>{item.phase}</span>
                          <span className="text-zinc-600 font-medium text-sm">• {item.time}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                        <p className="text-zinc-400 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* */}

        {/* Section 9: Social Responsibility */}
          <section className="py-32 px-6 bg-gradient-to-t from-black to-transparent text-center relative z-10">
            <motion.div {...fadeUpConfig} className="max-w-4xl mx-auto">
              <HeartHandshake className="w-16 h-16 text-[#00E5FF] mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-shadow-hard">Ethical AI for Hong Kong&apos;s Future</h2>
              <p className="text-xl md:text-2xl text-zinc-400 text-shadow-hard mb-8 font-light">
                <strong className="text-white">PDPO Compliant:</strong> Synthetic data means zero personal data privacy risks.<br/><br/>
                <strong className="text-white">Bias Mitigation:</strong> Mathematical validation ensures diverse, representative populations.<br/><br/>
                <strong className="text-white">Ecosystem Contribution:</strong> Supports HK&apos;s &quot;AI for All&quot; strategy by creating local jobs in agentic AI.
              </p>
            </motion.div>
          </section>

          {/* Section 10: CTA */}
          <section className="h-screen flex flex-col items-center justify-center px-4 text-center bg-zinc-950/90 border-t border-zinc-900 backdrop-blur-2xl relative z-10">
            <motion.div {...fadeUpConfig}>
              <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">Ready for <br/><span className="text-gradient">Decision Dominance?</span></h2>
              <p className="text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">Join the pilot program and build Asia&apos;s future of prediction together.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-4 px-10 py-5 mx-auto rounded-full bg-white text-black text-xl font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all"
              >
                Launch Pilot Simulation
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </section>

        </div>

        {/* Email Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-8 rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl relative"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
                <h3 className="text-3xl font-bold text-white mb-2">Request Access</h3>
                <p className="text-zinc-400 mb-8">Enter your enterprise email to join the Vitapia.ai pilot waitlist.</p>

                <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting || submitStatus === "success"}
                    placeholder="name@company.com"
                    className="w-full px-5 py-4 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === "success" || !email}
                    className={`w-full px-5 py-4 rounded-xl font-bold text-lg transition-all ${
                      submitStatus === "success"
                        ? "bg-green-500 text-white"
                        : submitStatus === "error"
                        ? "bg-red-500 text-white"
                        : "bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black hover:opacity-90"
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? "Sending Request..." : submitStatus === "success" ? "Request Sent! ✔" : submitStatus === "error" ? "Error. Try again." : "Join Waitlist"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
