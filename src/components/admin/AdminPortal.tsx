import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout, AdminTab } from './AdminLayout';
import { OverviewPage } from './OverviewPage';
import { AppointmentsPage } from './AppointmentsPage';
import { ServicesPage } from './ServicesPage';
import { BusinessHoursPage } from './BusinessHoursPage';
import { BlockedDatesPage } from './BlockedDatesPage';
import { BusinessSettingsPage } from './BusinessSettingsPage';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite }) => {
  const { user, isAdmin, isCheckingAuth } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // If verifying or not authorized as admin yet, show AdminLogin
  if (isCheckingAuth || !user || !isAdmin) {
    return <AdminLogin onBackToSite={onBackToSite} />;
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onBackToSite={onBackToSite}
    >
      {currentTab === 'overview' && (
        <OverviewPage onNavigateTab={setCurrentTab} />
      )}
      {currentTab === 'appointments' && <AppointmentsPage />}
      {currentTab === 'services' && <ServicesPage />}
      {currentTab === 'hours' && <BusinessHoursPage />}
      {currentTab === 'blocked-dates' && <BlockedDatesPage />}
      {currentTab === 'settings' && <BusinessSettingsPage />}
    </AdminLayout>
  );
};
