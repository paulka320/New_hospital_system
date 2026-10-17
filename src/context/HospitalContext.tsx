import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Patient,
  Doctor,
  DoctorAvailability,
  DoctorReview,
  Appointment,
  AppointmentType,
  AppointmentTargetRole,
  MedicalRecord,
  Visit,
  LaboratoryTest,
  Prescription,
  PharmacyDrug,
  Bill,
  BillItem,
  Notification,
  NotificationPreference,
  PaymentMethod,
  PatientJourney,
  PatientJourneyStage,
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
  INITIAL_DRUGS,
  INITIAL_JOURNEYS,
  INITIAL_BILLS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCTOR_AVAILABILITIES,
  INITIAL_DOCTOR_REVIEWS,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '../data/mockData';

interface HospitalContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;

  // Staff / User Personnel Management (Admin access)
  addUser: (user: Omit<UserProfile, 'id'>) => UserProfile;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;

  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  doctors: Doctor[];
  addDoctor: (doc: Omit<Doctor, 'id' | 'createdAt' | 'totalPatients' | 'averageRating'>) => Doctor;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'responseStatus'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;

  // New Accept / Decline appointment flows for personnel
  acceptAppointment: (id: string) => void;
  declineAppointment: (id: string, reason: string) => void;

  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id' | 'createdAt'>) => Visit;
  updateVisit: (id: string, updates: Partial<Visit>) => void;

  medicalRecords: MedicalRecord[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => MedicalRecord;
  updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => void;

  labTests: LaboratoryTest[];
  addLabTest: (test: Omit<LaboratoryTest, 'id' | 'createdAt' | 'completed' | 'responseStatus' | 'cost'> & { cost?: number }) => LaboratoryTest;
  updateLabTest: (id: string, updates: Partial<LaboratoryTest>) => void;
  acceptLabTest: (id: string) => void;
  declineLabTest: (id: string, reason: string) => void;
  completeLabTest: (id: string, result: string, notes?: string) => void;

  prescriptions: Prescription[];
  addPrescription: (rx: Omit<Prescription, 'id' | 'createdAt' | 'responseStatus' | 'cost'> & { cost?: number }) => Prescription;
  updatePrescription: (id: string, updates: Partial<Prescription>) => void;
  acceptPrescription: (id: string) => void;
  declinePrescription: (id: string, reason: string) => void;
  dispensePrescription: (id: string, drugId?: string) => void;

  drugs: PharmacyDrug[];
  updateDrugStock: (id: string, delta: number) => void;
  addDrug: (drug: Omit<PharmacyDrug, 'id'>) => PharmacyDrug;

  // Patient journey & Mandatory Checkout
  patientJourneys: Record<string, PatientJourney>;
  updatePatientJourneyStage: (patientId: string, stage: PatientJourneyStage) => void;
  checkoutAndDischargePatient: (patientId: string, paymentMethod: PaymentMethod, notes?: string) => Bill;

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
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const raw = loadFromStorage<UserProfile[]>('users', INITIAL_USERS);
    return raw.filter(u => (u.role as string) !== 'patient');
  });
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadFromStorage('current_user_id', 'user-reception'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadFromStorage('is_authenticated', true));

  const [patients, setPatients] = useState<Patient[]>(() => loadFromStorage('patients', INITIAL_PATIENTS));
  const [doctors, setDoctors] = useState<Doctor[]>(() => loadFromStorage('doctors', INITIAL_DOCTORS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadFromStorage('appointments', INITIAL_APPOINTMENTS));
  const [visits, setVisits] = useState<Visit[]>(() => loadFromStorage('visits', INITIAL_VISITS));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => loadFromStorage('medical_records', INITIAL_MEDICAL_RECORDS));
  const [labTests, setLabTests] = useState<LaboratoryTest[]>(() => loadFromStorage('lab_tests', INITIAL_LAB_TESTS));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => loadFromStorage('prescriptions', INITIAL_PRESCRIPTIONS));
  const [drugs, setDrugs] = useState<PharmacyDrug[]>(() => loadFromStorage('drugs', INITIAL_DRUGS));
  const [patientJourneys, setPatientJourneys] = useState<Record<string, PatientJourney>>(() => loadFromStorage('journeys', INITIAL_JOURNEYS));
  const [bills, setBills] = useState<Bill[]>(() => loadFromStorage('bills', INITIAL_BILLS));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference>(() => loadFromStorage('notification_preferences', DEFAULT_NOTIFICATION_PREFERENCES));
  const [doctorAvailabilities] = useState<DoctorAvailability[]>(() => loadFromStorage('availabilities', INITIAL_DOCTOR_AVAILABILITIES));
  const [doctorReviews, setDoctorReviews] = useState<DoctorReview[]>(() => loadFromStorage('reviews', INITIAL_DOCTOR_REVIEWS));

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('hms_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('hms_is_authenticated', JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('hms_current_user_id', JSON.stringify(currentUserId)); }, [currentUserId]);
  useEffect(() => { localStorage.setItem('hms_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('hms_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('hms_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('hms_visits', JSON.stringify(visits)); }, [visits]);
  useEffect(() => { localStorage.setItem('hms_medical_records', JSON.stringify(medicalRecords)); }, [medicalRecords]);
  useEffect(() => { localStorage.setItem('hms_lab_tests', JSON.stringify(labTests)); }, [labTests]);
  useEffect(() => { localStorage.setItem('hms_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('hms_drugs', JSON.stringify(drugs)); }, [drugs]);
  useEffect(() => { localStorage.setItem('hms_journeys', JSON.stringify(patientJourneys)); }, [patientJourneys]);
  useEffect(() => { localStorage.setItem('hms_bills', JSON.stringify(bills)); }, [bills]);
  useEffect(() => { localStorage.setItem('hms_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('hms_notification_preferences', JSON.stringify(notificationPreferences)); }, [notificationPreferences]);
  useEffect(() => { localStorage.setItem('hms_reviews', JSON.stringify(doctorReviews)); }, [doctorReviews]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const login = (userId: string) => {
    setCurrentUserId(userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    setIsAuthenticated(true);
  };

  // Staff / Personnel Management (Admin operations)
  const addUser = (newUser: Omit<UserProfile, 'id'>) => {
    const id = `user-${Date.now()}`;
    const created: UserProfile = {
      ...newUser,
      id,
    };

    // If role is doctor and doctorId not yet assigned, link/create in doctors collection
    if (created.role === 'doctor') {
      const docId = `doc-${Date.now()}`;
      created.doctorId = docId;
      const newDoc: Doctor = {
        id: docId,
        name: `Dr. ${created.firstName} ${created.lastName}`,
        specialization: created.department || 'General Medicine',
        phone: created.phoneNumber || '+1 (555) 000-0000',
        email: created.email,
        gender: 'M',
        qualification: 'MD',
        experienceYears: 5,
        licenseNumber: `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
        bio: created.bio || 'Staff Physician',
        isAvailable: true,
        consultationFee: 100.0,
        totalPatients: 0,
        averageRating: 5.0,
        createdAt: new Date().toISOString(),
      };
      setDoctors(prev => [...prev, newDoc]);
    }

    setUsers(prev => [...prev, created]);

    // Admin notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      targetRole: 'admin',
      notificationType: 'general',
      title: `New Staff Onboarded: ${created.firstName} ${created.lastName}`,
      message: `${created.firstName} ${created.lastName} has been added as a ${created.role.replace('_', ' ')} in ${created.department}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    return created;
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));

    // If this staff member is a doctor, sync doctor profile
    const existing = users.find(u => u.id === id);
    if (existing?.doctorId) {
      setDoctors(prev =>
        prev.map(d => {
          if (d.id === existing.doctorId) {
            return {
              ...d,
              name:
                updates.firstName || updates.lastName
                  ? `Dr. ${updates.firstName || existing.firstName} ${updates.lastName || existing.lastName}`
                  : d.name,
              email: updates.email || d.email,
              phone: updates.phoneNumber || d.phone,
              specialization: updates.department || d.specialization,
            };
          }
          return d;
        })
      );
    }
  };

  const deleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    // Filter out user
    setUsers(prev => prev.filter(u => u.id !== id));

    // If linked to a doctor, also remove doctor record
    if (userToDelete.doctorId) {
      setDoctors(prev => prev.filter(d => d.id !== userToDelete.doctorId));
    }

    // If active user is the deleted one, switch to first remaining user
    if (currentUserId === id) {
      const remaining = users.filter(u => u.id !== id);
      if (remaining.length > 0) {
        setCurrentUserId(remaining[0].id);
      }
    }

    // Admin notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      targetRole: 'admin',
      notificationType: 'general',
      title: `Staff Member Removed`,
      message: `${userToDelete.firstName} ${userToDelete.lastName} (${userToDelete.role}) was removed from active hospital personnel.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
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

    // Initialize patient journey at reception intake with standard registration fee ($20)
    setPatientJourneys(prev => ({
      ...prev,
      [id]: {
        patientId: id,
        currentStage: 'reception_intake',
        registrationFee: 20.0,
        consultationFee: 0.0,
        labFee: 0.0,
        medicationFee: 0.0,
        totalJourneyCost: 20.0,
        isPaid: false,
      },
    }));

    // Notification
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      targetRole: 'admin',
      notificationType: 'general',
      title: 'New Patient Intake',
      message: `${created.name} registered at Reception. Patient workflow initialized.`,
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

    // Also auto-create a UserProfile for the doctor so they can log in
    const cleanName = doc.name.replace(/^Dr\.\s*/i, '').trim();
    const nameParts = cleanName.split(' ');
    const firstName = nameParts[0] || 'Doctor';
    const lastName = nameParts.slice(1).join(' ') || 'Staff';
    const username = `dr_${firstName.toLowerCase()}_${Math.floor(100 + Math.random() * 900)}`;

    const doctorUser: UserProfile = {
      id: `user-${id}`,
      username,
      firstName,
      lastName,
      email: doc.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospitalsystem.com`,
      role: 'doctor',
      department: doc.specialization,
      doctorId: id,
      phoneNumber: doc.phone,
      bio: doc.bio || `${doc.specialization} specialist with ${doc.experienceYears} years experience.`,
    };

    setUsers(prev => {
      if (prev.some(u => u.doctorId === id)) return prev;
      return [...prev, doctorUser];
    });

    return created;
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates } : d))
    );

    // Sync corresponding user profile if name or email changed
    if (updates.name || updates.email || updates.phone || updates.specialization) {
      setUsers(prev =>
        prev.map(u => {
          if (u.doctorId === id) {
            const cleanName = updates.name ? updates.name.replace(/^Dr\.\s*/i, '').trim() : undefined;
            const nameParts = cleanName ? cleanName.split(' ') : [];
            return {
              ...u,
              firstName: nameParts[0] || u.firstName,
              lastName: nameParts.slice(1).join(' ') || u.lastName,
              email: updates.email || u.email,
              phoneNumber: updates.phone || u.phoneNumber,
              department: updates.specialization || u.department,
            };
          }
          return u;
        })
      );
    }
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    // Also remove the corresponding doctor user login account
    setUsers(prev => prev.filter(u => u.doctorId !== id));
  };

  // Appointments (Scheduled by Receptionist -> Targeted to Doctor, Lab, or Pharmacist)
  const addAppointment = (apt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'responseStatus'>) => {
    const id = `apt-${Date.now()}`;
    const now = new Date().toISOString();
    const created: Appointment = {
      ...apt,
      id,
      responseStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    setAppointments(prev => [created, ...prev]);

    const patient = patients.find(p => p.id === apt.patientId);
    let targetRole: UserRole = 'doctor';
    let targetName = 'Physician';

    if (apt.targetRole === 'lab_technician') {
      targetRole = 'lab_technician';
      targetName = 'Laboratory Attendant';
    } else if (apt.targetRole === 'pharmacist') {
      targetRole = 'pharmacist';
      targetName = 'Pharmacist';
    } else {
      const doc = doctors.find(d => d.id === apt.doctorId);
      targetName = doc ? `Dr. ${doc.name}` : 'Doctor';
    }

    // Direct notification to target staff member's dashboard
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: apt.doctorId,
      targetRole,
      notificationType: 'appointment_received',
      title: `New Appointment Request from Reception`,
      message: `Receptionist booked an appointment for ${patient?.name || 'Patient'} on ${apt.date} at ${apt.time} (${apt.appointmentType}). Please Accept or Decline.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);

    // Update patient journey stage if routed to doctor
    if (apt.targetRole === 'doctor') {
      const doctor = doctors.find(d => d.id === apt.doctorId);
      const fee = doctor?.consultationFee || 100.0;
      setPatientJourneys(prev => {
        const existing = prev[apt.patientId] || {
          patientId: apt.patientId,
          currentStage: 'doctor_consultation',
          registrationFee: 20.0,
          consultationFee: fee,
          labFee: 0.0,
          medicationFee: 0.0,
          totalJourneyCost: 20.0 + fee,
          isPaid: false,
        };
        const updatedConsultFee = existing.consultationFee || fee;
        return {
          ...prev,
          [apt.patientId]: {
            ...existing,
            currentStage: 'doctor_consultation',
            consultationFee: updatedConsultFee,
            totalJourneyCost: (existing.registrationFee || 20) + updatedConsultFee + existing.labFee + existing.medicationFee,
          },
        };
      });
    }

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
    updateAppointment(id, { status: 'confirmed', responseStatus: 'accepted' });
  };

  const acceptAppointment = (id: string) => {
    const now = new Date().toISOString();
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;

    updateAppointment(id, {
      responseStatus: 'accepted',
      status: 'confirmed',
      acceptedAt: now,
    });

    const pat = patients.find(p => p.id === apt.patientId);

    // Notify receptionist & admin
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-reception',
      targetRole: 'receptionist',
      notificationType: 'appointment_confirmed',
      title: `Appointment Accepted`,
      message: `Appointment for ${pat?.name || 'Patient'} on ${apt.date} at ${apt.time} was ACCEPTED by the personnel.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const declineAppointment = (id: string, reason: string) => {
    const now = new Date().toISOString();
    const apt = appointments.find(a => a.id === id);
    if (!apt) return;

    updateAppointment(id, {
      responseStatus: 'declined',
      status: 'cancelled',
      declineReason: reason,
      declinedBy: currentUser.firstName + ' ' + currentUser.lastName,
      declinedAt: now,
      cancelledReason: `Declined by staff: ${reason}`,
      cancelledAt: now,
    });

    const pat = patients.find(p => p.id === apt.patientId);

    // Notify Receptionist so they can notify the patient or reschedule
    const notifReception: Notification = {
      id: `notif-${Date.now()}-1`,
      userId: 'user-reception',
      targetRole: 'receptionist',
      notificationType: 'appointment_declined',
      title: `Appointment Declined for ${pat?.name}`,
      message: `Appointment was DECLINED by ${currentUser.firstName} ${currentUser.lastName}. Reason: "${reason}". Please reschedule patient.`,
      isRead: false,
      createdAt: now,
    };

    // Notify Admin so it appears in the Executive Summary of Cancellations / Declines
    const notifAdmin: Notification = {
      id: `notif-${Date.now()}-2`,
      userId: 'user-admin',
      targetRole: 'admin',
      notificationType: 'appointment_declined',
      title: `Audit: Appointment Declined (${pat?.name})`,
      message: `Declined by ${currentUser.firstName} ${currentUser.lastName} (${currentUser.role}). Reason: "${reason}".`,
      isRead: false,
      createdAt: now,
    };

    setNotifications(prev => [notifAdmin, notifReception, ...prev]);
  };

  const cancelAppointment = (id: string, reason?: string) => {
    const now = new Date().toISOString();
    updateAppointment(id, {
      status: 'cancelled',
      responseStatus: 'declined',
      declineReason: reason || 'Cancelled by staff',
      cancelledReason: reason || 'Cancelled by staff or patient',
      cancelledAt: now,
    });
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    updateAppointment(id, {
      date: newDate,
      time: newTime,
      status: 'rescheduled',
      responseStatus: 'pending',
    });
  };

  // Visits
  const addVisit = (visit: Omit<Visit, 'id' | 'createdAt'>) => {
    const id = `vis-${Date.now()}`;
    const now = new Date().toISOString();
    const created: Visit = { ...visit, id, createdAt: now };
    setVisits(prev => [created, ...prev]);
    return created;
  };

  const updateVisit = (id: string, updates: Partial<Visit>) => {
    setVisits(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
  };

  // Medical Records
  const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
    const id = `rec-${Date.now()}`;
    const now = new Date().toISOString();
    const created: MedicalRecord = { ...record, id, createdAt: now };
    setMedicalRecords(prev => [created, ...prev]);
    return created;
  };

  const updateMedicalRecord = (id: string, updates: Partial<MedicalRecord>) => {
    setMedicalRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Laboratory Tests
  const addLabTest = (test: Omit<LaboratoryTest, 'id' | 'createdAt' | 'completed' | 'responseStatus' | 'cost'> & { cost?: number }) => {
    const id = `lab-${Date.now()}`;
    const now = new Date().toISOString();
    const cost = test.cost || 60.0;

    const created: LaboratoryTest = {
      ...test,
      id,
      completed: false,
      cost,
      responseStatus: 'pending',
      createdAt: now,
    };
    setLabTests(prev => [created, ...prev]);

    // Update patient journey stage & cumulative cost
    setPatientJourneys(prev => {
      const existing = prev[test.patientId] || {
        patientId: test.patientId,
        currentStage: 'lab_testing',
        registrationFee: 20.0,
        consultationFee: 100.0,
        labFee: 0.0,
        medicationFee: 0.0,
        totalJourneyCost: 120.0,
        isPaid: false,
      };
      const updatedLabFee = existing.labFee + cost;
      return {
        ...prev,
        [test.patientId]: {
          ...existing,
          currentStage: 'lab_testing',
          labFee: updatedLabFee,
          totalJourneyCost: existing.registrationFee + existing.consultationFee + updatedLabFee + existing.medicationFee,
        },
      };
    });

    const pat = patients.find(p => p.id === test.patientId);

    // Send direct notification to Laboratory Attendant
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-lab',
      targetRole: 'lab_technician',
      notificationType: 'lab_test_ordered',
      title: `New Lab Order: ${test.testType.toUpperCase()}`,
      message: `Doctor ordered a ${test.testType.toUpperCase()} test for patient ${pat?.name || 'Unknown'}. Please Accept or Decline in Laboratory dashboard.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);

    return created;
  };

  const updateLabTest = (id: string, updates: Partial<LaboratoryTest>) => {
    setLabTests(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const acceptLabTest = (id: string) => {
    updateLabTest(id, { responseStatus: 'accepted' });
  };

  const declineLabTest = (id: string, reason: string) => {
    updateLabTest(id, {
      responseStatus: 'declined',
      declineReason: reason,
    });

    const test = labTests.find(t => t.id === id);
    const pat = patients.find(p => p.id === test?.patientId);
    const now = new Date().toISOString();

    // Alert Doctor and Admin
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: test?.doctorId || 'user-admin',
      targetRole: 'doctor',
      notificationType: 'lab_declined',
      title: `Lab Test Declined: ${test?.testType.toUpperCase()}`,
      message: `Laboratory attendant declined test for ${pat?.name || 'Patient'}. Reason: "${reason}".`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const completeLabTest = (id: string, result: string, notes?: string) => {
    const now = new Date().toISOString();
    const test = labTests.find(t => t.id === id);

    setLabTests(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              completed: true,
              result,
              technicianNotes: notes || t.technicianNotes,
              completedDate: now,
              performedBy: `${currentUser.firstName} ${currentUser.lastName}`,
            }
          : t
      )
    );

    const patient = patients.find(p => p.id === test?.patientId);
    const doc = doctors.find(d => d.id === test?.doctorId);

    // Send notification BACK TO THE DOCTOR with the completed results!
    const notifDoctor: Notification = {
      id: `notif-${Date.now()}`,
      userId: test?.doctorId || 'user-doc-1',
      targetRole: 'doctor',
      notificationType: 'lab_result_ready',
      title: `Diagnostic Results Ready: ${test?.testType.toUpperCase()}`,
      message: `Lab results for ${patient?.name || 'Patient'} are ready. Findings: "${result.slice(0, 80)}...". Doctor review & prescription required.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notifDoctor, ...prev]);
  };

  // Prescriptions & Pharmacy Dispensation
  const addPrescription = (rx: Omit<Prescription, 'id' | 'createdAt' | 'responseStatus' | 'cost'> & { cost?: number }) => {
    const id = `rx-${Date.now()}`;
    const now = new Date().toISOString();
    const cost = rx.cost || 20.0;

    const created: Prescription = {
      ...rx,
      id,
      cost,
      responseStatus: 'pending',
      createdAt: now,
    };
    setPrescriptions(prev => [created, ...prev]);

    // Update patient journey stage & cumulative cost
    setPatientJourneys(prev => {
      const existing = prev[rx.patientId] || {
        patientId: rx.patientId,
        currentStage: 'pharmacy_dispensation',
        registrationFee: 20.0,
        consultationFee: 100.0,
        labFee: 0.0,
        medicationFee: 0.0,
        totalJourneyCost: 120.0,
        isPaid: false,
      };
      const updatedMedFee = existing.medicationFee + cost;
      return {
        ...prev,
        [rx.patientId]: {
          ...existing,
          currentStage: 'pharmacy_dispensation',
          medicationFee: updatedMedFee,
          totalJourneyCost: existing.registrationFee + existing.consultationFee + existing.labFee + updatedMedFee,
        },
      };
    });

    const pat = patients.find(p => p.id === rx.patientId);

    // Send notification to Pharmacist
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-pharmacy',
      targetRole: 'pharmacist',
      notificationType: 'prescription_ordered',
      title: `New Prescription for Dispensation`,
      message: `Doctor prescribed ${rx.medicineName} (${rx.dosage}${rx.dosageUnit}) for patient ${pat?.name}. Please review stock and dispense.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);

    return created;
  };

  const updatePrescription = (id: string, updates: Partial<Prescription>) => {
    setPrescriptions(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const acceptPrescription = (id: string) => {
    updatePrescription(id, { responseStatus: 'accepted' });
  };

  const declinePrescription = (id: string, reason: string) => {
    updatePrescription(id, {
      responseStatus: 'declined',
      declineReason: reason,
    });

    const rx = prescriptions.find(p => p.id === id);
    const pat = patients.find(p => p.id === rx?.patientId);
    const now = new Date().toISOString();

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: rx?.doctorId || 'user-admin',
      targetRole: 'doctor',
      notificationType: 'prescription_declined',
      title: `Prescription Declined by Pharmacist`,
      message: `Pharmacist declined dispensation of ${rx?.medicineName} for ${pat?.name}. Reason: "${reason}".`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const dispensePrescription = (id: string, drugId?: string) => {
    const now = new Date().toISOString();
    const rx = prescriptions.find(p => p.id === id);
    if (!rx) return;

    // Deduct stock if drug matched
    if (drugId || rx.drugId) {
      updateDrugStock(drugId || rx.drugId!, -1);
    }

    updatePrescription(id, {
      status: 'filled',
      responseStatus: 'accepted',
      filledAt: now,
      dispensedBy: `${currentUser.firstName} ${currentUser.lastName}`,
    });

    // Advance patient to Mandatory Reception Checkout!
    setPatientJourneys(prev => {
      const existing = prev[rx.patientId];
      if (!existing) return prev;
      return {
        ...prev,
        [rx.patientId]: {
          ...existing,
          currentStage: 'reception_checkout',
        },
      };
    });

    const pat = patients.find(p => p.id === rx.patientId);
    const journey = patientJourneys[rx.patientId];
    const totalAmountDue = journey ? journey.totalJourneyCost : rx.cost + 120.0;

    // Notify Receptionist that patient is leaving and payment is mandatory!
    const notifReception: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-reception',
      targetRole: 'receptionist',
      notificationType: 'checkout_ready',
      title: `Mandatory Payment Due: ${pat?.name}`,
      message: `${pat?.name} has completed the doctor visit and pharmacy dispensation. Cumulative bill of $${totalAmountDue.toFixed(2)} is pending mandatory collection at reception desk.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notifReception, ...prev]);
  };

  // Drugs
  const updateDrugStock = (id: string, delta: number) => {
    setDrugs(prev =>
      prev.map(d =>
        d.id === id ? { ...d, stockQuantity: Math.max(0, d.stockQuantity + delta) } : d
      )
    );
  };

  const addDrug = (newDrug: Omit<PharmacyDrug, 'id'>) => {
    const id = `drug-${Date.now()}`;
    const created: PharmacyDrug = { ...newDrug, id };
    setDrugs(prev => [...prev, created]);
    return created;
  };

  // Patient Journey & Mandatory Reception Checkout
  const updatePatientJourneyStage = (patientId: string, stage: PatientJourneyStage) => {
    setPatientJourneys(prev => {
      const existing = prev[patientId];
      if (!existing) return prev;
      return {
        ...prev,
        [patientId]: {
          ...existing,
          currentStage: stage,
        },
      };
    });
  };

  const checkoutAndDischargePatient = (
    patientId: string,
    paymentMethod: PaymentMethod,
    notes?: string
  ): Bill => {
    const pat = patients.find(p => p.id === patientId);
    const journey = patientJourneys[patientId] || {
      patientId,
      currentStage: 'reception_checkout',
      registrationFee: 20.0,
      consultationFee: 120.0,
      labFee: 60.0,
      medicationFee: 25.0,
      totalJourneyCost: 225.0,
      isPaid: false,
    };

    const billNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    // Compile itemized charges from the entire journey
    const items: BillItem[] = [
      {
        id: `bi-reg-${Date.now()}`,
        billId: '',
        itemType: 'registration',
        description: 'Hospital Reception Triage & Patient Intake Fee',
        quantity: 1,
        unitPrice: journey.registrationFee || 20.0,
      },
      {
        id: `bi-doc-${Date.now()}`,
        billId: '',
        itemType: 'consultation',
        description: 'Attending Physician Clinical Examination Fee',
        quantity: 1,
        unitPrice: journey.consultationFee || 100.0,
      },
    ];

    if (journey.labFee > 0) {
      items.push({
        id: `bi-lab-${Date.now()}`,
        billId: '',
        itemType: 'lab_test',
        description: 'Diagnostic Laboratory Pathology Assays',
        quantity: 1,
        unitPrice: journey.labFee,
      });
    }

    if (journey.medicationFee > 0) {
      items.push({
        id: `bi-med-${Date.now()}`,
        billId: '',
        itemType: 'medicine',
        description: 'Prescription Pharmaceuticals Dispensation',
        quantity: 1,
        unitPrice: journey.medicationFee,
      });
    }

    const subtotal = items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const totalAmount = subtotal + tax;

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      billNumber,
      patientId,
      status: 'paid',
      subtotal,
      tax,
      discount: 0,
      totalAmount,
      paidAmount: totalAmount,
      paymentMethod,
      notes: notes || `Mandatory full discharge payment collected at reception checkout desk. All stages settled.`,
      items,
      createdAt: now,
      issuedAt: now,
      paidAt: now,
    };

    setBills(prev => [newBill, ...prev]);

    // Mark journey paid & discharged
    setPatientJourneys(prev => ({
      ...prev,
      [patientId]: {
        ...journey,
        currentStage: 'discharged',
        isPaid: true,
        dischargedAt: now,
      },
    }));

    // Update active visits for this patient
    setVisits(prev =>
      prev.map(v => (v.patientId === patientId ? { ...v, status: 'completed' } : v))
    );

    // Notification to Finance & Admin
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-accountant',
      targetRole: 'accountant',
      notificationType: 'payment_received',
      title: `Mandatory Bill Settle: ${pat?.name}`,
      message: `Full journey invoice #${billNumber} of $${totalAmount.toFixed(2)} collected via ${paymentMethod.toUpperCase()} at reception checkout desk. Patient discharged.`,
      isRead: false,
      createdAt: now,
    };
    setNotifications(prev => [notif, ...prev]);

    return newBill;
  };

  // Bills general
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
    return created;
  };

  const updateBill = (id: string, updates: Partial<Bill>) => {
    setBills(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const merged = { ...b, ...updates };
        const subtotal = merged.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        const totalAmount = Math.max(0, subtotal + (merged.tax || 0) - (merged.discount || 0));
        return { ...merged, subtotal, totalAmount };
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
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: now })));
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
    const created: DoctorReview = { ...review, id, createdAt: new Date().toISOString() };
    setDoctorReviews(prev => [created, ...prev]);

    const doctorAllReviews = [...doctorReviews.filter(r => r.doctorId === review.doctorId), created];
    const avg = doctorAllReviews.reduce((sum, r) => sum + r.rating, 0) / doctorAllReviews.length;
    updateDoctor(review.doctorId, { averageRating: parseFloat(avg.toFixed(2)) });
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
    setDrugs(INITIAL_DRUGS);
    setPatientJourneys(INITIAL_JOURNEYS);
    setBills(INITIAL_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDoctorReviews(INITIAL_DOCTOR_REVIEWS);
    setUsers(INITIAL_USERS);
    setCurrentUserId('user-admin');
    setIsAuthenticated(true);
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        login,
        logout,
        switchUser,
        addUser,
        updateUser,
        deleteUser,
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
        acceptAppointment,
        declineAppointment,
        visits,
        addVisit,
        updateVisit,
        medicalRecords,
        addMedicalRecord,
        updateMedicalRecord,
        labTests,
        addLabTest,
        updateLabTest,
        acceptLabTest,
        declineLabTest,
        completeLabTest,
        prescriptions,
        addPrescription,
        updatePrescription,
        acceptPrescription,
        declinePrescription,
        dispensePrescription,
        drugs,
        updateDrugStock,
        addDrug,
        patientJourneys,
        updatePatientJourneyStage,
        checkoutAndDischargePatient,
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
