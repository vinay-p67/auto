import React, { useState, useEffect } from 'react';
import { Wrench, Phone, Calendar, Shield, Clock, Menu, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface NavbarProps {
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onNavigateSection }) => {
  const { settings, businessHours } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check today's status
  const todayWeekday = new Date().getDay();
  const todayHours = businessHours.find((h) => h.weekday === todayWeekday);
  const isOpenToday = todayHours ? todayHours.is_open : true;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070a10]/85 backdrop-blur-md border-b border-white/10 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => scrollTo('hero')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-glow-red transition-transform group-hover:scale-105">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-wider uppercase text-white block leading-none">
                {settings?.business_name || 'Precision Auto'}
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium mt-1 block">
                Master Craft Vehicle Center
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollTo('services')}
              className="hover:text-brand-400 transition-colors py-1 cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="hover:text-brand-400 transition-colors py-1 cursor-pointer"
            >
              Workshop
            </button>
            <button
              onClick={() => scrollTo('why-us')}
              className="hover:text-brand-400 transition-colors py-1 cursor-pointer"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="hover:text-brand-400 transition-colors py-1 cursor-pointer"
            >
              Schedule Bay
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Live Status indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpenToday ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300">
                {isOpenToday ? (
                  <>
                    Open Today{' '}
                    <span className="text-slate-400 font-mono text-[11px]">
                      {todayHours?.start_time ? todayHours.start_time.slice(0, 5) : '08:00'} -{' '}
                      {todayHours?.end_time ? todayHours.end_time.slice(0, 5) : '18:00'}
                    </span>
                  </>
                ) : (
                  'Closed Today'
                )}
              </span>
            </div>

            {/* Direct Phone */}
            {settings?.business_phone && (
              <a
                href={`tel:${settings.business_phone}`}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-white/5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brand-500" />
                <span>{settings.business_phone}</span>
              </a>
            )}

            {/* Primary Book CTA */}
            <button
              onClick={() => scrollTo('booking')}
              className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-glow-red hover:shadow-glow-red transition-all transform active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={onOpenAdmin}
              title="Admin Service Portal"
              className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => scrollTo('booking')}
              className="bg-brand-600 text-white text-xs font-bold uppercase px-3 py-2 rounded-lg"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0e17] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 mt-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollTo('services')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-800"
            >
              Services & Pricing
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-800"
            >
              Workshop & Technology
            </button>
            <button
              onClick={() => scrollTo('why-us')}
              className="text-left px-3 py-2 rounded-md hover:bg-slate-800"
            >
              Why Choose Us
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="text-left px-3 py-2 rounded-md bg-brand-600/20 text-brand-400 font-semibold"
            >
              Book Service Appointment
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <a href={`tel:${settings?.business_phone}`} className="flex items-center space-x-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-brand-500" />
              <span>{settings?.business_phone}</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center space-x-1.5 text-slate-400 hover:text-white"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
