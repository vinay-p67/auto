export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  // Joined or referenced service
  service?: Service;
}

export interface BusinessHours {
  id: string;
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  is_open: boolean;
  start_time: string | null; // HH:mm:ss
  end_time: string | null; // HH:mm:ss
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string | null;
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
  startTimeString: string; // HH:mm:ss
  endTimeString: string; // HH:mm:ss
}

export interface BookingFormData {
  serviceId: string;
  date: Date;
  slot: TimeSlot;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}
