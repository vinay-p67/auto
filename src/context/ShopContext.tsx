import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Service, BusinessHours, BlockedDate, BusinessSettings, Appointment } from '../types/database';

interface ShopContextType {
  settings: BusinessSettings | null;
  services: Service[];
  activeServices: Service[];
  businessHours: BusinessHours[];
  blockedDates: BlockedDate[];
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  selectedServiceForBooking: Service | null;
  setSelectedServiceForBooking: (service: Service | null) => void;
}

const defaultSettings: BusinessSettings = {
  id: 'default',
  business_name: 'Precision Auto Repair',
  business_email: 'service@precisionautorepair.com',
  business_phone: '+1 (555) 782-9347',
  business_address: '428 Master Tech Parkway, Automotive District, NY 10001',
  slot_interval_minutes: 30,
  booking_notice_hours: 2,
  created_at: new Date().toISOString(),
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch business_settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('business_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (settingsError) {
        console.warn('Error fetching business_settings:', settingsError);
      }
      setSettings(settingsData || defaultSettings);

      // 2. Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });

      if (servicesError) {
        console.warn('Error fetching services:', servicesError);
      } else if (servicesData) {
        setServices(servicesData);
      }

      // 3. Fetch business_hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('business_hours')
        .select('*')
        .order('weekday', { ascending: true });

      if (hoursError) {
        console.warn('Error fetching business_hours:', hoursError);
      } else if (hoursData) {
        setBusinessHours(hoursData);
      }

      // 4. Fetch blocked_dates
      const { data: blockedData, error: blockedError } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true });

      if (blockedError) {
        console.warn('Error fetching blocked_dates:', blockedError);
      } else if (blockedData) {
        setBlockedDates(blockedData);
      }

      // 5. Try fetching appointments (for slot calculation if authenticated or public allowed)
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .neq('status', 'cancelled');

      if (appointmentsData) {
        setAppointments(appointmentsData);
      }
    } catch (err: any) {
      console.error('Failed to load shop configuration:', err);
      setError(err?.message || 'Failed to load shop configuration');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeServices = services.filter((s) => s.is_active);

  return (
    <ShopContext.Provider
      value={{
        settings: settings || defaultSettings,
        services,
        activeServices,
        businessHours,
        blockedDates,
        appointments,
        isLoading,
        error,
        refreshData: fetchData,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
