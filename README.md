# Hospital Management System (HMS)

A modern, responsive React-based Hospital Management System with comprehensive features for patient management, doctor scheduling, clinical appointments, triage & reception, diagnostic laboratory testing, medical records, billing & invoicing, and notifications.

## Overview

Ported and rewritten from Django to a high-performance React + TypeScript SPA with Tailwind CSS styling and full client-side state persistence.

### Key Modules

- **🏥 Patient Management**:
  - Comprehensive electronic patient profiles with blood type, allergies, chronic conditions, emergency contacts, and insurance details.
  - Medical records management, triage visits, diagnostic findings, prescriptions, and billing histories.
  - Printable official Patient Medical Summary Report.

- **👨‍⚕️ Doctor & Specialist Management**:
  - Doctor profiles with medical qualifications, board certifications, experience, consultation fees, and availability toggles.
  - Weekly clinic hours schedule management.
  - Patient reviews and 5-star rating system with recalculation.

- **📅 Clinical Appointments**:
  - Consultation scheduling with calendar date/time picker.
  - Conflict detection to prevent double-booking doctors.
  - Multiple appointment types (Consultation, Follow-up, Routine Check, Surgery, Emergency).
  - Status progression workflow (Scheduled, Confirmed, In Progress, Completed, Rescheduled, Cancelled with audit reasons).

- **🩺 Reception & Triage Queue**:
  - Live lobby queue management with waiting times.
  - Triage vital signs recording (Blood Pressure, Heart Rate, Temperature, SpO2, Respiratory Rate, Weight).
  - Patient status transitions (Waiting in lobby -> In consultation -> Discharged).

- **🔬 Diagnostic Laboratory**:
  - Diagnostic test catalog (Blood, Malaria, COVID-19, Urine, X-Ray, Ultrasound, CT Scan, ECG).
  - Order entry by physician.
  - Laboratory technician results entry with quantitative findings and technician remarks.

- **💊 Prescription Management**:
  - Digital prescription issuance with dosage units (mg, ml, tablet, capsule, injection), frequency, and duration.
  - Active, filled, and completed status tracking.

- **💰 Billing & Financial Invoicing**:
  - Multi-item invoice generation with subtotal, tax, and discount computations.
  - Payment collection supporting Card, Cash, Online Wire, and Insurance claims.
  - Printable official Hospital Invoice & Payment Receipt.

- **🔔 System Notifications**:
  - Real-time notification feed for clinical events (reminders, lab completions, invoices, payments).
  - Granular notification delivery preferences (Email, SMS, Push alerts).

- **🔐 Role Switching & Access**:
  - Quick-switch user accounts between Administrator, Doctor, Receptionist, Lab Technician, and Accountant to test and experience role-tailored views and capabilities.

## Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage with realistic initial clinical dataset

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
