"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, Key, Database, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/user")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setOrg(data.user.organization || "");
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, organization: org })
      });
      setUser({ ...user, name, organization: org });
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleGenerateKey = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_key" })
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, api_key: data.api_key });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = () => {
    if (!user?.api_key) return;
    navigator.clipboard.writeText(String(user.api_key));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Platform Settings</h2>
        <p className="text-zinc-500">Manage your account, organization, and orchestration preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation / Tabs Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "api", label: "API Keys", icon: Key },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Alerts", icon: Bell },
            { id: "data", label: "Data Management", icon: Database }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.id ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content area */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
              <h3 className="text-lg font-bold text-white mb-6">Profile Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#00FF85] p-1">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{name.substring(0, 2).toUpperCase() || "DH"}</span>
                    </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white font-medium hover:bg-zinc-800 transition-colors">
                      Upload new avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">Email Address</label>
                    <input type="email" value={String(user?.email || "admin@vitapia.ai")} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-400 cursor-not-allowed" disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Organization / Workspace</label>
                  <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#00E5FF] transition-colors" />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "api" && (
            <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Key className="w-5 h-5 text-[#00FF85]" /> Secret API Keys</h3>
              <p className="text-sm text-zinc-400 mb-6">These keys allow you to bypass the dashboard and trigger AI simulation orchestrations programmatically via REST API.</p>
              
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4">
                <div>
                  <p className="font-bold text-white text-sm mb-2">Production API Key</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={String(user?.api_key || "vk_live_********************************")} 
                      disabled 
                      className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-zinc-500 font-mono text-sm cursor-not-allowed" 
                    />
                    <button onClick={copyToClipboard} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg text-white">
                      {copied ? <Check className="w-4 h-4 text-[#00FF85]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Developer REST API Instructions */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-4">REST API Usage Example</h4>
                <p className="text-xs text-zinc-400 mb-4">Trigger a synthetic simulation programmatically from your own backend. Set your API Key in the <code className="bg-zinc-900 px-1 py-0.5 rounded text-zinc-300">Authorization</code> header as a Bearer token.</p>
                <div className="relative bg-black rounded-xl border border-zinc-800 p-5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed shadow-inner">
                  <pre>
<span className="text-[#00E5FF]">curl</span> -X POST https://vitapia.ai/api/simulations \<br/>
&nbsp;&nbsp;-H <span className="text-[#00FF85]">&quot;Authorization: Bearer {'{'}YOUR_API_KEY{'}'}&quot;</span> \<br/>
&nbsp;&nbsp;-H <span className="text-[#00FF85]">&quot;Content-Type: application/json&quot;</span> \<br/>
&nbsp;&nbsp;-d <span className="text-[#F59E0B]">&apos;{'{'}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&quot;projectName&quot;: &quot;Programmatic Test&quot;,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&quot;scenarioPrompt&quot;: &quot;You are a consumer looking to buy an EV...&quot;,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&quot;num_agents&quot;: 100,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&quot;audienceFilters&quot;: {'{'}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;income&quot;: &quot;40k-80k&quot;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;{'}'},<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&quot;questions&quot;: [<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{'}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;q_id&quot;: &quot;q1&quot;,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;text&quot;: &quot;Would you switch to Tesla?&quot;,<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;options&quot;: [&quot;Yes&quot;, &quot;No&quot;, &quot;Maybe&quot;]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;]<br/>
&nbsp;&nbsp;{'}'}&apos;</span>
                  </pre>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <button 
                  onClick={handleGenerateKey}
                  className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/10 transition-colors text-sm"
                >
                  Roll New API Key
                </button>
                <p className="text-xs text-zinc-600 mt-2">Rolling your key will instantly invalidate your current credentials.</p>
              </div>
            </motion.div>
          )}

          {/* Persistent Orchestrator Sync Status across all tabs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-[#00E5FF]" /> Orchestrator Sync</h3>
            <p className="text-sm text-zinc-400 mb-6">Your Next.js dashboard is natively connected to the AWS microservice handling AI agent generation.</p>
            
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">Orchestrator Connection</p>
                <p className="text-xs text-zinc-500 mt-1">Status: Active • Latency: 42ms</p>
              </div>
              <div className="px-3 py-1 bg-[#00FF85]/10 text-[#00FF85] rounded-full text-xs font-bold uppercase tracking-widest border border-[#00FF85]/20">
                Connected
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
