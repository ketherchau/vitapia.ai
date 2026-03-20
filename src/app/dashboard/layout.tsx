"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, Users, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/new", label: "New Pulse Check", icon: PlusCircle, highlight: true },
  { href: "/dashboard/results", label: "Past Reports", icon: FileText },
  { href: "/dashboard/audience", label: "Synthetic Audiences", icon: Users },
  { href: "/dashboard/data", label: "Data Connections", icon: Database },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number>(1250);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCredits(data.user.credits);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-zinc-900/50 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
              <Image src="/logo-transparent.png" alt="Vitapia" fill className="object-contain" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-white">Vitapia<span className="text-[#00E5FF]">.ai</span></span>
          </Link>
        </div>

        <div data-lenis-prevent="true" className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          <div className="px-3 py-2 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 mt-2">Platform</div>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive 
                    ? "text-white bg-zinc-900" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 rounded-xl border border-zinc-800 bg-zinc-900 z-0" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {link.highlight && !isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00E5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <link.icon className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive 
                    ? "text-[#00E5FF]" 
                    : link.highlight ? "text-[#00FF85] group-hover:text-[#00FF85]" : "text-zinc-500 group-hover:text-zinc-300"
                }`} />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-900/50">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Simulation Credits</span>
              <span className="text-xs font-bold text-[#00FF85] px-2 py-1 bg-[#00FF85]/10 rounded-md">{credits.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00FF85]" style={{ width: `${Math.min(100, (credits / 5000) * 100)}%` }} />
            </div>
            <Link href="/dashboard/billing" className="text-xs font-medium text-white hover:text-[#00E5FF] transition-colors mt-1">Upgrade Tier &rarr;</Link>
          </div>
          
          <button className="mt-4 flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a] relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-gradient-to-b from-[#00E5FF]/5 to-transparent blur-[100px] pointer-events-none z-0" />
        
        {/* Top Header */}
        <header className="h-20 shrink-0 border-b border-zinc-900/50 flex items-center justify-between px-10 relative z-10 backdrop-blur-md bg-[#0a0a0a]/80">
          <h1 className="text-2xl font-bold tracking-tight text-white capitalize">
            {pathname.split("/").pop() === "dashboard" ? "Overview" : pathname.split("/").pop()?.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900">
              <span className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" /> Orchestrator: Online
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#00FF85] p-[2px] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-2 border-black">
                <span className="text-xs font-bold text-white">DH</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div data-lenis-prevent="true" className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto min-h-full pb-20"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
