# Hospital Management System - Architecture & Relationships

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     HOSPITAL MANAGEMENT SYSTEM                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │  Web Interface  │  │  REST API        │  │  Mobile App      ││
│  │  (HTML/CSS/JS)  │  │  (JSON)          │  │  (Coming Soon)   ││
│  └────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘│
│           │                    │                      │          │
└───────────┼────────────────────┼──────────────────────┼──────────┘
            │                    │                      │
            └────────────────────┼──────────────────────┘
                                 │
┌───────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                          │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐│
│  │  Views       │  │  ViewSets    │  │  Services                ││
│  │  (Web)       │  │  (API)       │  │  - Notifications         ││
│  │              │  │              │  │  - Appointment Logic     ││
│  │ - Patient    │  │ - Patient    │  │  - Billing Calc          ││
│  │ - Doctor     │  │ - Doctor     │  │  - Lab Results           ││
│  │ - Appt       │  │ - Appt       │  │                          ││
│  │ - Medical    │  │ - Medical    │  │                          ││
│  └──────────────┘  └──────────────┘  └──────────────────────────┘│
│                                                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Django ORM (Models)                             │ │
│  │                                                              │ │
│  │  Patient  Doctor  Appointment  MedicalRecord  Prescription  │ │
│  │  Visit    Lab     Bill         BillItem      Payment        │ │
│  │  Notification  DoctorAvailability  DoctorReview            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────┬───────────────────────────────────────┘
                             │
┌────────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  SQLite (Development) / PostgreSQL (Production)             │ │
│  │                                                              │ │
│  │  14 Tables with proper indexes and relationships            │ │
│  │  - Automatic timestamps (created_at, updated_at)           │ │
│  │  - Cascade delete rules                                     │ │
│  │  - Unique constraints for data integrity                   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Model Relationships

```
USER (Django Auth)
  │
  ├──────────────────────────────────────────┐
  │                                          │
  ▼                                          ▼
PATIENT                                    DOCTOR
  │                                          │
  ├─── has many ──────────┐                  ├─── has many ────────┐
  │                       │                  │                     │
  ▼                       ▼                  ▼                     ▼
APPOINTMENT         MEDICAL_RECORD      APPOINTMENT         DOCTOR_AVAILABILITY
  │                       │                                      │
  ├─ linked to ───→ DOCTOR                                   (Mon-Sun schedule)
  │                       │
  ├─── has many ──→ PRESCRIPTION
  │
  ├─── has many ──→ VISIT
  │                 │
  │                 └─── has many ──→ LABORATORY
  │
  ├─── has many ──→ LABORATORY
  │
  └─── has many ──→ BILL
                     │
                     └─── has many ──→ BILL_ITEM
                     │
                     └─── has many ──→ PAYMENT

DOCTOR
  ├─── has many ──→ DOCTOR_REVIEW
  ├─── has many ──→ DOCTOR_AVAILABILITY
  └─── has many ──→ NOTIFICATION (reminders)

NOTIFICATION
  └─── linked to ──→ USER
  └─── linked to ──→ NOTIFICATION_PREFERENCE
```

---

## 🔌 API Endpoint Structure

```
/api/
├── patients/
│   ├── GET    - List all patients
│   ├── POST   - Create new patient
│   ├── {id}/
│   │   ├── GET    - Get patient detail
│   │   ├── PUT    - Update patient
│   │   ├── DELETE - Delete patient
│   │   ├── medical-records/ - Get medical records
│   │   ├── visits/         - Get visits
│   │   ├── labs/           - Get lab tests
│   │   └── prescriptions/  - Get prescriptions
│   └── search/ - Search patients
│
├── doctors/
│   ├── GET    - List all doctors
│   ├── POST   - Create new doctor
│   ├── {id}/
│   │   ├── GET    - Get doctor detail
│   │   ├── PUT    - Update doctor
│   │   ├── DELETE - Delete doctor
│   │   ├── availability/ - Get availability
│   │   ├── reviews/      - Get reviews
│   │   └── appointments/ - Get appointments
│   └── search/ - Search doctors
│
├── appointments/
│   ├── GET    - List all appointments
│   ├── POST   - Create appointment
│   ├── {id}/
│   │   ├── GET      - Get appointment detail
│   │   ├── PUT      - Update appointment
│   │   ├── DELETE   - Delete appointment
│   │   ├── confirm/ - Confirm appointment
│   │   ├── cancel/  - Cancel appointment
│   │   ├── reschedule/ - Reschedule
│   │   └── mark-completed/ - Mark complete
│   ├── upcoming/ - Get upcoming
│   ├── today/   - Get today's
│   └── overdue/ - Get overdue
│
├── medical-records/
│   ├── GET    - List records
│   ├── POST   - Create record
│   ├── {id}/
│   │   ├── GET    - Get record
│   │   ├── PUT    - Update record
│   │   └── DELETE - Delete record
│   └── ?patient_id=X - Filter by patient
│
├── laboratories/
│   ├── GET    - List tests
│   ├── POST   - Create test
│   ├── {id}/
│   │   ├── GET    - Get test
│   │   ├── PUT    - Update test
│   │   ├── DELETE - Delete test
│   │   └── mark-completed/ - Mark complete
│   └── ?completed=true - Filter by status
│
├── prescriptions/
│   ├── GET    - List prescriptions
│   ├── POST   - Create prescription
│   ├── {id}/
│   │   ├── GET    - Get prescription
│   │   ├── PUT    - Update prescription
│   │   ├── DELETE - Delete prescription
│   │   └── mark-filled/ - Mark filled
│   └── ?status=active - Filter by status
│
├── notifications/
│   ├── GET    - List notifications
│   ├── {id}/
│   │   ├── GET    - Get notification
│   │   └── mark-as-read/ - Mark read
│   ├── unread/      - Get unread
│   ├── mark-all-read/ - Mark all read
│   ├── preferences/ - Get preferences
│   │   └── PUT    - Update preferences
│   └── delete-all/ - Delete all
│
└── billing/
    ├── bills/
    │   ├── GET    - List bills
    │   ├── POST   - Create bill
    │   └── {id}/  - Bill details
    ├── payments/
    │   ├── GET    - List payments
    │   └── POST   - Create payment
    └── bill-items/
        ├── GET    - List items
        └── POST   - Create item
```

---

## 🔐 Authentication & Authorization Flow

```
┌────────────┐
│   User     │
│  Login     │
└────┬───────┘
     │
     ▼
┌─────────────────────────┐
│ Django Auth System      │
│ Verify credentials      │
└────┬────────────────────┘
     │
     ▼ (if valid)
┌─────────────────────────┐
│ Generate Token          │
│ (or create session)     │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ User receives Token     │
│ TOKEN: abc123xyz...     │
└────┬────────────────────┘
     │
     ▼ (use with each API request)
┌──────────────────────────────────┐
│ Authorization Header             │
│ Authorization: Token abc123xyz..│
└────┬─────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│ Middleware validates Token       │
│ Authenticates User               │
└────┬─────────────────────────────┘
     │
     ├─ Invalid ──→ 401 Unauthorized
     │
     └─ Valid ──→ Check Permissions
                   │
                   ├─ No Permission ──→ 403 Forbidden
                   │
                   └─ Permitted ──→ 200 OK + Data
```

---

## 📱 Request/Response Flow

```
CLIENT REQUEST
  │
  ├─ Method: GET, POST, PUT, DELETE
  ├─ URL: /api/patients/
  ├─ Headers: Authorization: Token xxx
  │           Content-Type: application/json
  └─ Body: {...JSON data...}
     │
     ▼
DJANGO ROUTER
  │
  ├─ Match URL to ViewSet
  ├─ Route to correct action
  └─ Apply authentication
     │
     ▼
PERMISSION CLASSES
  │
  ├─ Check if user is authenticated
  ├─ Check if user has permission
  └─ Allow or deny
     │
     ▼
VIEW/VIEWSET
  │
  ├─ Get query parameters
  ├─ Filter/search data
  ├─ Apply ordering
  └─ Paginate results
     │
     ▼
SERIALIZER
  │
  ├─ Convert Django models to JSON
  ├─ Validate input data
  └─ Handle nested relationships
     │
     ▼
DATABASE
  │
  ├─ Query ORM
  ├─ Apply filters
  ├─ Execute transaction
  └─ Return results
     │
     ▼
RESPONSE
  │
  ├─ Status: 200, 201, 400, 401, 404, 500
  ├─ Headers: Content-Type: application/json
  └─ Body: {...JSON response...}
     │
     ▼
CLIENT RECEIVES RESPONSE
  │
  ├─ Parse JSON
  ├─ Handle errors
  └─ Update UI
```

---

## 🔄 Appointment Lifecycle

```
1. SCHEDULED
   │
   ├─── API: POST /api/appointments/
   ├─── Status: scheduled
   └─── Notification: Appointment scheduled
        │
        ▼
2. CONFIRMED
   │
   ├─── API: POST /api/appointments/{id}/confirm/
   ├─── Status: confirmed
   └─── Notification: Appointment confirmed
        │
        ▼ (on appointment date)
3. IN_PROGRESS
   │
   ├─── Status: in_progress
   ├─── Doctor sees patient
   └─── Medical records created
        │
        ▼
4. COMPLETED
   │
   ├─── API: POST /api/appointments/{id}/mark-completed/
   ├─── Status: completed
   ├─── Prescriptions created (if any)
   └─── Lab tests requested (if any)
        │
        ▼ (alternative paths)

   OR (if cancelled)
   
   CANCELLED
   │
   ├─── API: POST /api/appointments/{id}/cancel/
   ├─── Status: cancelled
   ├─── Reason: recorded
   └─── Notification: Appointment cancelled
   
   OR (if rescheduled)
   
   RESCHEDULED
   │
   ├─── API: POST /api/appointments/{id}/reschedule/
   ├─── Status: rescheduled
   ├─── New date/time: recorded
   └─── Back to SCHEDULED state
```

---

## 💰 Billing Workflow

```
1. DRAFT
   │
   ├─── Created in system
   └─── Not visible to patient
        │
        ▼
2. ADD ITEMS
   │
   ├─── Add consultations
   ├─── Add procedures
   ├─── Add medicines
   ├─── Add lab tests
   └─── Calculate subtotal
        │
        ▼
3. APPLY TAX & DISCOUNT
   │
   ├─── Apply tax rate
   ├─── Apply discounts
   └─── Calculate total
        │
        ▼
4. ISSUED
   │
   ├─── Bill number generated
   ├─── Patient can see
   ├─── Notification sent
   └─── Payment due date set
        │
        ▼
5. PAYMENT
   │
   ├─── Patient makes payment
   ├─── Payment recorded
   ├─── Transaction ID saved
   └─── Payment notification sent
        │
        ▼
6. PAID
   │
   ├─── Status: paid
   ├─── Marked complete
   ├─── Receipt generated
   └─── Payment history recorded
```

---

## 📈 Database Optimization Strategy

```
1. INDEXES
   ├── patient.name (for search)
   ├── patient.phone (for lookup)
   ├── doctor.specialization (for filtering)
   ├── appointment.date (for scheduling)
   ├── appointment.status (for filtering)
   ├── bill.status (for filtering)
   └── notification.user (for user queries)

2. RELATIONSHIPS
   ├── ForeignKey (with related_name)
   ├── OneToOne (with cascade)
   ├── Reverse relations for efficient queries
   └── Proper use of select_related/prefetch_related

3. QUERY OPTIMIZATION
   ├── Batch operations
   ├── Pagination (50 items default)
   ├── Filtering to reduce results
   └── Caching-ready architecture

4. DATABASE FEATURES
   ├── Auto-timestamps (created_at, updated_at)
   ├── Unique constraints
   ├── Cascade delete rules
   └── Default values
```

---

## 🎯 Key Metrics

```
SYSTEM CAPACITY (Per Day)
├── Patients: 1,000+
├── Appointments: 5,000+
├── Lab Tests: 2,000+
├── Prescriptions: 3,000+
├── Notifications: 10,000+
└── Transactions: 1,000+

RESPONSE TIME (Expected)
├── List API: < 200ms
├── Detail API: < 100ms
├── Search API: < 300ms
└── Create API: < 500ms

STORAGE
├── SQLite: Suitable for < 1 GB data
├── PostgreSQL: Suitable for any size
└── Regular backups: Recommended
```

---

## 🔄 Integration Points

```
EXTERNAL SYSTEMS (Ready to integrate)
├── Email (smtp/sendgrid)
├── SMS (Twilio/Afrimotion)
├── Payment Gateway (Stripe/Flutterwave)
├── Video Consultation (Zoom/Jitsi)
├── Insurance API (external)
└── Pharmacy System (external)

MOBILE APP
├── REST API endpoints
├── Token authentication
├── Real-time notifications
└── Offline capability (planned)

THIRD-PARTY SERVICES
├── Cloud Storage (AWS S3)
├── Monitoring (Sentry)
├── Analytics (Google Analytics)
└── Logging (ELK Stack)
```

---

This architecture provides:
✅ Scalability - Handle growth easily
✅ Reliability - Proper error handling
✅ Maintainability - Clean code organization
✅ Flexibility - Easy to extend and modify
✅ Performance - Optimized queries and caching
✅ Security - Multiple layers of protection

**Ready for production deployment!** 🚀
