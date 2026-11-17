import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ActivePart, THREE_CONFIG } from './config';

interface CarModelProps {
  activePart: ActivePart;
  isHovered?: boolean;
}

// Preload the GLB model
useGLTF.preload(THREE_CONFIG.modelUrl);

export const RealCar: React.FC<CarModelProps> = ({ activePart }) => {
  const groupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Object3D[]>([]);

  const { scene } = useGLTF(THREE_CONFIG.modelUrl);

  // Clone scene so materials can be modified cleanly
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Premium automotive materials
  const materials = useMemo(() => {
    return {
      body: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(THREE_CONFIG.colors.carBody),
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 0.95,
      }),
      rims: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d1d5db'),
        metalness: 0.95,
        roughness: 0.15,
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e293b'),
        metalness: 0.8,
        roughness: 0.4,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#030712'),
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.85,
      }),
      brakes: new THREE.MeshStandardMaterial({
        color: new THREE.Color(activePart === 'wheel' ? THREE_CONFIG.colors.highlightGlow : '#ef4444'),
        emissive: new THREE.Color(activePart === 'wheel' ? '#ff2a4b' : '#000000'),
        emissiveIntensity: activePart === 'wheel' ? 1.2 : 0,
        metalness: 0.8,
        roughness: 0.2,
      }),
      engineGlow: new THREE.MeshStandardMaterial({
        color: new THREE.Color(activePart === 'engine' ? '#f97316' : '#334155'),
        emissive: new THREE.Color(activePart === 'engine' ? '#ea580c' : '#000000'),
        emissiveIntensity: activePart === 'engine' ? 1.0 : 0,
        metalness: 0.8,
        roughness: 0.3,
      }),
    };
  }, [activePart]);

  useEffect(() => {
    wheelsRef.current = [];

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const name = mesh.name.toLowerCase();

        if (name.includes('body')) {
          mesh.material = materials.body;
        } else if (name.includes('rim')) {
          mesh.material = materials.rims;
        } else if (name.includes('trim') || name.includes('carbon')) {
          mesh.material = materials.carbon;
        } else if (name.includes('glass')) {
          mesh.material = materials.glass;
        } else if (name.includes('brake')) {
          mesh.material = materials.brakes;
        }
      }

      // Collect wheel objects for rotation animation
      const name = child.name.toLowerCase();
      if (
        name === 'wheel_fl' ||
        name === 'wheel_fr' ||
        name === 'wheel_rl' ||
        name === 'wheel_rr'
      ) {
        wheelsRef.current.push(child);
      }
    });
  }, [clonedScene, materials]);

  // Gentle idle animation and subtle wheel rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
    }
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += delta * 0.3;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <primitive object={clonedScene} />

      {/* Dynamic Engine Diagnostics Highlight Glow */}
      {(activePart === 'engine' || activePart === 'diagnostics') && (
        <pointLight position={[0, 0.7, 1.2]} color="#ff4500" intensity={2.5} distance={2.5} />
      )}

      {/* Dynamic Battery Highlight Glow */}
      {activePart === 'battery' && (
        <pointLight position={[-0.6, 0.7, 1.0]} color="#0ea5e9" intensity={2.5} distance={2.5} />
      )}

      {/* Dynamic Wheel / Brake Highlight Glow */}
      {activePart === 'wheel' && (
        <>
          <pointLight position={[0.9, 0.4, 1.2]} color="#ff2a4b" intensity={2.0} distance={1.8} />
          <pointLight position={[-0.9, 0.4, 1.2]} color="#ff2a4b" intensity={2.0} distance={1.8} />
        </>
      )}

      {/* Underglow Ground Reflection */}
      <pointLight position={[0, 0.08, 0]} color={THREE_CONFIG.colors.underglow} intensity={1.0} distance={2.5} />
    </group>
  );
};

// Procedural Fallback in case of network or load delay
export const ProceduralCarFallback: React.FC<CarModelProps> = ({ activePart }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Sleek Aerodynamic Sports GT Body */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.38, 4.2]} />
        <meshPhysicalMaterial
          color="#b91c1c"
          metalness={0.9}
          roughness={0.2}
          clearcoat={1.0}
        />
      </mesh>
      {/* Aerodynamic Hood */}
      <mesh position={[0, 0.46, 1.45]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[1.82, 0.22, 1.3]} />
        <meshPhysicalMaterial color="#b91c1c" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Tinted Cockpit */}
      <mesh position={[0, 0.75, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.46, 2.1]} />
        <meshPhysicalMaterial color="#020617" transmission={0.7} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// Error Boundary wrapper component
export class CarModelErrorBoundary extends React.Component<
  { activePart: ActivePart; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { activePart: ActivePart; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('Real car model GLB error, falling back to procedural model:', error);
  }

  render() {
    if (this.state.hasError) {
      return <ProceduralCarFallback activePart={this.props.activePart} />;
    }
    return this.props.children;
  }
}

export const CarModel: React.FC<CarModelProps> = ({ activePart }) => {
  return (
    <CarModelErrorBoundary activePart={activePart}>
      <React.Suspense fallback={<ProceduralCarFallback activePart={activePart} />}>
        <RealCar activePart={activePart} />
      </React.Suspense>
    </CarModelErrorBoundary>
  );
};
