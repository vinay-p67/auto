import React from 'react';
import { Calendar, ChevronRight, CheckCircle2, ShieldCheck, Gauge, Wrench, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AUTO_IMAGES } from '../../config/images';

interface HeroProps {
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreServices }) => {
  const { settings } = useShop();

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background imagery subtle underlay with cinematic gradients */}
      <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20 mix-blend-screen overflow-hidden">
        <img
          src={AUTO_IMAGES.hero.primary}
          alt={AUTO_IMAGES.hero.alt}
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070a10] via-[#070a10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a10] via-transparent to-[#070a10]/70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy - Left 7 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-300">
                Precision Engineering & Certified Service
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.08]">
              Master Vehicle Care.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-rose-300">
                Uncompromising
              </span>{' '}
              Precision.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Factory-grade diagnostics, ASE Master Certified mechanics, and full digital transparency. 
              Schedule your auto repair appointment directly into our live service bays.
            </p>

            {/* Trust Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 pb-2">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200 bg-slate-900/60 backdrop-blur-sm border border-white/5 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">ASE Certified Master Mechanics</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200 bg-slate-900/60 backdrop-blur-sm border border-white/5 px-3 py-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="font-medium">Digital Photographic Proof</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200 bg-slate-900/60 backdrop-blur-sm border border-white/5 px-3 py-2 rounded-lg col-span-2 sm:col-span-1">
                <Gauge className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-medium">OEM-Calibrated Equipment</span>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={onBookClick}
                className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-xl shadow-glow-red hover:shadow-glow-red transition-all transform active:scale-95 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>Schedule Your Service</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="flex items-center justify-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm px-6 py-4 rounded-xl border border-slate-700/80 transition-all cursor-pointer backdrop-blur-md"
              >
                <Wrench className="w-4 h-4 text-brand-400" />
                <span>Explore Services & Rates</span>
              </button>
            </div>
          </div>

          {/* Right Column - Floating Live Workshop Metrics Card */}
          <div className="lg:col-span-4 hidden lg:block space-y-4">
            {/* Live Bay Telemetry Card */}
            <div className="glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                    Live Workshop Bay
                  </span>
                </div>
                <span className="text-[11px] font-mono text-brand-400 font-semibold">
                  Bay #1 - #6 Active
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Diagnostic Scanner Accuracy</span>
                  <span className="text-slate-200 font-mono font-semibold">100% OEM</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-500 h-1.5 rounded-full w-full" />
                </div>

                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-slate-400">Current Bay Queue</span>
                  <span className="text-emerald-400 font-mono font-semibold">Immediate Slots Open</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-3/4" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Location: {settings?.business_address?.split(',')[0] || 'Main Service Facility'}</span>
                <span className="font-mono text-slate-500">v2.4 Live</span>
              </div>
            </div>

            {/* Quick Consultation Callout */}
            <div className="glass-panel rounded-2xl p-4 flex items-center space-x-4 border border-brand-500/20">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                <Wrench className="w-6 h-6 text-brand-400" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Need an urgent diagnostic?</p>
                <p className="text-slate-400 mt-0.5">
                  Book online below or call our master technician desk directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
