import React from 'react';
import { Clock, DollarSign, CalendarCheck, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Service } from '../../types/database';
import { getServiceImage } from '../../config/images';
import { ActivePart } from '../../three/config';

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
  onHoverPart: (part: ActivePart) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onHoverPart,
}) => {
  const { activeServices, isLoading } = useShop();

  const getPartFromService = (serviceName: string): ActivePart => {
    const s = serviceName.toLowerCase();
    if (s.includes('brake') || s.includes('tire') || s.includes('wheel')) return 'wheel';
    if (s.includes('oil')) return 'engine';
    if (s.includes('engine') || s.includes('diagnostic')) return 'diagnostics';
    if (s.includes('battery') || s.includes('electrical')) return 'battery';
    return 'general';
  };

  return (
    <section id="services" className="relative py-24 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Technician Care</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Precision Auto Services & Bay Rates
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Every service includes a complimentary digital multi-point health check, fluid analysis, 
            and transparent written estimate before any mechanical work begins.
          </p>
        </div>

        {/* Loading Skeleton if Supabase is fetching */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-2xl h-96 animate-pulse bg-slate-900/50" />
            ))}
          </div>
        )}

        {/* Dynamic Services Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service) => {
              const imgData = getServiceImage(service.name);
              const part = getPartFromService(service.name);

              return (
                <div
                  key={service.id}
                  onMouseEnter={() => onHoverPart(part)}
                  onMouseLeave={() => onHoverPart('none')}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border border-white/10"
                >
                  {/* Card Image Area with Badge & Overlay */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                    <img
                      src={imgData.url}
                      alt={imgData.alt}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/30 to-transparent" />

                    {/* Quality Tag Pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-200 uppercase tracking-wider">
                      {imgData.tag}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-brand-600/90 backdrop-blur-md text-white font-mono font-bold text-lg shadow-lg flex items-center">
                      <DollarSign className="w-4 h-4 mr-0.5" />
                      <span>{Number(service.price).toFixed(2)}</span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{service.duration_minutes} mins</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white group-hover:text-brand-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-300 text-sm mt-2 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Service Feature Highlights */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Factory OEM-approved lubricants & parts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Digital inspection report sent directly to your phone</span>
                      </div>
                    </div>

                    {/* Booking Action Button */}
                    <button
                      onClick={() => onSelectService(service)}
                      className="w-full mt-2 flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-brand-600 text-slate-200 hover:text-white font-semibold uppercase tracking-wider text-xs py-3 px-4 rounded-xl border border-white/10 group-hover:border-brand-500 transition-all cursor-pointer shadow-md"
                    >
                      <CalendarCheck className="w-4 h-4 text-brand-400 group-hover:text-white" />
                      <span>Select Service & Reserve Bay</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between border border-white/10 space-y-4 sm:space-y-0">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-white font-bold text-lg font-display uppercase">
              Need a Custom Repair or Complex Engine Diagnostic?
            </h4>
            <p className="text-slate-300 text-sm">
              Our master technicians perform specialized electrical tracing, transmission overhauls, and complete mechanical rebuilds.
            </p>
          </div>
          <button
            onClick={() => {
              const general = activeServices.find((s) => s.name.toLowerCase().includes('consultation')) || activeServices[0];
              if (general) onSelectService(general);
            }}
            className="shrink-0 bg-brand-600 hover:bg-brand-500 text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-glow-red transition-all cursor-pointer"
          >
            Schedule Consultation
          </button>
        </div>
      </div>
    </section>
  );
};
