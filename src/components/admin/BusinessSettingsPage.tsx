import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  CalendarCheck,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { supabase } from '../../lib/supabase';

export const BusinessSettingsPage: React.FC = () => {
  const { settings, refreshData } = useShop();

  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState(30);
  const [bookingNoticeHours, setBookingNoticeHours] = useState(2);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setBusinessName(settings.business_name || '');
      setBusinessEmail(settings.business_email || '');
      setBusinessPhone(settings.business_phone || '');
      setBusinessAddress(settings.business_address || '');
      setSlotIntervalMinutes(settings.slot_interval_minutes || 30);
      setBookingNoticeHours(settings.booking_notice_hours || 2);
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      if (settings?.id && settings.id !== 'default') {
        const { error } = await supabase
          .from('business_settings')
          .update({
            business_name: businessName.trim(),
            business_email: businessEmail.trim(),
            business_phone: businessPhone.trim(),
            business_address: businessAddress.trim(),
            slot_interval_minutes: Number(slotIntervalMinutes),
            booking_notice_hours: Number(bookingNoticeHours),
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('business_settings').insert({
          business_name: businessName.trim(),
          business_email: businessEmail.trim(),
          business_phone: businessPhone.trim(),
          business_address: businessAddress.trim(),
          slot_interval_minutes: Number(slotIntervalMinutes),
          booking_notice_hours: Number(bookingNoticeHours),
        });

        if (error) throw error;
      }

      setSaveSuccess(true);
      await refreshData();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to update business settings:', err);
      setSaveError(err?.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
          Auto Repair Business Settings
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Configure official auto repair shop details, public contact information, and appointment booking constraints.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Shop settings updated successfully! Public website and booking engine updated.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Settings Form Card */}
      <form onSubmit={handleSaveSettings} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        {/* Section 1: Business Identity */}
        <div>
          <h3 className="font-display font-bold uppercase text-white text-base mb-4 flex items-center space-x-2">
            <Building className="w-4 h-4 text-brand-400" />
            <span>Shop Identity & Public Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Shop Name (business_name) <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Precision Auto Repair"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Shop Email (business_email) <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="service@precisionautorepair.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Shop Phone (business_phone) <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 782-9347"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Shop Facility Address (business_address) <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="428 Master Tech Parkway, Automotive District, NY 10001"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Scheduling Rules */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="font-display font-bold uppercase text-white text-base mb-4 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Appointment Bay Logic & Interval Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Slot Interval (slot_interval_minutes)
              </label>
              <div className="relative">
                <select
                  value={slotIntervalMinutes}
                  onChange={(e) => setSlotIntervalMinutes(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-white transition-colors font-mono"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Interval frequency between bookable start times in open business hours.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Booking Notice (booking_notice_hours)
              </label>
              <div className="relative">
                <select
                  value={bookingNoticeHours}
                  onChange={(e) => setBookingNoticeHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-xs text-white transition-colors font-mono"
                >
                  <option value={1}>1 Hour Ahead</option>
                  <option value={2}>2 Hours Ahead (Default)</option>
                  <option value={4}>4 Hours Ahead</option>
                  <option value={12}>12 Hours Ahead</option>
                  <option value={24}>24 Hours Ahead (1 Day)</option>
                  <option value={48}>48 Hours Ahead (2 Days)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Minimum advance notice required before a customer can book a bay slot.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-glow-red transition-all cursor-pointer"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Updates...' : 'Save Business Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
