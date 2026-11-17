import { BusinessHours, BlockedDate, Appointment, BusinessSettings, Service, TimeSlot } from '../types/database';

/**
 * Format a Date object to YYYY-MM-DD local string safely
 */
export function formatDateToYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a Date object to HH:mm:ss local string safely
 */
export function formatTimeToHMS(d: Date): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format a Date object to readable time label, e.g. "09:00 AM"
 */
export function formatTimeForDisplay(d: Date): string {
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const minStr = minutes < 10 ? '0' + minutes : String(minutes);
  return `${hours}:${minStr} ${ampm}`;
}

/**
 * Parse time string "HH:mm:ss" or "HH:mm" on a given base Date
 */
export function parseTimeToDate(baseDate: Date, timeStr: string): Date {
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  const s = parseInt(parts[2], 10) || 0;

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    h,
    m,
    s,
    0
  );
}

/**
 * Check if a date is blocked
 */
export function isDateBlocked(date: Date, blockedDates: BlockedDate[]): { isBlocked: boolean; reason?: string } {
  const dateStr = formatDateToYMD(date);
  const match = blockedDates.find((b) => b.blocked_date === dateStr);
  if (match) {
    return { isBlocked: true, reason: match.reason || 'Closed / Scheduled Maintenance' };
  }
  return { isBlocked: false };
}

/**
 * Calculate available time slots for a given date, service, business settings, and appointments
 */
export function calculateAvailableSlots(params: {
  selectedDate: Date;
  service: Service;
  businessHours: BusinessHours[];
  blockedDates: BlockedDate[];
  existingAppointments: Appointment[];
  settings: BusinessSettings;
  now?: Date;
}): TimeSlot[] {
  const {
    selectedDate,
    service,
    businessHours,
    blockedDates,
    existingAppointments,
    settings,
    now = new Date(),
  } = params;

  // 1. Check if date is blocked
  if (isDateBlocked(selectedDate, blockedDates).isBlocked) {
    return [];
  }

  // 2. Check business hours for this weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const weekday = selectedDate.getDay();
  const daySchedule = businessHours.find((h) => h.weekday === weekday);

  if (!daySchedule || !daySchedule.is_open || !daySchedule.start_time || !daySchedule.end_time) {
    return [];
  }

  // 3. Determine business open and close times for the selected date
  const dayStart = parseTimeToDate(selectedDate, daySchedule.start_time);
  const dayEnd = parseTimeToDate(selectedDate, daySchedule.end_time);

  // 4. Booking notice cutoff (now + booking_notice_hours)
  const noticeHours = settings.booking_notice_hours ?? 2;
  const noticeCutoff = new Date(now.getTime() + noticeHours * 60 * 60 * 1000);

  // 5. Existing active appointments on the selected date
  const dateStr = formatDateToYMD(selectedDate);
  const dayAppointments = existingAppointments.filter((app) => {
    if (app.status === 'cancelled') return false;
    return app.appointment_date === dateStr;
  });

  // Convert dayAppointments to Date ranges
  const bookedRanges = dayAppointments.map((app) => {
    const start = parseTimeToDate(selectedDate, app.start_time);
    const end = parseTimeToDate(selectedDate, app.end_time);
    return { start, end };
  });

  const slots: TimeSlot[] = [];
  const slotIntervalMinutes = Math.max(15, settings.slot_interval_minutes || 30);
  const serviceDurationMinutes = Math.max(15, service.duration_minutes || 30);

  // Step through time from dayStart until dayEnd
  let currentStart = new Date(dayStart.getTime());

  while (true) {
    const currentEnd = new Date(currentStart.getTime() + serviceDurationMinutes * 60 * 1000);

    // Stop if the service would end after business hours
    if (currentEnd.getTime() > dayEnd.getTime()) {
      break;
    }

    // Check booking notice rule: slot_start must be >= noticeCutoff
    const satisfiesNotice = currentStart.getTime() >= noticeCutoff.getTime();

    if (satisfiesNotice) {
      // Check overlap rule:
      // Overlap occurs when: new_start < existing_end AND new_end > existing_start
      const hasOverlap = bookedRanges.some((range) => {
        return (
          currentStart.getTime() < range.end.getTime() &&
          currentEnd.getTime() > range.start.getTime()
        );
      });

      if (!hasOverlap) {
        slots.push({
          start: new Date(currentStart.getTime()),
          end: new Date(currentEnd.getTime()),
          label: `${formatTimeForDisplay(currentStart)} – ${formatTimeForDisplay(currentEnd)}`,
          startTimeString: formatTimeToHMS(currentStart),
          endTimeString: formatTimeToHMS(currentEnd),
        });
      }
    }

    // Advance by slot interval
    currentStart = new Date(currentStart.getTime() + slotIntervalMinutes * 60 * 1000);
  }

  return slots;
}
