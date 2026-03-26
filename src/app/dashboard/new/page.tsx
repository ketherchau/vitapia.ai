"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Zap, Plus, Trash2, ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useNotification } from "@/components/providers/NotificationProvider";

export default function NewSimulation() {
  const { showNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [scenarioPrompt, setScenarioPrompt] = useState("");
  const [targetAge, setTargetAge] = useState("All");
  const [targetGender, setTargetGender] = useState("All");
  const [targetDistrict, setTargetDistrict] = useState("All");
  const [targetIncome, setTargetIncome] = useState("All");
  const [targetHousing, setTargetHousing] = useState("All");
  const [agentCount, setAgentCount] = useState(1000);
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: ["", ""] }
  ]);

  const addOption = (qId: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options.length < 5) {
        return { ...q, options: [...q.options, ""] };
      }
      return q;
    }));
  };

  const removeOption = (qId: number, idx: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options.length > 2) {
        const newOpts = [...q.options];
        newOpts.splice(idx, 1);
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const addQuestion = () => {
    if (questions.length < 3) {
      setQuestions([...questions, { id: Date.now(), text: "", options: ["", ""] }]);
    }
  };

  const updateQuestionText = (qId: number, text: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, text } : q));
  };

  const updateOptionText = (qId: number, idx: number, optText: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.options];
        newOpts[idx] = optText;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const handleLaunch = async () => {
    if (!projectName || !scenarioPrompt || questions.some(q => !q.text || q.options.some(opt => !opt))) {
      showNotification("Missing Fields", "Please fill out all fields before launching.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          scenarioPrompt,
          num_agents: agentCount,
          audienceFilters: {
            age: targetAge !== "All" ? targetAge : null,
            gender: targetGender !== "All" ? targetGender : null,
            district: targetDistrict !== "All" ? targetDistrict : null,
            income: targetIncome !== "All" ? targetIncome : null,
            housing: targetHousing !== "All" ? targetHousing : null,
          },
          questions: questions.map(q => ({
            q_id: `Q${q.id}`,
            text: q.text,
            options: q.options
          }))
        })
      });

      if (res.ok) {
        showNotification("Success", `Pulse Check Simulation Launched! The orchestrator is spinning up ${agentCount.toLocaleString()} agents.`, "success");
        window.location.href = "/dashboard";
      } else {
        showNotification("Error", "Failed to launch simulation.", "error");
      }
    } catch {
      showNotification("Error", "Network error.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-400" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-white">New Pulse Check</h2>
          <p className="text-zinc-500">Configure your predictive scenario.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -translate-y-1/2 z-0 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-[#00E5FF] -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
          style={{ width: step === 1 ? '50%' : '100%' }} 
        />
        
        <div className={`relative z-10 flex flex-col items-center gap-3 transition-colors ${step >= 1 ? 'text-[#00E5FF]' : 'text-zinc-500'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 1 ? 'bg-zinc-950 border-[#00E5FF]' : 'bg-zinc-900 border-zinc-800'}`}>1</div>
          <span className="text-sm font-bold uppercase tracking-wider">Scenario Context</span>
        </div>
        
        <div className={`relative z-10 flex flex-col items-center gap-3 transition-colors ${step >= 2 ? 'text-[#00FF85]' : 'text-zinc-500'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step >= 2 ? 'bg-zinc-950 border-[#00FF85]' : 'bg-zinc-900 border-zinc-800'}`}>2</div>
          <span className="text-sm font-bold uppercase tracking-wider">Survey Questions</span>
        </div>
      </div>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-8 md:p-10 rounded-[2rem] border border-zinc-800 bg-zinc-950/80 shadow-2xl space-y-8"
          >
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Project Name</label>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Q3 Sugar-Free Oat Milk Launch (TST)" 
                className="w-full px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#00E5FF] focus:outline-none text-white text-lg placeholder:text-zinc-600" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Target Audience Focus Group</label>
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-4">
                  <div className="w-12 h-12 rounded-full bg-[#00FF85]/20 flex items-center justify-center text-[#00FF85] shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Hong Kong Census Demographics</h4>
                    <p className="text-sm text-zinc-400">Filter your {agentCount.toLocaleString()} synthetic agents. Selecting &quot;All&quot; mirrors the baseline population naturally.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#00E5FF] uppercase">Synthetic Agents</label>
                    <select 
                      value={agentCount} 
                      onChange={(e) => setAgentCount(Number(e.target.value))} 
                      className="w-full bg-[#00E5FF]/10 border border-[#00E5FF]/50 rounded-xl px-4 py-3 text-[#00E5FF] font-bold focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value={100} className="bg-zinc-900">100 Agents</option>
                      <option value={500} className="bg-zinc-900">500 Agents</option>
                      <option value={1000} className="bg-zinc-900">1,000 Agents</option>
                      <option value={5000} className="bg-zinc-900">5,000 Agents</option>
                      <option value={10000} className="bg-zinc-900">10,000 Agents</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Age Bracket</label>
                    <select 
                      value={targetAge} 
                      onChange={(e) => setTargetAge(e.target.value)} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF85] appearance-none cursor-pointer"
                    >
                      <option value="All">All Ages</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                      <option value="45-54">45-54</option>
                      <option value="55-64">55-64</option>
                      <option value="65+">65+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Gender</label>
                    <select 
                      value={targetGender} 
                      onChange={(e) => setTargetGender(e.target.value)} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF85] appearance-none cursor-pointer"
                    >
                      <option value="All">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">District</label>
                    <select 
                      value={targetDistrict} 
                      onChange={(e) => setTargetDistrict(e.target.value)} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF85] appearance-none cursor-pointer"
                    >
                      <option value="All">All Districts</option>
                      <option value="Hong Kong Island">Hong Kong Island</option>
                      <option value="Kowloon">Kowloon</option>
                      <option value="New Territories">New Territories</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Household Income (HKD)</label>
                    <select 
                      value={targetIncome} 
                      onChange={(e) => setTargetIncome(e.target.value)} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF85] appearance-none cursor-pointer"
                    >
                      <option value="All">All Income Brackets</option>
                      <option value="<10k">Under $10,000</option>
                      <option value="10k-20k">$10,000 - $20,000</option>
                      <option value="20k-40k">$20,000 - $40,000</option>
                      <option value="40k-80k">$40,000 - $80,000</option>
                      <option value=">80k">Over $80,000</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Housing Type</label>
                    <select 
                      value={targetHousing} 
                      onChange={(e) => setTargetHousing(e.target.value)} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF85] appearance-none cursor-pointer"
                    >
                      <option value="All">All Housing</option>
                      <option value="Private Permanent">Private Permanent</option>
                      <option value="Public Rental">Public Rental</option>
                      <option value="Subsidized Sale">Subsidized Sale (HOS)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-widest text-zinc-400">Background Scenario Prompt</label>
              <p className="text-sm text-zinc-500">Describe the product, price, and context. The agents will read this before answering your questions.</p>
              <textarea 
                rows={5} 
                value={scenarioPrompt}
                onChange={(e) => setScenarioPrompt(e.target.value)}
                placeholder="We are launching a new sugar-free oat milk beverage priced at HK$32 in Tsim Sha Tsui. The main competitor is currently priced at HK$25 but contains high sugar..."
                className="w-full px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#00E5FF] focus:outline-none text-white text-base placeholder:text-zinc-600 resize-none"
              />
            </div>

            <div className="pt-6 border-t border-zinc-900 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                className="px-8 py-4 rounded-xl bg-[#00E5FF] text-black font-bold text-lg hover:bg-cyan-300 transition-colors flex items-center gap-3"
              >
                Configure Questions <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {questions.map((q, qIndex) => (
              <div key={q.id} className="p-8 md:p-10 rounded-[2rem] border border-zinc-800 bg-zinc-950/80 shadow-xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-zinc-800 group-hover:bg-[#00FF85] transition-colors" />
                
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm">{qIndex + 1}</span>
                    Survey Question
                  </h3>
                </div>

                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={q.text}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    placeholder="e.g., Would you buy this product weekly at HK$32?" 
                    className="w-full px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#00FF85] focus:outline-none text-white text-lg placeholder:text-zinc-600" 
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-zinc-500">Multiple Choice Options (2-5)</label>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-500 shrink-0">
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <input 
                        type="text" 
                        value={opt}
                        onChange={(e) => updateOptionText(q.id, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 px-5 py-3 rounded-xl bg-black border border-zinc-800 focus:border-[#00FF85] focus:outline-none text-white placeholder:text-zinc-700" 
                      />
                      {q.options.length > 2 && (
                        <button onClick={() => removeOption(q.id, oIndex)} className="w-12 h-12 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {q.options.length < 5 && (
                    <button onClick={() => addOption(q.id)} className="text-sm font-bold text-[#00FF85] hover:underline flex items-center gap-2 mt-4 ml-1">
                      <Plus className="w-4 h-4" /> Add Option
                    </button>
                  )}
                </div>
              </div>
            ))}

            {questions.length < 3 && (
              <button onClick={addQuestion} className="w-full py-6 rounded-[2rem] border-2 border-dashed border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white transition-all flex items-center justify-center gap-3 font-bold text-lg">
                <PlusCircle className="w-6 h-6" /> Add Another Question (Max 3)
              </button>
            )}

            <div className="pt-8 flex justify-between items-center">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-bold"
              >
                Back
              </button>
              
              <button 
                onClick={handleLaunch}
                disabled={isLoading}
                className="px-10 py-5 rounded-xl bg-gradient-to-r from-[#00FF85] to-[#00E5FF] text-black font-black text-xl hover:scale-105 transition-transform flex items-center gap-3 disabled:opacity-50 shadow-[0_0_30px_rgba(0,255,133,0.3)]"
              >
                {isLoading ? "Provisioning Agents..." : <>Launch Simulation <Zap className="w-6 h-6 fill-black" /></>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
