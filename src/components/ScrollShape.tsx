"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function MorphingDataNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  
  useFrame(() => {
    // We use standard window scrolling for performance outside of React state
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    
    if (meshRef.current) {
      // Scrub rotation based directly on scroll progress (Meter.com style)
      meshRef.current.rotation.x = progress * Math.PI * 10;
      meshRef.current.rotation.y = progress * Math.PI * 6;
      
      // Move shape dynamically across the screen to interact with the text sections
      // Math.sin creates a sweeping left-to-right-to-left motion
      const targetX = Math.sin(progress * Math.PI * 5) * 5;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      
      // Bob up and down slightly
      const targetY = Math.cos(progress * Math.PI * 8) * 1.5;
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      
      // Scale changes to emphasize certain sections
      const targetScale = 1.2 + Math.abs(Math.sin(progress * Math.PI * 4)) * 0.8;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05));
    }

    if (materialRef.current) {
      // Morph the geometry by cranking up the distortion multiplier at certain scroll depths
      const targetDistort = 0.2 + Math.abs(Math.sin(progress * Math.PI * 10)) * 0.8;
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05);
      
      // Shift colors between Cyan and Neon Green based on scroll depth
      const colorCyan = new THREE.Color("#00E5FF");
      const colorGreen = new THREE.Color("#00FF85");
      materialRef.current.color.lerpColors(colorCyan, colorGreen, progress);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        {/* A high-poly icosahedron looks incredible when distorted and wireframed */}
        <icosahedronGeometry args={[2, 16]} />
        <MeshDistortMaterial 
          ref={materialRef}
          color="#00E5FF" 
          wireframe={true}
          emissive="#00FF85"
          emissiveIntensity={0.4}
          distort={0.2}
          speed={3}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function ScrollShape() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={1} />
        <MorphingDataNode />
      </Canvas>
    </div>
  );
}
