import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BusinessHours } from '../../types/database';
import { supabase } from '../../lib/supabase';

const WEEKDAYS = [
  { index: 0, name: 'Sunday' },
  { index: 1, name: 'Monday' },
  { index: 2, name: 'Tuesday' },
  { index: 3, name: 'Wednesday' },
  { index: 4, name: 'Thursday' },
  { index: 5, name: 'Friday' },
  { index: 6, name: 'Saturday' },
];

export const BusinessHoursPage: React.FC = () => {
  const { businessHours, refreshData } = useShop();

  const [localHours, setLocalHours] = useState<BusinessHours[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Sort by weekday 0-6
    const sorted = [...businessHours].sort((a, b) => a.weekday - b.weekday);
    setLocalHours(sorted);
  }, [businessHours]);

  const handleToggleOpen = (weekday: number) => {
    setLocalHours((prev) =>
      prev.map((h) => {
        if (h.weekday === weekday) {
          const newIsOpen = !h.is_open;
          return {
            ...h,
            is_open: newIsOpen,
            start_time: newIsOpen ? (h.start_time || '08:00:00') : null,
            end_time: newIsOpen ? (h.end_time || '18:00:00') : null,
          };
        }
        return h;
      })
    );
  };

  const handleTimeChange = (weekday: number, field: 'start_time' | 'end_time', value: string) => {
    // Ensure seconds are included, e.g. "08:00" -> "08:00:00"
    const formatted = value.length === 5 ? `${value}:00` : value;

    setLocalHours((prev) =>
      prev.map((h) => {
        if (h.weekday === weekday) {
          return { ...h, [field]: formatted };
        }
        return h;
      })
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Update each row in Supabase
      for (const item of localHours) {
        const { error } = await supabase
          .from('business_hours')
          .update({
            is_open: item.is_open,
            start_time: item.is_open ? item.start_time : null,
            end_time: item.is_open ? item.end_time : null,
          })
          .eq('id', item.id);

        if (error) throw error;
      }

      setSaveSuccess(true);
      await refreshData();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to save business hours:', err);
      setSaveError(err?.message || 'Error updating business hours');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
            Workshop Operating Hours
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Configure open days and shop operating hours. Slots are generated dynamically based on these schedules.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-glow-red transition-all cursor-pointer"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving Changes...' : 'Save All Hours'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Workshop operating hours updated successfully! All booking slots recalculated.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Weekday Cards List */}
      <div className="space-y-3">
        {WEEKDAYS.map((day) => {
          const entry = localHours.find((h) => h.weekday === day.index);
          const isOpen = entry ? entry.is_open : false;
          const startTime = entry?.start_time ? entry.start_time.slice(0, 5) : '08:00';
          const endTime = entry?.end_time ? entry.end_time.slice(0, 5) : '18:00';

          return (
            <div
              key={day.index}
              className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isOpen ? 'border-white/10' : 'border-slate-800/60 bg-slate-950/40 opacity-70'
              }`}
            >
              <div className="flex items-center space-x-4 min-w-[160px]">
                <button
                  type="button"
                  onClick={() => handleToggleOpen(day.index)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isOpen ? 'bg-brand-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isOpen ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div>
                  <h4 className="font-display font-bold text-white text-base uppercase">
                    {day.name}
                  </h4>
                  <span
                    className={`text-[11px] font-mono font-semibold uppercase ${
                      isOpen ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {isOpen ? 'Open for Service' : 'Closed / Bay Offline'}
                  </span>
                </div>
              </div>

              {isOpen && (
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] uppercase font-mono text-slate-400">Open:</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => handleTimeChange(day.index, 'start_time', e.target.value)}
                      className="bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <span className="text-slate-500 font-mono text-xs">to</span>

                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] uppercase font-mono text-slate-400">Close:</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => handleTimeChange(day.index, 'end_time', e.target.value)}
                      className="bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
