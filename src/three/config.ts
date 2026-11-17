export type ActivePart = 'wheel' | 'engine' | 'battery' | 'diagnostics' | 'general' | 'none';

export interface CameraStation {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export const THREE_CONFIG = {
  // If a custom GLB is placed in /models/car.glb it can be loaded, otherwise our procedural car renders flawlessly
  modelUrl: '/models/car.glb',
  colors: {
    carBody: '#b91c1c', // Metallic racing red
    carSecondary: '#0f172a', // Carbon fiber / slate
    calipers: '#ef4444',
    wheels: '#1e293b',
    brakeDiscs: '#64748b',
    headlights: '#e0f2fe',
    taillights: '#ef4444',
    underglow: '#e63946',
    workshopFloor: '#090d16',
    liftSteel: '#334155',
    accentOrange: '#f97316',
    highlightGlow: '#ff334b',
  },
  stations: {
    hero: {
      position: [4.2, 1.9, 5.0] as [number, number, number],
      target: [0, 0.45, 0] as [number, number, number],
      fov: 42,
    },
    services: {
      position: [2.8, 1.3, 3.2] as [number, number, number],
      target: [0.6, 0.5, 0.4] as [number, number, number],
      fov: 38,
    },
    about: {
      position: [-4.6, 2.6, 4.5] as [number, number, number],
      target: [-0.5, 1.1, -0.4] as [number, number, number],
      fov: 45,
    },
    booking: {
      position: [0.2, 1.8, 6.2] as [number, number, number],
      target: [0, 0.5, 0] as [number, number, number],
      fov: 40,
    },
    footer: {
      position: [3.2, 1.2, 4.4] as [number, number, number],
      target: [0, 0.35, 0] as [number, number, number],
      fov: 40,
    },
  },
  partFocus: {
    wheel: {
      position: [2.1, 0.8, 1.8] as [number, number, number],
      target: [1.1, 0.4, 1.2] as [number, number, number],
    },
    engine: {
      position: [1.2, 1.6, 2.5] as [number, number, number],
      target: [0, 0.7, 1.5] as [number, number, number],
    },
    battery: {
      position: [-1.4, 1.5, 2.0] as [number, number, number],
      target: [-0.4, 0.7, 1.2] as [number, number, number],
    },
    diagnostics: {
      position: [0, 1.8, 3.2] as [number, number, number],
      target: [0, 0.7, 0.6] as [number, number, number],
    },
    general: {
      position: [3.4, 1.7, 4.0] as [number, number, number],
      target: [0, 0.5, 0] as [number, number, number],
    },
    none: {
      position: [2.8, 1.3, 3.2] as [number, number, number],
      target: [0.6, 0.5, 0.4] as [number, number, number],
    }
  }
};
