import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { Scene } from './three/Scene';
import { ActivePart } from './three/config';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { WhyUsSection } from './components/public/WhyUsSection';
import { BookingSection } from './components/public/BookingSection';
import { Footer } from './components/public/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { Service } from './types/database';

function MainApp() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [currentStation, setCurrentStation] = useState<'hero' | 'services' | 'about' | 'booking' | 'footer'>('hero');
  const [activePart, setActivePart] = useState<ActivePart>('none');
  const { setSelectedServiceForBooking } = useShop();

  // Scroll listener to update 3D camera station smoothly
  useEffect(() => {
    if (viewMode !== 'public') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;

      const heroEl = document.getElementById('hero');
      const servicesEl = document.getElementById('services');
      const aboutEl = document.getElementById('about');
      const bookingEl = document.getElementById('booking');

      const heroTop = heroEl ? heroEl.offsetTop : 0;
      const servicesTop = servicesEl ? servicesEl.offsetTop - windowH * 0.4 : 600;
      const aboutTop = aboutEl ? aboutEl.offsetTop - windowH * 0.4 : 1400;
      const bookingTop = bookingEl ? bookingEl.offsetTop - windowH * 0.4 : 2200;

      if (scrollY < servicesTop) {
        setCurrentStation('hero');
      } else if (scrollY >= servicesTop && scrollY < aboutTop) {
        setCurrentStation('services');
      } else if (scrollY >= aboutTop && scrollY < bookingTop) {
        setCurrentStation('about');
      } else {
        setCurrentStation('booking');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  // Pre-select service and scroll down to booking
  const handleSelectServiceFromCard = (service: Service) => {
    setSelectedServiceForBooking(service);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (viewMode === 'admin') {
    return <AdminPortal onBackToSite={() => setViewMode('public')} />;
  }

  return (
    <div className="relative min-h-screen bg-[#070a10] text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Interactive 3D Workshop Canvas Layer behind HTML content */}
      <Scene currentStation={currentStation} activePart={activePart} />

      {/* HTML Content Layer that scrolls gracefully over the 3D scene */}
      <div className="relative z-10">
        <Navbar
          onOpenAdmin={() => setViewMode('admin')}
          onNavigateSection={scrollToSection}
        />

        <Hero
          onBookClick={() => scrollToSection('booking')}
          onExploreServices={() => scrollToSection('services')}
        />

        <ServicesSection
          onSelectService={handleSelectServiceFromCard}
          onHoverPart={setActivePart}
        />

        <AboutSection />

        <WhyUsSection />

        <BookingSection />

        <Footer onOpenAdmin={() => setViewMode('admin')} />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ShopProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ShopProvider>
  );
}

export default App;
