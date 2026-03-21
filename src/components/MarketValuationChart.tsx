"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  {
    name: 'TAM',
    fullName: 'Total Addressable Market',
    value: 100, // in Billions
    label: '$100B+',
    description: 'Global market research industry',
    color: '#3b82f6', // blue
  },
  {
    name: 'SAM',
    fullName: 'Serviceable Available Market',
    value: 20, // in Billions
    label: '$20B+',
    description: 'Asia market research segment',
    color: '#10b981', // green
  },
  {
    name: 'SOM',
    fullName: 'Serviceable Obtainable Market',
    value: 1.5, // in Billions (estimated realistic value for scale)
    label: '$1.5B+',
    description: 'HK/GBA FMCG brands, agencies, public policy',
    color: '#06b6d4', // cyan
  },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { name: string; fullName: string; label: string; description: string } }[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-white font-bold text-lg mb-1">{data.name} - {data.fullName}</p>
        <p className="text-[#00E5FF] font-black text-2xl mb-2">{data.label}</p>
        <p className="text-zinc-400 text-sm">{data.description}</p>
      </div>
    );
  }
  return null;
};

export default function MarketValuationChart() {
  return (
    <div className="w-full h-[400px] mt-12 bg-zinc-950/50 rounded-3xl border border-zinc-800 p-6 backdrop-blur-md shadow-2xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#a1a1aa" 
            tick={{ fill: '#a1a1aa', fontSize: 16, fontWeight: 'bold' }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#a1a1aa" 
            tick={{ fill: '#a1a1aa' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}B`}
          />
          <Tooltip cursor={{ fill: '#27272a', opacity: 0.4 }} content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}