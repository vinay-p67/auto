import React, { useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle,
  Wrench,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AppointmentStatus } from '../../types/database';
import { supabase } from '../../lib/supabase';
import { AdminTab } from './AdminLayout';

interface OverviewPageProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigateTab }) => {
  const { appointments, services, settings, refreshData } = useShop();

  // Metrics
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const completed = appointments.filter((a) => a.status === 'completed').length;
    const activeServicesCount = services.filter((s) => s.is_active).length;

    // Potential revenue from non-cancelled appointments
    const revenue = appointments
      .filter((a) => a.status !== 'cancelled')
      .reduce((acc, a) => {
        const s = services.find((srv) => srv.id === a.service_id);
        return acc + (s ? Number(s.price) : 0);
      }, 0);

    return { total, pending, confirmed, completed, activeServicesCount, revenue };
  }, [appointments, services]);

  // Upcoming appointments (sorted by date/time, excluding completed/cancelled)
  const upcomingAppointments = useMemo(() => {
    return [...appointments]
      .filter((a) => a.status === 'pending' || a.status === 'confirmed')
      .sort((a, b) => {
        const dateA = new Date(`${a.appointment_date}T${a.start_time}`).getTime();
        const dateB = new Date(`${b.appointment_date}T${b.start_time}`).getTime();
        return dateA - dateB;
      })
      .slice(0, 5);
  }, [appointments]);

  const handleQuickStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (!error) {
        refreshData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
            Service Workshop Overview
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time shop metrics, technician bay activity, and service revenue.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('appointments')}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-glow-red transition-all cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Manage All Bookings</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-mono font-semibold">Total Appointments</span>
            <CalendarDays className="w-4 h-4 text-brand-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-display text-3xl font-extrabold text-white font-mono">
              {stats.total}
            </span>
            <span className="text-xs text-slate-400">logged</span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="glass-card p-5 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex justify-between items-center text-amber-400">
            <span className="text-xs uppercase font-mono font-semibold">Pending Bay Slots</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-display text-3xl font-extrabold text-amber-400 font-mono">
              {stats.pending}
            </span>
            <span className="text-xs text-slate-400">awaiting check</span>
          </div>
        </div>

        {/* Confirmed / Completed */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-2">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs uppercase font-mono font-semibold">Confirmed / In-Progress</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-display text-3xl font-extrabold text-emerald-400 font-mono">
              {stats.confirmed}
            </span>
            <span className="text-xs text-slate-400">scheduled</span>
          </div>
        </div>

        {/* Potential Scheduled Revenue */}
        <div className="glass-card p-5 rounded-2xl border border-blue-500/20 space-y-2">
          <div className="flex justify-between items-center text-blue-400">
            <span className="text-xs uppercase font-mono font-semibold">Booked Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-display text-3xl font-extrabold text-white font-mono">
              ${stats.revenue.toFixed(2)}
            </span>
            <span className="text-xs text-blue-400 font-medium">pipeline</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Schedule + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 cols: Upcoming Schedule */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold uppercase text-white text-lg">
              Immediate Bay Queue
            </h3>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1"
            >
              <span>View All ({appointments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CalendarDays className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No active appointments queued</p>
                <p className="text-xs text-slate-500">
                  New appointment bookings from the public website will show here automatically.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {upcomingAppointments.map((app) => {
                  const service = services.find((s) => s.id === app.service_id);

                  return (
                    <div
                      key={app.id}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-sm">
                            {app.full_name}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                              app.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center space-x-2">
                          <span className="text-brand-400 font-medium">
                            {service ? service.name : 'Auto Service'}
                          </span>
                          <span>&bull;</span>
                          <span className="font-mono">{app.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right font-mono text-xs">
                          <span className="text-slate-200 block font-semibold">
                            {app.appointment_date}
                          </span>
                          <span className="text-slate-400 block text-[11px]">
                            {app.start_time.slice(0, 5)} - {app.end_time.slice(0, 5)}
                          </span>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex items-center space-x-1.5">
                          {app.status === 'pending' && (
                            <button
                              onClick={() => handleQuickStatusChange(app.id, 'confirmed')}
                              className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-semibold uppercase tracking-wider"
                            >
                              Confirm
                            </button>
                          )}
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => handleQuickStatusChange(app.id, 'completed')}
                              className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-semibold uppercase tracking-wider"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 cols: Workshop Quick Links & Health */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-display font-bold uppercase text-white text-lg">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => onNavigateTab('services')}
              className="w-full text-left glass-card p-4 rounded-xl border border-white/5 hover:border-brand-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                    Manage Services
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {stats.activeServicesCount} active service offerings
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => onNavigateTab('hours')}
              className="w-full text-left glass-card p-4 rounded-xl border border-white/5 hover:border-brand-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                    Operating Hours
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Set weekday opening & closing times
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => onNavigateTab('blocked-dates')}
              className="w-full text-left glass-card p-4 rounded-xl border border-white/5 hover:border-brand-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                    Blocked Dates
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Black out holidays or maintenance days
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => onNavigateTab('settings')}
              className="w-full text-left glass-card p-4 rounded-xl border border-white/5 hover:border-brand-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                    Shop Settings
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Address, contact phone, slot interval
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
