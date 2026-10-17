import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Stethoscope,
  UserCheck,
  FlaskConical,
  Pill,
  ReceiptText,
  Shield,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  Check,
  AlertCircle,
  Phone,
  Mail,
  DollarSign,
  Award,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { UserRole, UserProfile, Gender } from '../../types';

export const StaffManagementSection: React.FC = () => {
  const {
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    doctors,
    addDoctor,
    deleteDoctor,
    appointments,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<UserProfile | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<UserProfile | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // New Staff Form State
  const [formData, setFormData] = useState({
    role: 'doctor' as UserRole,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    department: 'Cardiology',
    bio: '',
    // Doctor clinical fields
    gender: 'M' as Gender,
    specialization: 'Cardiology',
    qualification: 'MD - Internal Medicine',
    experienceYears: 6,
    licenseNumber: `MED-${Math.floor(10000 + Math.random() * 90000)}`,
    consultationFee: 120.0,
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    bio: '',
  });

  const roleMeta: Record<
    UserRole,
    { label: string; icon: any; color: string; bg: string; border: string; defaultDept: string }
  > = {
    admin: {
      label: 'Executive Admin',
      icon: Shield,
      color: 'text-slate-800',
      bg: 'bg-slate-100',
      border: 'border-slate-300',
      defaultDept: 'Administration',
    },
    doctor: {
      label: 'Physician / Doctor',
      icon: Stethoscope,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      defaultDept: 'Cardiology',
    },
    receptionist: {
      label: 'Reception Desk',
      icon: UserCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      defaultDept: 'Front Desk',
    },
    lab_technician: {
      label: 'Laboratory Attendant',
      icon: FlaskConical,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      defaultDept: 'Diagnostic Pathology',
    },
    pharmacist: {
      label: 'Pharmacist',
      icon: Pill,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      defaultDept: 'Hospital Pharmacy',
    },
    accountant: {
      label: 'Finance Personnel',
      icon: ReceiptText,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      defaultDept: 'Financial Accounts',
    },
  };

  // KPI Calculations
  const stats = useMemo(() => {
    return {
      total: users.length,
      doctors: users.filter(u => u.role === 'doctor').length,
      reception: users.filter(u => u.role === 'receptionist').length,
      lab: users.filter(u => u.role === 'lab_technician').length,
      pharmacy: users.filter(u => u.role === 'pharmacist').length,
      finance: users.filter(u => u.role === 'accountant').length,
      admin: users.filter(u => u.role === 'admin').length,
    };
  }, [users]);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleOpenAddModal = (presetRole: UserRole = 'doctor') => {
    const defaultDept = roleMeta[presetRole].defaultDept;
    setFormData({
      role: presetRole,
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      department: defaultDept,
      bio: '',
      gender: 'M',
      specialization: defaultDept,
      qualification: 'MD - Board Certified',
      experienceYears: 5,
      licenseNumber: `MED-${Math.floor(10000 + Math.random() * 90000)}`,
      consultationFee: 100.0,
    });
    setIsAddModalOpen(true);
  };

  const handleRoleChange = (newRole: UserRole) => {
    const defaultDept = roleMeta[newRole].defaultDept;
    setFormData(prev => ({
      ...prev,
      role: newRole,
      department: defaultDept,
      specialization: defaultDept,
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    const generatedUsername =
      formData.username.trim() ||
      `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}_${Math.floor(100 + Math.random() * 900)}`;

    if (formData.role === 'doctor') {
      // Add doctor through addDoctor, which also creates their user account in HospitalContext
      addDoctor({
        name: `Dr. ${formData.firstName.trim()} ${formData.lastName.trim()}`,
        specialization: formData.department.trim() || 'General Medicine',
        phone: formData.phoneNumber.trim() || '+1 (555) 000-0000',
        email: formData.email.trim(),
        gender: formData.gender,
        qualification: formData.qualification.trim() || 'MD',
        experienceYears: Number(formData.experienceYears) || 1,
        licenseNumber: formData.licenseNumber.trim() || `LIC-${Date.now()}`,
        bio: formData.bio.trim() || `${formData.department} Specialist`,
        isAvailable: true,
        consultationFee: Number(formData.consultationFee) || 100.0,
      });
    } else {
      // Add other staff member
      addUser({
        username: generatedUsername,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        department: formData.department.trim() || roleMeta[formData.role].defaultDept,
        phoneNumber: formData.phoneNumber.trim() || '+1 (555) 000-0000',
        bio: formData.bio.trim() || `${roleMeta[formData.role].label} at MedCare Hospital`,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (user: UserProfile) => {
    setStaffToEdit(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      department: user.department,
      bio: user.bio || '',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffToEdit) return;

    updateUser(staffToEdit.id, {
      firstName: editFormData.firstName.trim(),
      lastName: editFormData.lastName.trim(),
      email: editFormData.email.trim(),
      phoneNumber: editFormData.phoneNumber.trim(),
      department: editFormData.department.trim(),
      bio: editFormData.bio.trim(),
    });

    setStaffToEdit(null);
  };

  const handleRequestDelete = (user: UserProfile) => {
    setDeleteError(null);
    if (user.id === currentUser.id) {
      setDeleteError('You cannot remove your own active administrator account.');
      return;
    }
    setStaffToDelete(user);
  };

  const handleConfirmDelete = () => {
    if (!staffToDelete) return;

    deleteUser(staffToDelete.id);
    setStaffToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Hospital Administration Console
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Staff & Personnel Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Authorize, onboard, manage, or remove doctors and any other hospital staff member across all clinical, laboratory, pharmacy, front desk, and finance units.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            onClick={() => handleOpenAddModal('doctor')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <Stethoscope className="w-4 h-4" />
            <span>+ Add Doctor</span>
          </button>

          <button
            onClick={() => handleOpenAddModal('receptionist')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Staff KPI breakdown chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div
          onClick={() => setRoleFilter('all')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Total Staff</p>
          <p className="text-2xl font-black mt-1">{stats.total}</p>
          <span className="text-[11px] font-medium opacity-80">All personnel</span>
        </div>

        <div
          onClick={() => setRoleFilter('doctor')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'doctor'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Doctors</p>
            <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-2xl font-black mt-1">{stats.doctors}</p>
          <span className="text-[11px] font-medium opacity-80">Physicians</span>
        </div>

        <div
          onClick={() => setRoleFilter('receptionist')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'receptionist'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Reception</p>
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black mt-1">{stats.reception}</p>
          <span className="text-[11px] font-medium opacity-80">Front Desk</span>
        </div>

        <div
          onClick={() => setRoleFilter('lab_technician')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'lab_technician'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Laboratory</p>
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-2xl font-black mt-1">{stats.lab}</p>
          <span className="text-[11px] font-medium opacity-80">Diagnostics</span>
        </div>

        <div
          onClick={() => setRoleFilter('pharmacist')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'pharmacist'
              ? 'bg-teal-600 text-white border-teal-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Pharmacy</p>
            <Pill className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <p className="text-2xl font-black mt-1">{stats.pharmacy}</p>
          <span className="text-[11px] font-medium opacity-80">Dispensers</span>
        </div>

        <div
          onClick={() => setRoleFilter('accountant')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'accountant'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Finance</p>
            <ReceiptText className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-black mt-1">{stats.finance}</p>
          <span className="text-[11px] font-medium opacity-80">Billing Officers</span>
        </div>

        <div
          onClick={() => setRoleFilter('admin')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'admin'
              ? 'bg-slate-700 text-white border-slate-700 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Executive</p>
            <Shield className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-2xl font-black mt-1">{stats.admin}</p>
          <span className="text-[11px] font-medium opacity-80">Administrators</span>
        </div>
      </div>

      {deleteError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{deleteError}</span>
          </div>
          <button onClick={() => setDeleteError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search staff by name, email, department..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="doctor">Doctors ({stats.doctors})</option>
            <option value="receptionist">Receptionists ({stats.reception})</option>
            <option value="lab_technician">Laboratory Attendants ({stats.lab})</option>
            <option value="pharmacist">Pharmacists ({stats.pharmacy})</option>
            <option value="accountant">Finance Personnel ({stats.finance})</option>
            <option value="admin">Administrators ({stats.admin})</option>
          </select>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Personnel Member</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4">Department / Specialty</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Clinical Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStaff.map(staff => {
                const conf = roleMeta[staff.role] || roleMeta.admin;
                const Icon = conf.icon;
                const linkedDoctor = staff.doctorId ? doctors.find(d => d.id === staff.doctorId) : null;
                const isCurrent = staff.id === currentUser.id;

                return (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Personnel Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${conf.bg} ${conf.color} border ${conf.border}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {staff.firstName} {staff.lastName}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                You
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-slate-400 text-[11px]">@{staff.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${conf.bg} ${conf.color} ${conf.border}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {conf.label}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{staff.department}</div>
                      {staff.bio && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">{staff.bio}</p>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-700">{staff.email}</span>
                        </div>
                        {staff.phoneNumber && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono text-[11px]">{staff.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Clinical Status / Doctor specific info */}
                    <td className="px-6 py-4">
                      {linkedDoctor ? (
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              linkedDoctor.isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {linkedDoctor.isAvailable ? 'Available for Consults' : 'On Leave'}
                          </span>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Fee: ${(linkedDoctor.consultationFee ?? 0).toFixed(2)} • {linkedDoctor.experienceYears ?? 0}y exp
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard Personnel</span>
                      )}
                    </td>

                    {/* Actions: Edit & Remove */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(staff)}
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit staff details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleRequestDelete(staff)}
                          disabled={isCurrent}
                          className={`p-2 rounded-xl transition-colors ${
                            isCurrent
                              ? 'text-slate-200 cursor-not-allowed'
                              : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={isCurrent ? 'Cannot remove current active session' : 'Remove staff member'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No staff members found matching criteria</p>
                    <p className="text-xs mt-1">Try adjusting your search terms or role filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW STAFF MEMBER OR DOCTOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Onboard New Hospital Staff Member
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authorize personnel credentials and assign hospital department
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5 text-xs">
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Staff Role / Position *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['doctor', 'receptionist', 'lab_technician', 'pharmacist', 'accountant', 'admin'] as UserRole[]).map(
                    r => {
                      const meta = roleMeta[r];
                      const Icon = meta.icon;
                      const isSelected = formData.role === r;

                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleChange(r)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 font-bold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${meta.bg} ${meta.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="truncate">{meta.label}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Rachel"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Hayes"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. r.hayes@hospitalsystem.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="e.g. +1 (555) 782-9901"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Login Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Optional (auto-generated if empty)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Cardiology, Front Desk, Pharmacy"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                  />
                </div>
              </div>

              {/* Special clinical fields for Doctors */}
              {formData.role === 'doctor' && (
                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold">
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                    <span>Doctor Clinical Practice Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">Specialization</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Cardiology"
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">Consultation Fee ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={formData.consultationFee}
                        onChange={e => setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-slate-800 text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">Years Experience</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={formData.experienceYears}
                        onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-slate-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">Medical Qualification</label>
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                        placeholder="e.g. MD - Johns Hopkins"
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-indigo-950 mb-1">License Number</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                        placeholder="e.g. MED-89102"
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-slate-800 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bio / Professional Notes</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Clinical background, special certifications or responsibilities..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-all"
                >
                  Save & Authorize Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STAFF MEMBER */}
      {staffToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Staff: {staffToEdit.firstName} {staffToEdit.lastName}
                </h3>
                <span className="text-xs text-slate-500">
                  Role: <strong className="capitalize">{staffToEdit.role.replace('_', ' ')}</strong>
                </span>
              </div>
              <button
                onClick={() => setStaffToEdit(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.firstName}
                    onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.lastName}
                    onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={editFormData.department}
                  onChange={e => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phoneNumber}
                  onChange={e => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editFormData.bio}
                  onChange={e => setEditFormData({ ...editFormData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStaffToEdit(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REMOVE STAFF MEMBER CONFIRMATION */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Remove Staff Member?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong>{staffToDelete.firstName} {staffToDelete.lastName}</strong> ({roleMeta[staffToDelete.role]?.label})?
              </p>
            </div>

            <div className="my-5 p-4 bg-red-50/60 rounded-2xl border border-red-100 text-xs text-red-900 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                This action immediately:
              </p>
              <ul className="list-disc list-inside text-[11px] text-red-800/90 space-y-1 pl-1">
                <li>Revokes system credentials and login access.</li>
                <li>Removes the user from active departmental dispatching.</li>
                {staffToDelete.role === 'doctor' && (
                  <li>Removes this physician from the appointment booking directory.</li>
                )}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Keep Staff Member
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
              >
                Yes, Remove Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
