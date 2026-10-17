import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PatientsView } from './components/patients/PatientsView';
import { DoctorsView } from './components/doctors/DoctorsView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { ReceptionView } from './components/reception/ReceptionView';
import { LaboratoryView } from './components/laboratory/LaboratoryView';
import { BillingView } from './components/billing/BillingView';
import { NotificationsModal } from './components/notifications/NotificationsModal';

const HospitalAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main App Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar
          currentTab={currentTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        {/* Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={tab => setCurrentTab(tab)}
              onOpenNewPatient={() => setCurrentTab('patients')}
              onOpenNewAppointment={() => setCurrentTab('appointments')}
            />
          )}

          {currentTab === 'patients' && <PatientsView />}

          {currentTab === 'doctors' && <DoctorsView />}

          {currentTab === 'appointments' && <AppointmentsView />}

          {currentTab === 'reception' && <ReceptionView />}

          {currentTab === 'laboratory' && <LaboratoryView />}

          {currentTab === 'billing' && <BillingView />}

          {currentTab === 'notifications' && (
            <div className="space-y-4">
              <NotificationsModal onClose={() => setCurrentTab('dashboard')} />
            </div>
          )}
        </main>
      </div>

      {/* Global Notifications Modal */}
      {isNotificationsOpen && (
        <NotificationsModal onClose={() => setIsNotificationsOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <HospitalAppContent />
    </HospitalProvider>
  );
}
