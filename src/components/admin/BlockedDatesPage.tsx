import React, { useState } from 'react';
import {
  CalendarOff,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { supabase } from '../../lib/supabase';
import { formatDateToYMD } from '../../lib/availability';

export const BlockedDatesPage: React.FC = () => {
  const { blockedDates, refreshData } = useShop();

  const [dateInput, setDateInput] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatDateToYMD(d);
  });
  const [reasonInput, setReasonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput) {
      setErrorMsg('Please select a valid date.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.from('blocked_dates').insert({
        blocked_date: dateInput,
        reason: reasonInput.trim() || 'Scheduled Workshop Maintenance',
      });

      if (error) throw error;

      setSuccessMsg(`Date ${dateInput} has been blocked from all appointment bookings.`);
      setReasonInput('');
      await refreshData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to block date:', err);
      setErrorMsg(err?.message || 'Error blocking date');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveBlockedDate = async (id: string, dateStr: string) => {
    if (!confirm(`Are you sure you want to unblock ${dateStr}?`)) return;

    try {
      const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
      if (error) throw error;
      refreshData();
    } catch (err: any) {
      alert(`Failed to remove blocked date: ${err?.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
          Blocked Dates & Shop Closures
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Black out holidays, staff training days, or facility lift maintenance periods. Blocked dates prevent any appointment booking on the public website.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Add Blocked Date Form Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="font-display font-bold uppercase text-white text-base">
          Block a New Date
        </h3>

        <form onSubmit={handleAddBlockedDate} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Date to Block
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white transition-colors font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Reason / Public Notice
            </label>
            <input
              type="text"
              placeholder="e.g. Annual Hydraulic Lift Inspection"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 transition-colors"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-glow-red transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Block Date</span>
            </button>
          </div>
        </form>
      </div>

      {/* Blocked Dates List */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Currently Blocked Calendar Dates ({blockedDates.length})
          </span>
        </div>

        {blockedDates.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CalendarOff className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No dates currently blocked</p>
            <p className="text-xs text-slate-500">
              Your workshop is accepting appointments for all regular open business hours.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {blockedDates.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-white text-sm">
                      {item.blocked_date}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold uppercase">
                      Bay Closed
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {item.reason || 'Closed / Maintenance'}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveBlockedDate(item.id, item.blocked_date)}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                  title="Unblock this date"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
