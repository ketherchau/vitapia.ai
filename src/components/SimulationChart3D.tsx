"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Colors for different choices to make them pop
const COLORS = ["#00E5FF", "#00FF85", "#EC4899", "#8B5CF6", "#F59E0B"];

function Bar({ position, height, color, label, choice, count, setTooltip }: { position: [number, number, number], height: number, color: string, label: string, choice: string, count: number, setTooltip: (data: Record<string, string | number> | null) => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const targetScale = hovered ? 1.05 : 1;
  const actualHeight = Math.max(0.1, height); 
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.scale.y += (targetScale - mesh.current.scale.y) * 0.1;
      mesh.current.scale.x += (targetScale - mesh.current.scale.x) * 0.1;
      mesh.current.scale.z += (targetScale - mesh.current.scale.z) * 0.1;
      (mesh.current.material as THREE.Material).opacity = hovered ? 1 : 0.8;
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={mesh} 
        position={[0, actualHeight / 2, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); setTooltip({ label, choice, count }); }}
        onPointerOut={() => { setHover(false); setTooltip(null); }}
      >
        <boxGeometry args={[0.6, actualHeight, 0.6]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
        {/* Wireframe overlay for tech aesthetic */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.6, actualHeight, 0.6)]} />
          <lineBasicMaterial color={hovered ? "#ffffff" : color} transparent opacity={0.3} />
        </lineSegments>
      </mesh>
    </group>
  );
}

export default function SimulationChart3D({ responses }: { responses: Record<string, unknown>[] }) {
  const [tooltip, setTooltip] = useState<Record<string, string | number> | null>(null);

  // Aggregate Data: X-Axis = Age Groups, Z-Axis = Choices, Y-Axis = Count
  const chartData = useMemo(() => {
    if (!responses || responses.length === 0) return { ages: [], choices: [], matrix: [] };

    // Extract unique choices and ages
    const choiceSet = new Set<string>();
    const ageSet = new Set<string>();

    responses.forEach((r: Record<string, unknown>) => {
      choiceSet.add(String(r.choice || "Unknown"));
      ageSet.add(String((r.demographics as Record<string, unknown>)?.age || "Adult"));
    });

    const choices = Array.from(choiceSet).slice(0, 5); // Limit to top 5 choices to avoid clutter
    const ages = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"].filter(a => ageSet.has(a));
    if (ages.length === 0) ages.push("Adult"); // Fallback

    // Build Matrix [AgeIndex][ChoiceIndex] = Count
    const matrix = ages.map(() => choices.map(() => 0));
    let maxCount = 0;

    responses.forEach((r: Record<string, unknown>) => {
      const cIdx = choices.indexOf(String(r.choice || "Unknown"));
      const aIdx = ages.indexOf(String((r.demographics as Record<string, unknown>)?.age || "Adult"));
      if (cIdx !== -1 && aIdx !== -1) {
        matrix[aIdx][cIdx] += 1;
        if (matrix[aIdx][cIdx] > maxCount) maxCount = matrix[aIdx][cIdx];
      }
    });

    return { ages, choices, matrix, maxCount };
  }, [responses]);

  if (chartData.choices.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-zinc-500">No data available for 3D render.</div>;
  }

  const { ages, choices, matrix, maxCount = 1 } = chartData;

  // Layout parameters
  const spacingX = 1.5; // Spacing between Ages
  const spacingZ = 1.5; // Spacing between Choices
  const startX = -((ages.length - 1) * spacingX) / 2;
  const startZ = -((choices.length - 1) * spacingZ) / 2;
  const heightMultiplier = maxCount > 0 ? 5 / maxCount : 1; // Normalize max height to 5 units

  return (
    <>
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-3 max-w-[70%]">
        {choices.map((choice, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-md border border-zinc-800">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="truncate max-w-[120px]">{choice}</span>
          </div>
        ))}
      </div>

      {tooltip && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/90 border border-[#00E5FF] px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] backdrop-blur-md pointer-events-none min-w-[200px] text-center">
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">{tooltip.label}</p>
          <p className="text-sm font-bold text-white mb-2">{tooltip.choice}</p>
          <p className="text-2xl font-black text-[#00E5FF]">{tooltip.count} <span className="text-xs text-zinc-500 font-normal">Agents</span></p>
        </div>
      )}

      <Canvas camera={{ position: [6, 6, 8], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 30]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#00E5FF" />
        
        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2 - 0.1} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <group position={[0, -2, 0]}>
            {/* Grid Floor */}
            <gridHelper args={[20, 20, "#333333", "#111111"]} position={[0, -0.01, 0]} />

            {/* Render Bars */}
            {ages.map((age, aIdx) => (
              <group key={`age-${aIdx}`} position={[startX + aIdx * spacingX, 0, 0]}>
                {/* Age Label */}
                <Text
                  position={[0, -0.5, startZ + choices.length * spacingZ]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  fontSize={0.3}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  {age}
                </Text>

                {choices.map((choice, cIdx) => {
                  const count = matrix[aIdx][cIdx];
                  const height = count * heightMultiplier;
                  const color = COLORS[cIdx % COLORS.length];

                  return (
                    <Bar 
                      key={`bar-${aIdx}-${cIdx}`}
                      position={[0, 0, startZ + cIdx * spacingZ]}
                      height={height}
                      color={color}
                      label={`Age: ${age}`}
                      choice={choice}
                      count={count}
                      setTooltip={setTooltip}
                    />
                  );
                })}
              </group>
            ))}
          </group>
        </Float>
      </Canvas>
    </>
  );
}
