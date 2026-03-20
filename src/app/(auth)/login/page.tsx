"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay, redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00E5FF]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-10 rounded-[2rem] border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative z-10"
      >
        <Link href="/" className="inline-flex items-center justify-center w-full mb-8">
          <div className="relative w-16 h-16 drop-shadow-[0_0_15px_rgba(0,255,133,0.3)]">
            <Image src="/logo-transparent.png" alt="Vitapia" fill className="object-contain" priority />
          </div>
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Log in to your Vitapia.ai Enterprise portal.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Enterprise Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@brand.com" 
              className="w-full px-5 py-4 rounded-xl border border-zinc-800 bg-black text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <a href="#" className="text-xs text-[#00E5FF] hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-12 pr-5 py-4 rounded-xl border border-zinc-800 bg-black text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full mt-4 flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" /> Authenticating...
              </span>
            ) : (
              <>Sign In <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-zinc-500">
          Don&apos;t have an account? <a href="/#pricing" className="text-white font-medium hover:text-[#00E5FF] transition-colors">Request a Pilot</a>
        </p>
      </motion.div>
    </main>
  );
}
