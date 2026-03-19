"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Swarm() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 2000;
  
  // Generate random positions for the particles
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 2 + Math.random() * 5;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = radius * Math.cos(phi); // z
    }
    return positions;
  }, [particlesCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00E5FF"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export default function ParticleSwarm() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#0a0a0a]">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
        <ambientLight intensity={0.5} />
        <Swarm />
      </Canvas>
    </div>
  );
}
