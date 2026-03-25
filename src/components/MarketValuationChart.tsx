"use client";

import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const dataTAM = [
  {
    name: 'TAM',
    fullName: 'Total Addressable Market',
    value: 100, 
    label: '$100B+',
    description: 'Global market research industry',
    fill: '#06b6d4',
    opacity: 0.2,
  }
];

const dataSAM = [
  {
    name: 'SAM',
    fullName: 'Serviceable Available Market',
    value: 20,
    label: '$20B+',
    description: 'Asia market research segment',
    fill: '#06b6d4',
    opacity: 0.5,
  }
];

const dataSOM = [
  {
    name: 'SOM',
    fullName: 'Serviceable Obtainable Market',
    value: 1.5,
    label: '$1.5B+',
    description: 'HK/GBA FMCG brands, agencies, public policy',
    fill: '#10b981',
    opacity: 0.9,
  }
];

type CustomTooltipProps = {
  active?: boolean;
  payload?: { payload: { name: string; fullName: string; label: string; description: string } }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl backdrop-blur-md z-50">
        <p className="text-white font-bold text-lg mb-1">{data.name} - {data.fullName}</p>
        <p className="text-[#00E5FF] font-black text-2xl mb-2">{data.label}</p>
        <p className="text-zinc-400 text-sm">{data.description}</p>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomLabel = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, payload } = props;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  return (
    <text 
      x={cx} 
      y={cy - radius} 
      fill="#fff" 
      textAnchor="middle" 
      dominantBaseline="central" 
      className="text-sm font-bold drop-shadow-md pointer-events-none"
    >
      {payload?.name} ({payload?.label})
    </text>
  );
};

export default function MarketValuationChart() {
  return (
    <div className="w-full h-[480px] mt-6 bg-zinc-950/50 rounded-3xl border border-zinc-800 p-6 backdrop-blur-md shadow-2xl relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 3, right: 3, bottom: 3, left: 3 }}>
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
          
          <Pie
            data={dataTAM}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="75%"
            outerRadius="95%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            labelLine={false}
            label={renderCustomLabel}
            isAnimationActive={true}
          >
            {dataTAM.map((entry, index) => (
              <Cell key={`cell-tam-${index}`} fill={entry.fill} fillOpacity={entry.opacity} />
            ))}
          </Pie>

          <Pie
            data={dataSAM}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="70%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            labelLine={false}
            label={renderCustomLabel}
            isAnimationActive={true}
          >
            {dataSAM.map((entry, index) => (
              <Cell key={`cell-sam-${index}`} fill={entry.fill} fillOpacity={entry.opacity} />
            ))}
          </Pie>

          <Pie
            data={dataSOM}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="25%"
            outerRadius="45%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            labelLine={false}
            label={renderCustomLabel}
            isAnimationActive={true}
          >
            {dataSOM.map((entry, index) => (
              <Cell key={`cell-som-${index}`} fill={entry.fill} fillOpacity={entry.opacity} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
