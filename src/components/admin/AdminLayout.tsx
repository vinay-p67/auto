import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Clock,
  CalendarOff,
  SlidersHorizontal,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';

export type AdminTab = 'overview' | 'appointments' | 'services' | 'hours' | 'blocked-dates' | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onBackToSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onBackToSite,
  children,
}) => {
  const { user, signOut } = useAuth();
  const { settings } = useShop();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'appointments' as AdminTab, label: 'Appointments', icon: CalendarDays },
    { id: 'services' as AdminTab, label: 'Services', icon: Wrench },
    { id: 'hours' as AdminTab, label: 'Business Hours', icon: Clock },
    { id: 'blocked-dates' as AdminTab, label: 'Blocked Dates', icon: CalendarOff },
    { id: 'settings' as AdminTab, label: 'Business Settings', icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0e17] border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-display font-bold uppercase text-white text-sm">
            {settings?.business_name || 'Precision Admin'}
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between transform transition-transform duration-200 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-glow-red">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h1 className="font-display font-extrabold uppercase text-white tracking-wide text-base truncate">
                  {settings?.business_name || 'Precision Auto'}
                </h1>
                <div className="flex items-center space-x-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                    Master Portal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-glow-red'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Auth Controls */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* User Email Pill */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <User className="w-4 h-4 text-brand-400 shrink-0" />
            <div className="overflow-hidden">
              <span className="block text-slate-300 truncate font-mono text-[11px]">
                {user?.email || 'admin@shop.com'}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">Verified Admin</span>
            </div>
          </div>

          {/* Return to website */}
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
};
