export type UserRole =
  | 'admin'
  | 'doctor'
  | 'receptionist'
  | 'lab_technician'
  | 'pharmacist'
  | 'accountant';

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  phoneNumber?: string;
  bio?: string;
  doctorId?: string; // If role is doctor
}

export type Gender = 'M' | 'F' | 'O';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  bloodType?: BloodType;
  emergencyContact?: string;
  emergencyContactName?: string;
  allergies?: string;
  chronicDiseases?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  gender: Gender;
  qualification?: string;
  experienceYears: number;
  licenseNumber?: string;
  bio?: string;
  isAvailable: boolean;
  consultationFee: number;
  totalPatients: number;
  averageRating: number;
  createdAt: string;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0 = Mon, 1 = Tue, ..., 6 = Sun
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  isAvailable: boolean;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  patientId?: string;
  patientName: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: string;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type AppointmentType =
  | 'consultation'
  | 'follow_up'
  | 'surgery'
  | 'emergency'
  | 'routine_check'
  | 'laboratory'
  | 'pharmacy';

export type AppointmentTargetRole = 'doctor' | 'lab_technician' | 'pharmacist';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string; // or target staff id
  targetRole: AppointmentTargetRole;
  targetPersonnelName?: string;
  date: string;
  time: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  
  // Accept / Decline workflow
  responseStatus: 'pending' | 'accepted' | 'declined';
  declineReason?: string;
  declinedBy?: string;
  declinedAt?: string;
  acceptedAt?: string;

  reason?: string;
  notes?: string;
  cancelledReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  disease: string;
  diagnosis: string;
  prescription: string;
  visitDate: string;
  reviewDate?: string;
  notes?: string;
  createdAt: string;
}

export type VisitStatus = 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled';

export interface Vitals {
  bloodPressure?: string;     // e.g. "120/80 mmHg"
  heartRate?: string;         // e.g. "72 bpm"
  temperature?: string;       // e.g. "36.8 °C"
  oxygenSaturation?: string;  // e.g. "98 %"
  respiratoryRate?: string;   // e.g. "16 /min"
  weight?: string;            // e.g. "70 kg"
}

export interface Visit {
  id: string;
  patientId: string;
  doctorId?: string;
  visitDate: string;
  status: VisitStatus;
  vitals?: Vitals;
  notes?: string;
  createdAt: string;
}

export type LabTestType =
  | 'blood'
  | 'malaria'
  | 'covid'
  | 'urine'
  | 'xray'
  | 'ultrasound'
  | 'ct_scan'
  | 'ecg';

export interface LaboratoryTest {
  id: string;
  patientId: string;
  doctorId?: string;
  visitId?: string;
  testType: LabTestType;
  result?: string;
  requestedDate: string;
  completed: boolean;
  completedDate?: string;
  technicianNotes?: string;
  cost: number;
  responseStatus: 'pending' | 'accepted' | 'declined';
  declineReason?: string;
  performedBy?: string;
  createdAt: string;
}

export type PrescriptionStatus = 'active' | 'completed' | 'cancelled' | 'filled';
export type DosageUnit = 'mg' | 'ml' | 'tablet' | 'capsule' | 'injection';

export interface Prescription {
  id: string;
  medicalRecordId?: string;
  patientId: string;
  doctorId?: string;
  medicineName: string;
  drugId?: string;
  dosage: number;
  dosageUnit: DosageUnit;
  frequency: string;
  durationDays: number;
  instructions?: string;
  status: PrescriptionStatus;
  cost: number;
  responseStatus: 'pending' | 'accepted' | 'declined';
  declineReason?: string;
  dispensedBy?: string;
  createdAt: string;
  filledAt?: string;
  endDate?: string;
}

export interface PharmacyDrug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  expiryDate: string;
  manufacturer: string;
}

export type BillStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'check' | 'online' | 'insurance';
export type BillItemType = 'consultation' | 'procedure' | 'medicine' | 'lab_test' | 'room_charge' | 'registration' | 'other';

export interface BillItem {
  id: string;
  billId: string;
  itemType: BillItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  patientId: string;
  status: BillStatus;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
  items: BillItem[];
  createdAt: string;
  issuedAt?: string;
  dueDate?: string;
  paidAt?: string;
}

export interface Payment {
  id: string;
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  transactionId?: string;
  notes?: string;
  createdAt: string;
  processedAt?: string;
}

export type NotificationType =
  | 'appointment_reminder'
  | 'appointment_received'
  | 'appointment_confirmed'
  | 'appointment_declined'
  | 'appointment_cancelled'
  | 'lab_test_ordered'
  | 'lab_result_ready'
  | 'lab_declined'
  | 'prescription_ordered'
  | 'prescription_filled'
  | 'prescription_declined'
  | 'bill_issued'
  | 'payment_received'
  | 'checkout_ready'
  | 'general';

export interface Notification {
  id: string;
  userId: string;
  targetRole?: UserRole;
  notificationType: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  contentType?: string;
  objectId?: string;
  createdAt: string;
}

export interface NotificationPreference {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  labResults: boolean;
  billingAlerts: boolean;
  prescriptionAlerts: boolean;
}

export type PatientJourneyStage =
  | 'reception_intake'
  | 'doctor_consultation'
  | 'lab_testing'
  | 'pharmacy_dispensation'
  | 'reception_checkout'
  | 'discharged';

export interface PatientJourney {
  patientId: string;
  currentStage: PatientJourneyStage;
  consultationFee: number;
  labFee: number;
  medicationFee: number;
  registrationFee: number;
  totalJourneyCost: number;
  isPaid: boolean;
  dischargedAt?: string;
}
