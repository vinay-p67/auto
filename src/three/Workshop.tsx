import React, { useMemo } from 'react';
import * as THREE from 'three';

export const Workshop: React.FC = () => {
  const materials = useMemo(() => {
    return {
      floor: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#080c14'),
        roughness: 0.28,
        metalness: 0.6,
      }),
      liftSteel: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#334155'),
        metalness: 0.85,
        roughness: 0.35,
      }),
      liftPiston: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#94a3b8'),
        metalness: 0.95,
        roughness: 0.1,
      }),
      toolChest: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#dc2626'), // Classic mechanic red
        metalness: 0.6,
        roughness: 0.4,
      }),
      toolChrome: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e2e8f0'),
        metalness: 0.95,
        roughness: 0.1,
      }),
      diagnosticScreen: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0284c7'),
        emissive: new THREE.Color('#0369a1'),
        emissiveIntensity: 0.8,
      }),
      yellowHazard: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#eab308'),
        metalness: 0.3,
        roughness: 0.5,
      }),
    };
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Reflective Workshop Epoxy Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} material={materials.floor} receiveShadow>
        <planeGeometry args={[40, 40]} />
      </mesh>

      {/* Safety Floor Marking Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} material={materials.yellowHazard}>
        <ringGeometry args={[2.8, 2.9, 48]} />
      </mesh>

      {/* 2. Hydraulic Lift Posts (Left & Right) */}
      <group position={[-2.4, 0, 0]}>
        {/* Base plate */}
        <mesh position={[0, 0.05, 0]} material={materials.liftSteel}>
          <boxGeometry args={[0.7, 0.1, 0.7]} />
        </mesh>
        {/* Vertical Post Column */}
        <mesh position={[0, 2.2, 0]} material={materials.liftSteel} castShadow>
          <boxGeometry args={[0.35, 4.4, 0.4]} />
        </mesh>
        {/* Hydraulic Cylinder */}
        <mesh position={[0.15, 1.8, 0]} material={materials.liftPiston}>
          <cylinderGeometry args={[0.07, 0.07, 3.2, 16]} />
        </mesh>
        {/* Lift Arm */}
        <mesh position={[0.7, 0.25, 0]} material={materials.yellowHazard} castShadow>
          <boxGeometry args={[1.2, 0.12, 0.16]} />
        </mesh>
      </group>

      <group position={[2.4, 0, 0]}>
        {/* Base plate */}
        <mesh position={[0, 0.05, 0]} material={materials.liftSteel}>
          <boxGeometry args={[0.7, 0.1, 0.7]} />
        </mesh>
        {/* Vertical Post Column */}
        <mesh position={[0, 2.2, 0]} material={materials.liftSteel} castShadow>
          <boxGeometry args={[0.35, 4.4, 0.4]} />
        </mesh>
        {/* Hydraulic Cylinder */}
        <mesh position={[-0.15, 1.8, 0]} material={materials.liftPiston}>
          <cylinderGeometry args={[0.07, 0.07, 3.2, 16]} />
        </mesh>
        {/* Lift Arm */}
        <mesh position={[-0.7, 0.25, 0]} material={materials.yellowHazard} castShadow>
          <boxGeometry args={[1.2, 0.12, 0.16]} />
        </mesh>
      </group>

      {/* 3. Rolling Master Mechanic Tool Chest (Back Left) */}
      <group position={[-3.2, 0, -2.8]} rotation={[0, 0.35, 0]}>
        {/* Main Chest Cabinet */}
        <mesh position={[0, 0.75, 0]} material={materials.toolChest} castShadow>
          <boxGeometry args={[1.4, 1.3, 0.7]} />
        </mesh>
        {/* Drawer Chrome Handles */}
        {[0.35, 0.55, 0.75, 0.95, 1.15].map((y, i) => (
          <mesh key={i} position={[0, y, 0.36]} material={materials.toolChrome}>
            <boxGeometry args={[1.1, 0.04, 0.03]} />
          </mesh>
        ))}
        {/* Top Tray Surface with Rubber Mat */}
        <mesh position={[0, 1.42, 0]} material={materials.liftSteel}>
          <boxGeometry args={[1.42, 0.04, 0.72]} />
        </mesh>
      </group>

      {/* 4. Digital Engine Diagnostic Terminal / OBD-2 Cart (Back Right) */}
      <group position={[3.1, 0, -2.2]} rotation={[0, -0.4, 0]}>
        {/* Stand Pillar */}
        <mesh position={[0, 0.7, 0]} material={materials.liftSteel} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 16]} />
        </mesh>
        {/* Base Casters */}
        <mesh position={[0, 0.05, 0]} material={materials.liftSteel}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 6]} />
        </mesh>
        {/* Diagnostic Monitor Console */}
        <mesh position={[0, 1.45, 0]} rotation={[-0.25, 0, 0]} material={materials.liftSteel} castShadow>
          <boxGeometry args={[0.8, 0.55, 0.1]} />
        </mesh>
        {/* Illuminated Diagnostic Screen */}
        <mesh position={[0, 1.46, 0.05]} rotation={[-0.25, 0, 0]} material={materials.diagnosticScreen}>
          <planeGeometry args={[0.72, 0.46]} />
        </mesh>
      </group>

      {/* 5. Overhead Workshop Industrial Lighting Bars */}
      <group position={[0, 4.2, 0]}>
        <mesh position={[0, 0, 1.5]} material={materials.liftSteel}>
          <boxGeometry args={[3.2, 0.08, 0.2]} />
        </mesh>
        <mesh position={[0, -0.05, 1.5]} material={materials.diagnosticScreen}>
          <boxGeometry args={[3.0, 0.02, 0.15]} />
        </mesh>
        
        <mesh position={[0, 0, -1.5]} material={materials.liftSteel}>
          <boxGeometry args={[3.2, 0.08, 0.2]} />
        </mesh>
        <mesh position={[0, -0.05, -1.5]} material={materials.diagnosticScreen}>
          <boxGeometry args={[3.0, 0.02, 0.15]} />
        </mesh>
      </group>
    </group>
  );
};
