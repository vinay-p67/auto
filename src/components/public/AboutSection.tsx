import React from 'react';
import { ShieldCheck, Cpu, Award, CheckCircle, Wrench, FileText } from 'lucide-react';
import { AUTO_IMAGES } from '../../config/images';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest">
              <Wrench className="w-3.5 h-3.5" />
              <span>Modern Workshop Standard</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              Aviation-Grade Rigor.{' '}
              <span className="text-brand-500">Zero Guesswork.</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We engineered Precision Auto Repair to eliminate the opacity and inconvenience of traditional garages. 
              Our service center is maintained like an aerospace laboratory: spotless bays, digital diagnostic archives, 
              and photographic transparency before any wrench turns.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
              <span className="font-display text-4xl font-extrabold text-white block">100%</span>
              <span className="text-xs uppercase font-medium text-slate-400 tracking-wider mt-1 block">
                Digital Photographic Evidence
              </span>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
              <span className="font-display text-4xl font-extrabold text-brand-400 block">6 Bays</span>
              <span className="text-xs uppercase font-medium text-slate-400 tracking-wider mt-1 block">
                Hydraulic Precision Lifts
              </span>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
              <span className="font-display text-4xl font-extrabold text-blue-400 block">15,000+</span>
              <span className="text-xs uppercase font-medium text-slate-400 tracking-wider mt-1 block">
                Vehicles Serviced Safely
              </span>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
              <span className="font-display text-4xl font-extrabold text-emerald-400 block">4.9 / 5</span>
              <span className="text-xs uppercase font-medium text-slate-400 tracking-wider mt-1 block">
                Verified Client Rating
              </span>
            </div>
          </div>
        </div>

        {/* Layered Visual Photo Grid & Workshop Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Layered Photo Gallery */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 shadow-2xl group">
                <img
                  src={AUTO_IMAGES.about.bay}
                  alt="Spotless modern automotive repair bay with vehicle on lift"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                  Precision Hydraulic Bay
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10 shadow-2xl group">
                <img
                  src={AUTO_IMAGES.about.tools}
                  alt="Neat tool wall and calibrated torque equipment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                  Calibrated Torque Rig
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10 shadow-2xl group">
                <img
                  src={AUTO_IMAGES.about.diagnostics}
                  alt="Digital engine diagnostic scanner connected to vehicle terminal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                  OBD-II Live Telemetry
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 shadow-2xl group">
                <img
                  src={AUTO_IMAGES.about.technician}
                  alt="Certified master technician inspecting engine components"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                  ASE Master Certified Staff
                </span>
              </div>
            </div>
          </div>

          {/* Right Workshop Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-display text-lg font-bold uppercase tracking-wide">
                    Digital Multi-Point Health Archive
                  </h4>
                  <p className="text-slate-400 text-xs">Full transparency for every part and fluid</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Before approving any service, you receive a direct link on your phone showing high-resolution photos of your brake pad wear, tire depth measurements, battery load test readouts, and fluid colorations.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-display text-lg font-bold uppercase tracking-wide">
                    OEM-Grade Electronic Calibration
                  </h4>
                  <p className="text-slate-400 text-xs">Bi-directional scanners & CAN-bus diagnostics</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Modern vehicles are computers on wheels. We maintain factory-authorized diagnostic scan tools capable of ECU module programming, sensor relearning, radar/camera ADAS calibration, and deep trouble code isolation.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-display text-lg font-bold uppercase tracking-wide">
                    Certified Technicians & Factory Specs
                  </h4>
                  <p className="text-slate-400 text-xs">Torque-to-yield accuracy and genuine fluids</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our technicians follow precise manufacturer repair manuals and bolt tightening sequences. We never cut corners with cheap generic fluids or inaccurate aftermarket components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
