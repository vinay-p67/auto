import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ActivePart, THREE_CONFIG } from './config';

interface CameraRigProps {
  currentStation: 'hero' | 'services' | 'about' | 'booking' | 'footer';
  activePart: ActivePart;
  reducedMotion: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  currentStation,
  activePart,
  reducedMotion,
}) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0.45, 0));
  const desiredPos = useRef(new THREE.Vector3(4.2, 1.9, 5.0));
  const desiredTarget = useRef(new THREE.Vector3(0, 0.45, 0));

  useEffect(() => {
    // Determine destination position and target
    if (currentStation === 'services' && activePart !== 'none') {
      const partConfig = THREE_CONFIG.partFocus[activePart];
      desiredPos.current.set(...partConfig.position);
      desiredTarget.current.set(...partConfig.target);
    } else {
      const stationConfig = THREE_CONFIG.stations[currentStation] || THREE_CONFIG.stations.hero;
      desiredPos.current.set(...stationConfig.position);
      desiredTarget.current.set(...stationConfig.target);
    }
  }, [currentStation, activePart]);

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(4.0, 1.8, 5.0);
      camera.lookAt(0, 0.45, 0);
      return;
    }

    // Mouse parallax offset (strongest on hero, subtle on other sections)
    const parallaxIntensity = currentStation === 'hero' ? 0.35 : 0.12;
    const px = state.pointer.x * parallaxIntensity;
    const py = state.pointer.y * (parallaxIntensity * 0.6);

    const targetPos = new THREE.Vector3(
      desiredPos.current.x + px,
      desiredPos.current.y + py,
      desiredPos.current.z
    );

    // Smooth damping for camera position (lerp)
    camera.position.lerp(targetPos, Math.min(1, delta * 2.8));

    // Smooth damping for camera target
    currentTarget.current.lerp(desiredTarget.current, Math.min(1, delta * 3.0));
    camera.lookAt(currentTarget.current);
  });

  return null;
};
