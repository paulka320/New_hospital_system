import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Patient,
  Doctor,
  DoctorAvailability,
  DoctorReview,
  Appointment,
  MedicalRecord,
  Visit,
  LaboratoryTest,
  Prescription,
  Bill,
  Notification,
  NotificationPreference,
  PaymentMethod,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_VISITS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_LAB_TESTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_BILLS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCTOR_AVAILABILITIES,
  INITIAL_DOCTOR_REVIEWS,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '../data/mockData';

interface HospitalContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  switchUser: (userId: string) => void;
  updateCurrentUser: (profile: Partial<UserProfile>) => void;

  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  doctors: Doctor[];
  addDoctor: (doc: Omit<Doctor, 'id' | 'createdAt' | 'totalPatients' | 'averageRating'>) => Doctor;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id' | 'createdAt'>) => Visit;
  updateVisit: (id: string, updates: Partial<Visit>) => void;

  medicalRecords: MedicalRecord[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => MedicalRecord;
  updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => void;

  labTests: LaboratoryTest[];
  addLabTest: (test: Omit<LaboratoryTest, 'id' | 'createdAt' | 'completed'>) => LaboratoryTest;
  updateLabTest: (id: string, updates: Partial<LaboratoryTest>) => void;
  completeLabTest: (id: string, result: string, notes?: string) => void;

  prescriptions: Prescription[];
  addPrescription: (rx: Omit<Prescription, 'id' | 'createdAt'>) => Prescription;
  updatePrescription: (id: string, updates: Partial<Prescription>) => void;
  markPrescriptionFilled: (id: string) => void;

  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'billNumber' | 'totalAmount' | 'subtotal'>) => Bill;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  payBill: (id: string, amount: number, paymentMethod: PaymentMethod, notes?: string) => void;

  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  notificationPreferences: NotificationPreference;
  updateNotificationPreferences: (pref: Partial<NotificationPreference>) => void;

  doctorAvailabilities: DoctorAvailability[];
  doctorReviews: DoctorReview[];
  addDoctorReview: (review: Omit<DoctorReview, 'id' | 'createdAt'>) => void;

  resetToDemoData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`hms_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
  }
  return defaultValue;
}

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<UserProfile[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadFromStorage('current_user_id', 'user-admin'));
  
  const [patients, setPatients] = useState<Patient[]>(() => loadFromStorage('patients', INITIAL_PATIENTS));
  const [doctors, setDoctors] = useState<Doctor[]>(() => loadFromStorage('doctors', INITIAL_DOCTORS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadFromStorage('appointments', INITIAL_APPOINTMENTS));
  const [visits, setVisits] = useState<Visit[]>(() => loadFromStorage('visits', INITIAL_VISITS));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => loadFromStorage('medical_records', INITIAL_MEDICAL_RECORDS));
  const [labTests, setLabTests] = useState<LaboratoryTest[]>(() => loadFromStorage('lab_tests', INITIAL_LAB_TESTS));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => loadFromStorage('prescriptions', INITIAL_PRESCRIPTIONS));
  const [bills, setBills] = useState<Bill[]>(() => loadFromStorage('bills', INITIAL_BILLS));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference>(() => loadFromStorage('notification_preferences', DEFAULT_NOTIFICATION_PREFERENCES));
  const [doctorAvailabilities] = useState<DoctorAvailability[]>(() => loadFromStorage('availabilities', INITIAL_DOCTOR_AVAILABILITIES));
  const [doctorReviews, setDoctorReviews] = useState<DoctorReview[]>(() => loadFromStorage('reviews', INITIAL_DOCTOR_REVIEWS));

  // Sync to storage
  useEffect(() => { localStorage.setItem('hms_current_user_id', JSON.stringify(currentUserId)); }, [currentUserId]);
  useEffect(() => { localStorage.setItem('hms_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('hms_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('hms_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('hms_visits', JSON.stringify(visits)); }, [visits]);
  useEffect(() => { localStorage.setItem('hms_medical_records', JSON.stringify(medicalRecords)); }, [medicalRecords]);
  useEffect(() => { localStorage.setItem('hms_lab_tests', JSON.stringify(labTests)); }, [labTests]);
  useEffect(() => { localStorage.setItem('hms_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('hms_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('hms_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('hms_notification_preferences', JSON.stringify(notificationPreferences)); }, [notificationPreferences]);
  useEffect(() => { localStorage.setItem('hms_reviews', JSON.stringify(doctorReviews)); }, [doctorReviews]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateCurrentUser = (profile: Partial<UserProfile>) => {
    // updates current user profile in session
  };

  // Patients
  const addPatient = (newPat: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `pat-${Date.now()}`;
    const now = new Date().toISOString();
    const created: Patient = {
      ...newPat,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setPatients(prev => [created, ...prev]);

    // Add notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      notificationType: 'general',
      title: 'New Patient Registered',
      message: `${created.name} registered into the hospital system.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
    return created;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    const now = new Date().toISOString();
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: now } : p))
    );
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    // cascade or keep records
  };

  // Doctors
  const addDoctor = (doc: Omit<Doctor, 'id' | 'createdAt' | 'totalPatients' | 'averageRating'>) => {
    const id = `doc-${Date.now()}`;
    const created: Doctor = {
      ...doc,
      id,
      totalPatients: 0,
      averageRating: 5.0,
      createdAt: new Date().toISOString(),
    };
    setDoctors(prev => [...prev, created]);
    return created;
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  // Appointments
  const addAppointment = (apt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `apt-${Date.now()}`;
    const now = new Date().toISOString();
    const created: Appointment = {
      ...apt,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setAppointments(prev => [created, ...prev]);

    const patient = patients.find(p => p.id === apt.patientId);
    const doctor = doctors.find(d => d.id === apt.doctorId);

    // Notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: doctor ? `user-doc-${doctor.id}` : 'user-admin',
      notificationType: 'appointment_confirmed',
      title: 'Appointment Scheduled',
      message: `Appointment scheduled for ${patient?.name || 'Patient'} with Dr. ${doctor?.name || 'Doctor'} on ${apt.date} at ${apt.time}.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
    return created;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const now = new Date().toISOString();
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates, updatedAt: now } : a))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const confirmAppointment = (id: string) => {
    updateAppointment(id, { status: 'confirmed' });
  };

  const cancelAppointment = (id: string, reason?: string) => {
    const now = new Date().toISOString();
    updateAppointment(id, {
      status: 'cancelled',
      cancelledReason: reason || 'Cancelled by staff or patient',
      cancelledAt: now,
    });
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    updateAppointment(id, {
      date: newDate,
      time: newTime,
      status: 'rescheduled',
    });
  };

  // Visits
  const addVisit = (visit: Omit<Visit, 'id' | 'createdAt'>) => {
    const id = `vis-${Date.now()}`;
    const now = new Date().toISOString();
    const created: Visit = {
      ...visit,
      id,
      createdAt: now,
    };
    setVisits(prev => [created, ...prev]);
    return created;
  };

  const updateVisit = (id: string, updates: Partial<Visit>) => {
    setVisits(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  // Medical Records
  const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
    const id = `rec-${Date.now()}`;
    const now = new Date().toISOString();
    const created: MedicalRecord = {
      ...record,
      id,
      createdAt: now,
    };
    setMedicalRecords(prev => [created, ...prev]);
    return created;
  };

  const updateMedicalRecord = (id: string, updates: Partial<MedicalRecord>) => {
    setMedicalRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Lab Tests
  const addLabTest = (test: Omit<LaboratoryTest, 'id' | 'createdAt' | 'completed'>) => {
    const id = `lab-${Date.now()}`;
    const now = new Date().toISOString();
    const created: LaboratoryTest = {
      ...test,
      id,
      completed: false,
      createdAt: now,
    };
    setLabTests(prev => [created, ...prev]);

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-lab',
      notificationType: 'general',
      title: 'New Lab Test Ordered',
      message: `${test.testType.toUpperCase()} test ordered.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
    return created;
  };

  const updateLabTest = (id: string, updates: Partial<LaboratoryTest>) => {
    setLabTests(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const completeLabTest = (id: string, result: string, notes?: string) => {
    const now = new Date().toISOString();
    setLabTests(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              completed: true,
              result,
              technicianNotes: notes || t.technicianNotes,
              completedDate: now,
            }
          : t
      )
    );

    const test = labTests.find(t => t.id === id);
    const patient = patients.find(p => p.id === test?.patientId);

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      notificationType: 'lab_result_ready',
      title: `Lab Result Ready: ${test?.testType.toUpperCase()}`,
      message: `Diagnostic result completed for patient ${patient?.name || 'Unknown'}.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Prescriptions
  const addPrescription = (rx: Omit<Prescription, 'id' | 'createdAt'>) => {
    const id = `rx-${Date.now()}`;
    const now = new Date().toISOString();
    const created: Prescription = {
      ...rx,
      id,
      createdAt: now,
    };
    setPrescriptions(prev => [created, ...prev]);
    return created;
  };

  const updatePrescription = (id: string, updates: Partial<Prescription>) => {
    setPrescriptions(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const markPrescriptionFilled = (id: string) => {
    const now = new Date().toISOString();
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: 'filled', filledAt: now } : p
      )
    );
  };

  // Bills
  const addBill = (bill: Omit<Bill, 'id' | 'createdAt' | 'billNumber' | 'totalAmount' | 'subtotal'>) => {
    const id = `bill-${Date.now()}`;
    const billNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const subtotal = bill.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const totalAmount = Math.max(0, subtotal + (bill.tax || 0) - (bill.discount || 0));

    const created: Bill = {
      ...bill,
      id,
      billNumber,
      subtotal,
      totalAmount,
      createdAt: now,
      issuedAt: now,
    };
    setBills(prev => [created, ...prev]);

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-accountant',
      notificationType: 'bill_issued',
      title: `Invoice Generated #${billNumber}`,
      message: `Invoice for $${totalAmount.toFixed(2)} generated.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
    return created;
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setBills(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const merged = { ...b, ...updates };
        const subtotal = merged.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        const totalAmount = Math.max(0, subtotal + (merged.tax || 0) - (merged.discount || 0));
        return {
          ...merged,
          subtotal,
          totalAmount,
        };
      })
    );
  };

  const payBill = (id: string, amount: number, paymentMethod: PaymentMethod, notes?: string) => {
    const now = new Date().toISOString();
    setBills(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const newPaid = b.paidAmount + amount;
        const isPaidInFull = newPaid >= b.totalAmount;
        return {
          ...b,
          paidAmount: newPaid,
          status: isPaidInFull ? 'paid' : b.status,
          paymentMethod,
          paidAt: isPaidInFull ? now : b.paidAt,
          notes: notes ? (b.notes ? `${b.notes}\n${notes}` : notes) : b.notes,
        };
      })
    );

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-accountant',
      notificationType: 'payment_received',
      title: 'Payment Received',
      message: `Payment of $${amount.toFixed(2)} recorded via ${paymentMethod.toUpperCase()}.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    const now = new Date().toISOString();
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true, readAt: now } : n))
    );
  };

  const markAllNotificationsRead = () => {
    const now = new Date().toISOString();
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true, readAt: now }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateNotificationPreferences = (pref: Partial<NotificationPreference>) => {
    setNotificationPreferences(prev => ({ ...prev, ...pref }));
  };

  const addDoctorReview = (review: Omit<DoctorReview, 'id' | 'createdAt'>) => {
    const id = `rev-${Date.now()}`;
    const created: DoctorReview = {
      ...review,
      id,
      createdAt: new Date().toISOString(),
    };
    setDoctorReviews(prev => [created, ...prev]);

    // Recalculate average rating
    const doctorAllReviews = [...doctorReviews.filter(r => r.doctorId === review.doctorId), created];
    const avg = doctorAllReviews.reduce((sum, r) => sum + r.rating, 0) / doctorAllReviews.length;
    updateDoctor(review.doctorId, {
      averageRating: parseFloat(avg.toFixed(2)),
    });
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setPatients(INITIAL_PATIENTS);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setVisits(INITIAL_VISITS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setLabTests(INITIAL_LAB_TESTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setBills(INITIAL_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDoctorReviews(INITIAL_DOCTOR_REVIEWS);
    setCurrentUserId('user-admin');
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        users,
        switchUser,
        updateCurrentUser,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        confirmAppointment,
        cancelAppointment,
        rescheduleAppointment,
        visits,
        addVisit,
        updateVisit,
        medicalRecords,
        addMedicalRecord,
        updateMedicalRecord,
        labTests,
        addLabTest,
        updateLabTest,
        completeLabTest,
        prescriptions,
        addPrescription,
        updatePrescription,
        markPrescriptionFilled,
        bills,
        addBill,
        updateBill,
        payBill,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        notificationPreferences,
        updateNotificationPreferences,
        doctorAvailabilities,
        doctorReviews,
        addDoctorReview,
        resetToDemoData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
