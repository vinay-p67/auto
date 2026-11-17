import React from 'react';
import { Shield, Clock, Wrench, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { AUTO_IMAGES } from '../../config/images';

export const WhyUsSection: React.FC = () => {
  return (
    <section id="why-us" className="relative py-24 z-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>The Precision Difference</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Why Drivers Choose Our Master Bays
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Built from the ground up to respect your time, your vehicle’s factory engineering, and your peace of mind.
          </p>
        </div>

        {/* 3 Featured Pillar Cards with Photography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AUTO_IMAGES.trustPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent" />
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-brand-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Standard on every appointment</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-16 glass-panel rounded-2xl p-8 border border-brand-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <Shield className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white uppercase text-base">24-Month / 24,000-Mile</h4>
              <p className="text-slate-400 text-xs">Nationwide parts & labor warranty</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white uppercase text-base">On-Time Bay Guarantee</h4>
              <p className="text-slate-400 text-xs">Your reserved bay is prepared before you arrive</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <Wrench className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white uppercase text-base">100% Genuine Fluids</h4>
              <p className="text-slate-400 text-xs">Full OEM-specification lubricants and filters</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
