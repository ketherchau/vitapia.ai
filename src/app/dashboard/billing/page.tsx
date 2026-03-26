"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Zap, Server } from "lucide-react";
import { useSearchParams } from "next/navigation";

function BillingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (searchParams.get("success")) setSuccess(true);
  }, [searchParams]);

  const handleUpgrade = async (plan: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
          creditsToAdd: plan.credits
        })
      });
      const data = await res.json();
      if (data.url) {
        if (data.mock) {
          window.location.reload(); // Reload to refresh credit sidebar
        } else {
          window.location.href = data.url;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const plans = [
    {
      name: "Starter",
      price: "$99",
      credits: 5000,
      desc: "For startups testing MVP product fit.",
      features: ["5,000 Localized AI Agents/mo", "Basic Demographic Sync", "CSV Export", "Email Support"],
      priceId: "price_mock_starter",
      icon: Zap
    },
    {
      name: "Professional",
      price: "$499",
      credits: 50000,
      desc: "For mid-size agencies running multiple campaigns.",
      features: [
        "50,000 Localized AI Agents/mo", 
        "Focus Groups Customize Range", 
        "Survey AI Draft", 
        "Unlimited Survey Questions", 
        "Comprehensive Reports with 20+ metrics",
        "Advanced District Targeting", 
        "PDF Reporting", 
        "API Access"
      ],
      priceId: "price_mock_pro",
      popular: true,
      icon: Server
    },
    {
      name: "Enterprise",
      price: "Custom",
      credits: 500000,
      desc: "Custom deployments on private VPCs.",
      features: ["Unlimited Synthetic Agents", "Custom Llama-3 Fine-tuning", "Ground-Truth Analytics Sync", "Dedicated Account Manager"],
      priceId: "contact_sales",
      icon: CreditCard
    }
  ];

  return (
    <div className="space-y-8 pb-32 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Scale Your Synthetic Audience</h2>
        <p className="text-zinc-400">Upgrade your tier to increase the statistical validity of your predictions with a larger AI agent population.</p>
        
        {success && (
          <div className="mt-6 p-4 rounded-xl bg-[#00FF85]/10 border border-[#00FF85]/20 text-[#00FF85] font-bold animate-pulse">
            ✅ Payment Successful! Your credits have been updated.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[2rem] border relative ${
              plan.popular ? 'border-[#00E5FF] bg-zinc-900/80 shadow-[0_0_30px_rgba(0,229,255,0.15)]' : 'border-zinc-800 bg-zinc-950/80'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black text-xs font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <div className="mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}>
                <plan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-zinc-500">/mo</span>}
              </div>
              <p className="text-sm text-zinc-400">{plan.desc}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-[#00FF85]' : 'text-zinc-600'}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => plan.price !== "Custom" && handleUpgrade(plan)}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.popular 
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#00FF85] text-black hover:scale-105 shadow-lg' 
                  : 'bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800'
              }`}
            >
              {loading ? "Processing..." : plan.price === "Custom" ? "Contact Sales" : "Upgrade Plan"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="text-zinc-500 text-center py-20">Loading Billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}
