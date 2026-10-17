import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Shield,
  HeartPulse,
  X,
  Check,
} from 'lucide-react';
import { Patient, Gender, BloodType } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { PatientDetailModal } from './PatientDetailModal';

export const PatientsView: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [bloodFilter, setBloodFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  // Modals
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '1990-01-01',
    age: 35,
    gender: 'M' as Gender,
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    bloodType: 'O+' as BloodType,
    emergencyContact: '',
    emergencyContactName: '',
    allergies: '',
    chronicDiseases: '',
    insuranceProvider: '',
    insuranceId: '',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      dateOfBirth: '1990-01-01',
      age: 35,
      gender: 'M',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      bloodType: 'O+',
      emergencyContact: '',
      emergencyContactName: '',
      allergies: '',
      chronicDiseases: '',
      insuranceProvider: '',
      insuranceId: '',
      isActive: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (pat: Patient) => {
    setEditingPatient(pat);
    setFormData({
      name: pat.name,
      dateOfBirth: pat.dateOfBirth,
      age: pat.age,
      gender: pat.gender,
      phone: pat.phone,
      email: pat.email || '',
      address: pat.address || '',
      city: pat.city || '',
      state: pat.state || '',
      bloodType: pat.bloodType || 'O+',
      emergencyContact: pat.emergencyContact || '',
      emergencyContactName: pat.emergencyContactName || '',
      allergies: pat.allergies || '',
      chronicDiseases: pat.chronicDiseases || '',
      insuranceProvider: pat.insuranceProvider || '',
      insuranceId: pat.insuranceId || '',
      isActive: pat.isActive,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingPatient) {
      updatePatient(editingPatient.id, formData);
    } else {
      addPatient(formData);
    }
    setIsFormOpen(false);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.chronicDiseases && p.chronicDiseases.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBlood = bloodFilter === 'all' || p.bloodType === bloodFilter;
      const matchesGender = genderFilter === 'all' || p.gender === genderFilter;

      return matchesSearch && matchesBlood && matchesGender;
    });
  }, [patients, searchQuery, bloodFilter, genderFilter]);

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onEditPatient={pat => {
            setSelectedPatient(null);
            handleOpenEdit(pat);
          }}
        />
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage comprehensive clinical records, insurance and medical history
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, condition..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Blood:</span>
            <select
              value={bloodFilter}
              onChange={e => setBloodFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Gender:</span>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Age / Gender</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Blood Type</th>
                <th className="px-5 py-3.5">Insurance</th>
                <th className="px-5 py-3.5">Allergies / Conditions</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(pat => (
                  <tr
                    key={pat.id}
                    onClick={() => setSelectedPatient(pat)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {pat.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{pat.name}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-0.5">{pat.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-700">
                      {pat.age} yrs • {pat.gender === 'M' ? 'Male' : pat.gender === 'F' ? 'Female' : 'Other'}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <div>{pat.phone}</div>
                      {pat.email && <div className="text-[11px] text-slate-400 truncate max-w-44">{pat.email}</div>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                        {pat.bloodType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-700">
                      {pat.insuranceProvider ? (
                        <div>
                          <p className="font-medium">{pat.insuranceProvider}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{pat.insuranceId}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Self-pay</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 max-w-xs truncate">
                      {pat.allergies || pat.chronicDiseases ? (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                          {pat.allergies || pat.chronicDiseases}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedPatient(pat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title="View patient charts & history"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(pat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                          title="Edit patient"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${pat.name}?`)) {
                              deletePatient(pat.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                          title="Delete patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Patient Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-base">
                  {editingPatient ? 'Edit Patient Information' : 'Register New Patient'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Adams"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={e => {
                        const dob = e.target.value;
                        const age = new Date().getFullYear() - new Date(dob).getFullYear();
                        setFormData({ ...formData, dateOfBirth: dob, age: Math.max(0, age) });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Type</label>
                  <select
                    value={formData.bloodType}
                    onChange={e => setFormData({ ...formData, bloodType: e.target.value as BloodType })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address, Apt"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Person</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="e.g. Jane Doe (Spouse)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="+1 (555) 999-0000"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Peanuts"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chronic Diseases</label>
                  <input
                    type="text"
                    value={formData.chronicDiseases}
                    onChange={e => setFormData({ ...formData, chronicDiseases: e.target.value })}
                    placeholder="e.g. Type 2 Diabetes, Hypertension"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    value={formData.insuranceProvider}
                    onChange={e => setFormData({ ...formData, insuranceProvider: e.target.value })}
                    placeholder="e.g. Blue Cross Blue Shield"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Policy / Member ID</label>
                  <input
                    type="text"
                    value={formData.insuranceId}
                    onChange={e => setFormData({ ...formData, insuranceId: e.target.value })}
                    placeholder="e.g. BCBS-99120"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  {editingPatient ? 'Update Patient' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
