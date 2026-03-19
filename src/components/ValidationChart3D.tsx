"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// The full simulation results from our N=100 pilot (Q3 Omitted as requested)
const chartData = [
  { 
    q_label: "Q1: Food Share", 
    q_full: "Among the following food categories, which one accounts for the largest share of your average monthly household expenditure?",
    options: [
      { label: "Meals Out", full_label: "Meals out and takeaway food", real: 84.2, ai: 69.0 },
      { label: "Bread/Cakes", full_label: "Bread, cakes, biscuits and puddings", real: 3.1, ai: 0.0 },
      { label: "Pork", full_label: "Pork", real: 6.5, ai: 7.0 },
      { label: "Fresh Veg", full_label: "Fresh vegetables", real: 6.2, ai: 24.0 },
    ]
  },
  { 
    q_label: "Q2: Discretionary", 
    q_full: "Excluding Housing and Food, which of the following categories consumes the largest portion of your monthly household budget?",
    options: [
      { label: "Clothing", full_label: "Clothing and footwear", real: 9.0, ai: 1.0 },
      { label: "Durable Goods", full_label: "Durable goods", real: 15.7, ai: 2.0 },
      { label: "Transport", full_label: "Transport", real: 24.3, ai: 39.0 },
      { label: "Misc Services", full_label: "Miscellaneous services", real: 51.0, ai: 58.0 },
    ]
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Bar({ position, height, color, value, setTooltip, tooltipPayload }: any) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const targetScale = hovered ? 1.1 : 1;
  const actualHeight = Math.max(0.1, height); // Ensure 0% bars still render a tiny sliver
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, actualHeight * (hovered ? 1.05 : 1), 0.1);
      mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, 0.1);
      mesh.current.scale.z = THREE.MathUtils.lerp(mesh.current.scale.z, targetScale, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={mesh} 
        position={[0, actualHeight / 2, 0]} 
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHover(true); 
          document.body.style.cursor = 'pointer'; 
          setTooltip({ ...tooltipPayload, x: e.clientX, y: e.clientY, visible: true });
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setTooltip((prev: any) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
        }}
        onPointerOut={() => { 
          setHover(false); 
          document.body.style.cursor = 'auto'; 
          setTooltip(null);
        }}
      >
        <boxGeometry args={[0.7, 1, 0.7]} />
        <meshStandardMaterial color={hovered ? "#ffffff" : color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.4} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Percentage Value Floating Above */}
      <Text 
        position={[0, actualHeight + 0.6, 0]} 
        fontSize={0.4} 
        color={hovered ? "#ffffff" : color} 
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" 
        anchorX="center" 
        anchorY="middle"
      >
        {value.toFixed(1)}%
      </Text>
    </group>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OptionGroup({ position, data, q_full, setTooltip }: any) {
  const scaleFactor = 12; // 100% = 12 units high

  return (
    <group position={position}>
      {/* Real HK Data (Cyan) */}
      <Bar position={[-0.4, 0, 0]} height={(data.real / 100) * scaleFactor} color="#00E5FF" value={data.real} setTooltip={setTooltip} tooltipPayload={{q: q_full, opt: data.full_label, type: "Real HK Data", val: data.real, color: "#00E5FF"}} />
      
      {/* Vitapia AI Data (Green) */}
      <Bar position={[0.4, 0, 0]} height={(data.ai / 100) * scaleFactor} color="#00FF85" value={data.ai} setTooltip={setTooltip} tooltipPayload={{q: q_full, opt: data.full_label, type: "Vitapia AI", val: data.ai, color: "#00FF85"}} />
      
      {/* Option Label below the pair */}
      <Text 
        position={[0, -0.6, 0]} 
        fontSize={0.3} 
        color="#A0AAB2" 
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" 
        anchorX="center" 
        anchorY="middle" 
        maxWidth={2.5} 
        textAlign="center"
      >
        {data.label}
      </Text>
    </group>
  );
}

export default function ValidationChart3D() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tooltip, setTooltip] = useState<any>(null);

  return (
    <div className="h-[600px] w-full mt-16 relative cursor-grab active:cursor-grabbing">
      
      {/* Dynamic Hover Tooltip */}
      {tooltip && tooltip.visible && (
        <div 
          className="fixed z-[100] pointer-events-none p-5 rounded-2xl bg-zinc-950/95 border border-zinc-700 backdrop-blur-2xl shadow-2xl max-w-sm transform -translate-x-1/2 -translate-y-[120%]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-xs text-zinc-400 mb-3 leading-relaxed border-b border-zinc-800 pb-3">{tooltip.q}</p>
          <h4 className="text-lg font-bold text-white mb-3">{tooltip.opt}</h4>
          <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl border border-zinc-800/50">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tooltip.color, boxShadow: `0 0 10px ${tooltip.color}` }}></div>
            <span className="text-sm font-medium text-zinc-300">{tooltip.type}:</span>
            <span className="text-lg font-black text-white ml-auto">{tooltip.val.toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Legend overlaid on the HTML layer for clarity */}
      <div className="absolute top-6 left-6 z-10 flex gap-6 bg-black/60 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></div>
          <span className="text-sm text-zinc-300 font-medium">Real HK Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00FF85] shadow-[0_0_8px_#00FF85]"></div>
          <span className="text-sm text-zinc-300 font-medium">Vitapia AI Agents</span>
        </div>
      </div>

      <Canvas camera={{ position: [0, 8, 18], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[15, 20, 15]} angle={0.2} penumbra={1} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* OrbitControls allows unlimited panning, rotating, and zooming */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 - 0.1} // Prevent looking from underneath the floor
        />
        
        <Float rotationIntensity={0.05} floatIntensity={0.2} speed={1.5}>
          <group position={[0, -2, 0]}>
            
            {/* Render rows for each Question */}
            {chartData.map((q, rowIdx) => {
              const zPos = (rowIdx - 0.5) * 8; // Space rows out along Z axis (-4 and +4)
              
              return (
                <group key={q.q_label}>
                  {/* Question Row Label */}
                  <Text 
                    position={[-7, 0, zPos]} 
                    rotation={[-Math.PI / 2, 0, 0]} 
                    fontSize={0.6} 
                    color="#ffffff" 
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" 
                    anchorX="right"
                    anchorY="middle"
                  >
                    {q.q_label}
                  </Text>
                  
                  {/* Render Columns for each Option */}
                  {q.options.map((opt, colIdx) => {
                    const totalCols = q.options.length;
                    const xPos = (colIdx - (totalCols - 1) / 2) * 3.5; // Center columns along X axis
                    
                    return (
                      <OptionGroup key={opt.label} position={[xPos, 0, zPos]} data={opt} q_full={q.q_full} setTooltip={setTooltip} />
                    );
                  })}
                  
                  {/* Row dividing line */}
                  <mesh position={[0, -0.05, zPos - 4]}>
                    <boxGeometry args={[18, 0.02, 0.05]} />
                    <meshBasicMaterial color="#1A2B4C" />
                  </mesh>
                </group>
              );
            })}

            {/* Base Grid Plane */}
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[22, 0.2, 20]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[21.8, 0.05, 19.8]} />
              <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.1} wireframe />
            </mesh>
            
          </group>
        </Float>
      </Canvas>
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse font-bold bg-black/40 inline-block px-4 py-1.5 rounded-full backdrop-blur-md">
          Scroll to Zoom • Drag to Rotate • Hover for Details
        </p>
      </div>
    </div>
  );
}
