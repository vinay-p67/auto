import React from 'react';
import { Wrench, Phone, Mail, MapPin, Clock, Shield, ArrowUp } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings, businessHours } = useShop();

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#05070c] border-t border-slate-800/80 pt-16 pb-12 z-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-glow-red">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-display text-xl font-bold uppercase tracking-wider text-white">
                {settings?.business_name || 'Precision Auto'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium automotive maintenance, diagnostic engineering, and certified mechanical services. Dedicated to precision vehicle performance and client transparency.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              ASE Master Certified Service Bay #4920
            </div>
          </div>

          {/* Col 2: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-display font-bold uppercase text-white tracking-wider text-sm">
              Contact & Bay Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              {settings?.business_address && (
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{settings.business_address}</span>
                </div>
              )}
              {settings?.business_phone && (
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                  <a href={`tel:${settings.business_phone}`} className="hover:text-white transition-colors">
                    {settings.business_phone}
                  </a>
                </div>
              )}
              {settings?.business_email && (
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                  <a href={`mailto:${settings.business_email}`} className="hover:text-white transition-colors">
                    {settings.business_email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Col 3: Weekly Operating Hours */}
          <div className="space-y-3">
            <h4 className="font-display font-bold uppercase text-white tracking-wider text-sm">
              Service Bay Hours
            </h4>
            <div className="space-y-1 text-xs">
              {businessHours.length > 0 ? (
                businessHours.map((h) => (
                  <div key={h.id} className="flex justify-between items-center text-slate-400 font-mono">
                    <span>{weekdayNames[h.weekday]}</span>
                    <span className={h.is_open ? 'text-slate-200' : 'text-slate-600'}>
                      {h.is_open && h.start_time && h.end_time
                        ? `${h.start_time.slice(0, 5)} - ${h.end_time.slice(0, 5)}`
                        : 'Closed'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Mon - Fri: 8:00 AM - 6:00 PM</p>
              )}
            </div>
          </div>

          {/* Col 4: Quick Portals & Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold uppercase text-white tracking-wider text-sm">
              Management & Access
            </h4>
            <p className="text-xs text-slate-400">
              Shop owners, service advisors, and certified mechanics can access the management panel to adjust bay schedules, view appointments, and update service rates.
            </p>
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-brand-500 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-brand-500" />
              <span>Admin Service Dashboard</span>
            </button>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {settings?.business_name || 'Precision Auto Repair'}. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
