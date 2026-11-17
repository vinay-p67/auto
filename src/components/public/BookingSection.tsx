import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  Wrench,
  DollarSign,
  Download,
  RotateCcw,
  Sparkles,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../../context/ShopContext';
import { Service, TimeSlot } from '../../types/database';
import {
  calculateAvailableSlots,
  formatDateToYMD,
  formatTimeForDisplay,
  isDateBlocked,
} from '../../lib/availability';
import { supabase } from '../../lib/supabase';
import { getServiceImage } from '../../config/images';

export const BookingSection: React.FC = () => {
  const {
    settings,
    activeServices,
    businessHours,
    blockedDates,
    appointments,
    refreshData,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
  } = useShop();

  // Booking Flow Steps: 1 = Service, 2 = Date & Time, 3 = Details, 4 = Confirmed Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Customer Contact Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Confirmed booking summary stored locally for Step 4
  const [confirmedBooking, setConfirmedBooking] = useState<{
    service: Service;
    date: Date;
    slot: TimeSlot;
    fullName: string;
    email: string;
    phone: string;
    notes: string;
  } | null>(null);

  // Sync if context pre-selected a service from the cards above
  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedService(selectedServiceForBooking);
      setStep(2); // Advance to date/time selection
      setSelectedServiceForBooking(null);
    } else if (!selectedService && activeServices.length > 0) {
      setSelectedService(activeServices[0]);
    }
  }, [selectedServiceForBooking, activeServices, selectedService, setSelectedServiceForBooking]);

  // Compute available dates (next 21 days)
  const dateOptions = useMemo(() => {
    const dates: { date: Date; isBlocked: boolean; blockReason?: string; isOpen: boolean }[] = [];
    const today = new Date();

    for (let i = 1; i <= 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const blockedCheck = isDateBlocked(d, blockedDates);
      const weekday = d.getDay();
      const hours = businessHours.find((h) => h.weekday === weekday);
      const isOpen = !!(hours && hours.is_open && hours.start_time && hours.end_time);

      dates.push({
        date: d,
        isBlocked: blockedCheck.isBlocked,
        blockReason: blockedCheck.reason,
        isOpen,
      });
    }
    return dates;
  }, [blockedDates, businessHours]);

  // Calculate live available time slots for the currently selected date and service
  const availableSlots = useMemo(() => {
    if (!selectedService || !settings) return [];

    return calculateAvailableSlots({
      selectedDate,
      service: selectedService,
      businessHours,
      blockedDates,
      existingAppointments: appointments,
      settings,
      now: new Date(),
    });
  }, [selectedDate, selectedService, businessHours, blockedDates, appointments, settings]);

  // Clear slot if date or service changes and selected slot is invalid
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate, selectedService]);

  // Handle appointment submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot || !fullName.trim() || !email.trim() || !phone.trim()) {
      setSubmitError('Please complete all required contact details.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const appointmentDateStr = formatDateToYMD(selectedDate);
      const startTimeStr = selectedSlot.startTimeString;
      const endTimeStr = selectedSlot.endTimeString;

      // CRITICAL RULE:
      // Do not use .insert(...).select() or .insert(...).select().single()
      // Public users have insert permissions, not read all appointments permissions.
      const { error: insertError } = await supabase.from('appointments').insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service_id: selectedService.id,
        appointment_date: appointmentDateStr,
        start_time: startTimeStr,
        end_time: endTimeStr,
        status: 'pending',
        notes: notes.trim() || null,
      });

      if (insertError) {
        throw new Error(insertError.message || 'Failed to schedule appointment in database');
      }

      // Store local booking state for the success confirmation view
      setConfirmedBooking({
        service: selectedService,
        date: new Date(selectedDate),
        slot: selectedSlot,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      });

      // Advance to Step 4 (Success state)
      setStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e63946', '#ffffff', '#38bdf8', '#f59e0b'],
      });

      // Refresh background data
      refreshData();
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setSubmitError(err?.message || 'We could not confirm your appointment slot. Please try another time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset booking form to make another appointment
  const handleResetForm = () => {
    setConfirmedBooking(null);
    setStep(1);
    setSelectedSlot(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSubmitError(null);
  };

  // Download .ics calendar invite
  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    const { service, slot, date } = confirmedBooking;
    const startIso = slot.start.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = slot.end.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Precision Auto Repair//Service Booking//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${service.name} - ${settings?.business_name || 'Precision Auto Repair'}`,
      `DESCRIPTION:${service.description}\\nService Duration: ${service.duration_minutes} mins\\nEstimated Total: $${Number(service.price).toFixed(2)}`,
      `LOCATION:${settings?.business_address || 'Service Bay'}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Precision_Auto_${service.name.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="booking" className="relative py-24 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Real-Time Bay Availability</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Schedule Your Service
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Select your maintenance service, pick an open bay slot, and receive immediate digital confirmation.
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        {step < 4 && (
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-brand-500 -translate-y-1/2 z-0 transition-all duration-300"
                style={{
                  width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                }}
              />

              {[
                { num: 1, label: '1. Select Service' },
                { num: 2, label: '2. Date & Time' },
                { num: 3, label: '3. Your Details' },
              ].map((s) => (
                <button
                  key={s.num}
                  onClick={() => {
                    if (s.num === 1) setStep(1);
                    if (s.num === 2 && selectedService) setStep(2);
                    if (s.num === 3 && selectedService && selectedSlot) setStep(3);
                  }}
                  className={`relative z-10 flex flex-col items-center cursor-pointer transition-all ${
                    step >= s.num ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs border transition-all ${
                      step === s.num
                        ? 'bg-brand-600 border-brand-400 text-white shadow-glow-red scale-110'
                        : step > s.num
                        ? 'bg-slate-900 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase mt-2 hidden sm:block">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Container Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-white">
                    Step 1: Choose Your Auto Service
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Select a maintenance package or diagnostic consultation
                  </p>
                </div>
                <span className="text-xs font-mono text-brand-400">
                  {activeServices.length} Active Services Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeServices.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  const img = getServiceImage(service.name);

                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex space-x-4 items-start ${
                        isSelected
                          ? 'bg-brand-950/40 border-brand-500 ring-1 ring-brand-500 shadow-glow-red'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-white text-base truncate">
                            {service.name}
                          </h4>
                          <span className="font-mono font-bold text-brand-400 text-sm ml-2">
                            ${Number(service.price).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 mt-2">
                          <Clock className="w-3 h-3 text-brand-500" />
                          <span>{service.duration_minutes} mins estimated</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-glow-red transition-all cursor-pointer"
                >
                  <span>Select Date & Time</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Date & Available Time Slot */}
          {step === 2 && selectedService && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-white">
                    Step 2: Select Date & Service Bay Slot
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Service: <span className="text-brand-400 font-semibold">{selectedService.name}</span> ({selectedService.duration_minutes} mins)
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Change Service</span>
                </button>
              </div>

              {/* Horizontal Scrollable Date Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  Select Appointment Date
                </label>
                <div className="flex space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                  {dateOptions.map(({ date, isBlocked, blockReason, isOpen }) => {
                    const isSelected = formatDateToYMD(date) === formatDateToYMD(selectedDate);
                    const isUnavailable = isBlocked || !isOpen;
                    const weekdayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                    const dayNum = date.getDate();

                    return (
                      <button
                        key={date.toISOString()}
                        disabled={isUnavailable}
                        onClick={() => setSelectedDate(date)}
                        title={isBlocked ? `Closed: ${blockReason}` : !isOpen ? 'Closed on this weekday' : undefined}
                        className={`flex flex-col items-center justify-center min-w-[76px] py-3.5 px-3 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-brand-600 border-brand-400 text-white shadow-glow-red scale-105'
                            : isUnavailable
                            ? 'bg-slate-950/40 border-slate-800/40 opacity-40 cursor-not-allowed text-slate-600'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                          {weekdayName}
                        </span>
                        <span className="text-lg font-mono font-extrabold my-0.5">
                          {dayNum}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {monthName}
                        </span>
                        {isBlocked && (
                          <span className="text-[9px] text-red-400 mt-1 font-semibold">Blocked</span>
                        )}
                        {!isOpen && !isBlocked && (
                          <span className="text-[9px] text-amber-500 mt-1 font-semibold">Closed</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Time Slots Grid */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Available Time Slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    {availableSlots.length} open slots
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                    <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">
                      No open slots available on this date
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      All technician bays may be booked, or the date violates the minimum booking notice ({settings?.booking_notice_hours || 2} hours). Please choose another date above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                    {availableSlots.map((slot, idx) => {
                      const isSelected = selectedSlot?.startTimeString === slot.startTimeString;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-mono text-xs ${
                            isSelected
                              ? 'bg-brand-600 border-brand-400 text-white shadow-glow-red font-bold'
                              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="block font-semibold">
                            {formatTimeForDisplay(slot.start)}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            until {formatTimeForDisplay(slot.end)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Services</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-glow-red transition-all cursor-pointer"
                >
                  <span>Enter Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Customer Details Form */}
          {step === 3 && selectedService && selectedSlot && (
            <form onSubmit={handleSubmitBooking} className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-white">
                    Step 3: Client & Vehicle Information
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    We will send appointment verification and live bay updates to these contact details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Change Time</span>
                </button>
              </div>

              {/* Live Reservation Summary Box */}
              <div className="glass-panel p-4 rounded-2xl border border-brand-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-display text-base font-bold text-white uppercase">
                      {selectedService.name}
                    </span>
                    <span className="text-xs font-mono text-brand-400 font-semibold px-2 py-0.5 rounded bg-brand-500/10">
                      ${Number(selectedService.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedSlot.label}</span>
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                  Bay Slot Reserved
                </span>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name <span className="text-brand-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address <span className="text-brand-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone Number <span className="text-brand-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Vehicle Details & Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      rows={3}
                      placeholder="e.g. 2021 Audi S4 - Squeaking sound when braking at low speed"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Time</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-xl shadow-glow-red transition-all transform active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirming Bay Slot...</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-4 h-4" />
                      <span>Confirm Appointment Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Confirmation Screen */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold block">
                  Appointment Successfully Scheduled
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase">
                  We Look Forward to Servicing Your Vehicle
                </h3>
                <p className="text-slate-300 text-sm max-w-xl mx-auto">
                  A confirmation summary has been registered for <span className="text-white font-semibold">{confirmedBooking.fullName}</span>. 
                  Our service desk has allocated technician bay space.
                </p>
              </div>

              {/* Complete Confirmation Summary Card */}
              <div className="max-w-xl mx-auto text-left glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <span className="text-xs font-mono uppercase text-slate-400">Scheduled Service</span>
                  <span className="font-display font-bold text-white uppercase text-base">
                    {confirmedBooking.service.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date</span>
                    <span className="text-slate-200 font-bold text-sm">
                      {confirmedBooking.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Time Window</span>
                    <span className="text-brand-400 font-bold text-sm">
                      {confirmedBooking.slot.label}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Service Rate</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ${Number(confirmedBooking.service.price).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Estimated Time</span>
                    <span className="text-slate-200 font-bold text-sm">
                      {confirmedBooking.service.duration_minutes} minutes
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{confirmedBooking.fullName} &bull; {confirmedBooking.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{confirmedBooking.email}</span>
                  </div>
                  {confirmedBooking.notes && (
                    <div className="flex items-start space-x-2 text-slate-400 pt-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="italic">{confirmedBooking.notes}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center space-x-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span>{settings?.business_address || 'Main Service Bay Center'}</span>
                </div>
              </div>

              {/* What Happens Next Guide */}
              <div className="max-w-xl mx-auto glass-panel p-4 rounded-xl text-left border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-bold block">
                  Next Steps
                </span>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Please arrive 5 to 10 minutes before your scheduled bay time.</li>
                  <li>Our technician will perform a live multi-point check with photographic notes.</li>
                  <li>No additional repair is executed without your direct digital approval.</li>
                </ul>
              </div>

              {/* Confirmation Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold uppercase px-5 py-3 rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-brand-400" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-glow-red transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Schedule Another Appointment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
