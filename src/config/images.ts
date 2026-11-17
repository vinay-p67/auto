export interface AutomotiveImage {
  url: string;
  alt: string;
  caption?: string;
}

export const AUTO_IMAGES = {
  hero: {
    primary: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1920&q=85',
    alt: 'Master technician inspecting high-performance sports vehicle in modern, clean automotive service bay',
    badge: 'State-of-the-Art Service Center',
  },
  heroBanner: {
    url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1920&q=85',
    alt: 'Pristine modern automotive repair facility with hydraulic lifts and digital diagnostic bays',
  },
  services: {
    oilChange: {
      url: 'https://images.unsplash.com/photo-1574755393849-623942496936?auto=format&fit=crop&w=1200&q=80',
      alt: 'Clean oil service and engine lubrication system maintenance',
      tag: 'Engine Longevity',
    },
    brakeInspection: {
      url: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=1200&q=80',
      alt: 'High-performance brake rotor and caliper precision inspection',
      tag: 'Braking Performance',
    },
    engineDiagnostic: {
      url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Certified technician conducting in-depth electronic engine diagnostics',
      tag: 'Diagnostic Rigor',
    },
    batteryElectrical: {
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      alt: 'Precision battery, alternator, and vehicle electrical system testing',
      tag: 'Electrical Integrity',
    },
    tireRotation: {
      url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&q=80',
      alt: 'Dynamic tire balance, laser alignment, and wheel rotation service',
      tag: 'Ride Dynamics',
    },
    generalRepair: {
      url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      alt: 'Comprehensive bumper-to-bumper vehicle inspection and mechanical consultation',
      tag: 'Complete Assessment',
    },
    default: {
      url: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80',
      alt: 'Professional auto repair service bay',
      tag: 'Master Care',
    }
  },
  about: {
    bay: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=80',
    technician: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    tools: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1200&q=80',
    diagnostics: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  },
  trustPillars: [
    {
      title: 'Digital Multi-Point Inspection',
      desc: 'Transparent digital reports with high-resolution photographic evidence for every repair recommendation.',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'OEM-Grade Precision Tooling',
      desc: 'Calibrated diagnostic scanners, Hunter laser alignment racks, and factory-certified torque specifications.',
      image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Master Certified Technicians',
      desc: 'ASE Master Certified mechanics with decades of specialized European, Domestic, and Import vehicle mastery.',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    }
  ]
};

/**
 * Helper to match an auto repair service name to its dedicated photography
 */
export function getServiceImage(serviceName: string): { url: string; alt: string; tag: string } {
  const normalized = serviceName.toLowerCase();
  if (normalized.includes('oil')) {
    return AUTO_IMAGES.services.oilChange;
  }
  if (normalized.includes('brake')) {
    return AUTO_IMAGES.services.brakeInspection;
  }
  if (normalized.includes('engine') || normalized.includes('diagnostic')) {
    return AUTO_IMAGES.services.engineDiagnostic;
  }
  if (normalized.includes('battery') || normalized.includes('electrical')) {
    return AUTO_IMAGES.services.batteryElectrical;
  }
  if (normalized.includes('tire') || normalized.includes('wheel') || normalized.includes('balance')) {
    return AUTO_IMAGES.services.tireRotation;
  }
  if (normalized.includes('consultation') || normalized.includes('repair') || normalized.includes('general')) {
    return AUTO_IMAGES.services.generalRepair;
  }
  return AUTO_IMAGES.services.default;
}
