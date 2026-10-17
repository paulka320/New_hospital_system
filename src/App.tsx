import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { LoginView } from './components/auth/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { ReceptionDashboard } from './components/dashboard/ReceptionDashboard';
import { LabDashboard } from './components/dashboard/LabDashboard';
import { PharmacyDashboard } from './components/dashboard/PharmacyDashboard';
import { FinanceDashboard } from './components/dashboard/FinanceDashboard';
import { PatientsView } from './components/patients/PatientsView';
import { DoctorsView } from './components/doctors/DoctorsView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { NotificationsModal } from './components/notifications/NotificationsModal';

const HospitalAppContent: React.FC = () => {
  const { currentUser, isAuthenticated } = useHospital();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // If not authenticated, show the Login page
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Render role-specific dashboard for the current user
  const renderRoleDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'receptionist':
        return <ReceptionDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'lab_technician':
        return <LabDashboard />;
      case 'pharmacist':
        return <PharmacyDashboard />;
      case 'accountant':
        return <FinanceDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar with strict role isolation */}
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
          {currentTab === 'dashboard' && renderRoleDashboard()}

          {currentTab === 'patients' && <PatientsView />}

          {currentTab === 'doctors' && <DoctorsView />}

          {currentTab === 'appointments' && <AppointmentsView />}

          {currentTab === 'reception' && <ReceptionDashboard />}

          {currentTab === 'laboratory' && <LabDashboard />}

          {currentTab === 'billing' && <FinanceDashboard />}

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
