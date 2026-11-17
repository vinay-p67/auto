import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Mail,
  FileText,
  User,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { AppointmentStatus, Appointment } from '../../types/database';
import { supabase } from '../../lib/supabase';

export const AppointmentsPage: React.FC = () => {
  const { appointments, services, refreshData } = useShop();

  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Filtered & searched appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // Status filter
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = app.full_name.toLowerCase().includes(q);
        const matchesEmail = app.email.toLowerCase().includes(q);
        const matchesPhone = app.phone.toLowerCase().includes(q);
        const matchesNotes = app.notes ? app.notes.toLowerCase().includes(q) : false;
        return matchesName || matchesEmail || matchesPhone || matchesNotes;
      }
      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert(`Error updating appointment status: ${error.message}`);
      } else {
        refreshData();
        if (selectedAppointment?.id === id) {
          setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err: any) {
      alert(`Failed to update status: ${err?.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            <span className="uppercase">Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span className="uppercase">Pending</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle className="w-3 h-3" />
            <span className="uppercase">Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            <span className="uppercase">Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
            Appointment Management
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Review customer bookings, assign technician bays, and update service progress.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, phone, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Appointments Table / List */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase">No appointments found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no appointments matching the current filter criteria or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase font-mono font-bold text-slate-400">
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAppointments.map((app) => {
                  const service = services.find((s) => s.id === app.service_id);
                  const isUpdating = updatingId === app.id;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedAppointment(app)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Client */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white text-sm">
                          {app.full_name}
                        </div>
                        {app.notes && (
                          <div className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                            "{app.notes}"
                          </div>
                        )}
                      </td>

                      {/* Service */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-200">
                          {service ? service.name : 'Unknown Service'}
                        </div>
                        <div className="text-[11px] font-mono text-brand-400">
                          ${service ? Number(service.price).toFixed(2) : '0.00'} &bull; {service?.duration_minutes}m
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 font-mono">
                        <div className="text-slate-200 font-bold">
                          {app.appointment_date}
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          {app.start_time.slice(0, 5)} - {app.end_time.slice(0, 5)}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-mono text-slate-300">{app.phone}</div>
                        <div className="text-slate-400 text-[11px]">{app.email}</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-4 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          disabled={isUpdating}
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateStatus(app.id, e.target.value as AppointmentStatus)
                          }
                          className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:border-brand-500 font-semibold uppercase tracking-wider"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal / Drawer */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Appointment Details
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-white mt-0.5">
                  {selectedAppointment.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="glass-panel p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400">Date</span>
                <p className="font-bold text-white font-mono text-sm">
                  {selectedAppointment.appointment_date}
                </p>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400">Time Window</span>
                <p className="font-bold text-brand-400 font-mono text-sm">
                  {selectedAppointment.start_time.slice(0, 5)} - {selectedAppointment.end_time.slice(0, 5)}
                </p>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400">Phone</span>
                <p className="font-semibold text-slate-200 font-mono">
                  {selectedAppointment.phone}
                </p>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400">Email</span>
                <p className="font-semibold text-slate-200 truncate">
                  {selectedAppointment.email}
                </p>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Client Vehicle Notes & Issues
                </span>
                <p className="text-slate-200 leading-relaxed italic">
                  {selectedAppointment.notes}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Change Status:</span>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedAppointment.id, e.target.value as AppointmentStatus)
                  }
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 font-semibold uppercase tracking-wider"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold uppercase px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
