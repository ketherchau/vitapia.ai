"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, PieChart as PieChartIcon, MapPin, Home, DollarSign } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#00E5FF", "#00FF85", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];

type DemographicsData = {
  totalAgents: number;
  demographics: {
    age: Array<{ name: string; value: number }>;
    gender: Array<{ name: string; value: number }>;
    income: Array<{ name: string; value: number }>;
    housing: Array<{ name: string; value: number }>;
    district: Array<{ name: string; value: number }>;
  };
};

export default function AudienceDatabase() {
  const [stats, setStats] = useState<DemographicsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents/stats")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch agent stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-20 text-center text-zinc-500 animate-pulse">Scanning Demographic Database...</div>;
  }

  if (!stats || stats.totalAgents === 0) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">No Synthetic Agents Found</h2>
        <p className="text-zinc-500">Run a Pulse Check simulation to generate your first cohort of localized AI personas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Synthetic Audience Database</h2>
          <p className="text-zinc-500">Overview of persistent AI personas currently modeling the Hong Kong market.</p>
        </div>
        <div className="px-6 py-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center gap-4">
          <div className="p-3 bg-[#00E5FF]/10 rounded-lg">
            <Users className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Total Active Agents</p>
            <p className="text-3xl font-black text-white">{stats.totalAgents.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gender Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon className="w-5 h-5 text-[#00FF85]" />
            <h3 className="text-xl font-bold text-white">Gender Split</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.demographics.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(props: { name?: string | number; percent?: number }) => `${String(props.name || '')} ${((Number(props.percent) || 0) * 100).toFixed(0)}%`}
                >
                  {stats.demographics.gender.map((entry: Record<string, unknown>, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Housing Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <Home className="w-5 h-5 text-[#3B82F6]" />
            <h3 className="text-xl font-bold text-white">Housing Type</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.demographics.housing}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(props: { name?: string | number; percent?: number }) => `${String(props.name || '').split(' ')[0]} ${((Number(props.percent) || 0) * 100).toFixed(0)}%`}
                >
                  {stats.demographics.housing.map((entry: Record<string, unknown>, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Age Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 shadow-lg col-span-1 md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="text-xl font-bold text-white">Age Brackets</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.demographics.age} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Income Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5 text-[#EC4899]" />
            <h3 className="text-xl font-bold text-white">Monthly Income (HKD)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.demographics.income} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" stroke="#71717a" />
                <YAxis dataKey="name" type="category" stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="value" fill="#EC4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* District Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="text-xl font-bold text-white">Regional Spread</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.demographics.district} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
