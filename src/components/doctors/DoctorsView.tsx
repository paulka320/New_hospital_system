import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Search,
  Plus,
  Filter,
  Star,
  Award,
  Phone,
  Mail,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import { Doctor, Gender } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { DoctorDetailModal } from './DoctorDetailModal';

export const DoctorsView: React.FC = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('all');

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Cardiology',
    phone: '',
    email: '',
    gender: 'F' as Gender,
    qualification: '',
    experienceYears: 5,
    licenseNumber: '',
    bio: '',
    isAvailable: true,
    consultationFee: 120.0,
  });

  const specializations = useMemo(() => {
    const list = Array.from(new Set(doctors.map(d => d.specialization)));
    return list;
  }, [doctors]);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: 'General Medicine',
      phone: '',
      email: '',
      gender: 'F',
      qualification: 'MD - University Medical Center',
      experienceYears: 5,
      licenseNumber: 'MD-REG-000',
      bio: '',
      isAvailable: true,
      consultationFee: 100.0,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      phone: doc.phone,
      email: doc.email,
      gender: doc.gender,
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears,
      licenseNumber: doc.licenseNumber || '',
      bio: doc.bio || '',
      isAvailable: doc.isAvailable,
      consultationFee: doc.consultationFee,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, formData);
    } else {
      addDoctor(formData);
    }
    setIsFormOpen(false);
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.includes(searchQuery);
      const matchesSpec = specFilter === 'all' || d.specialization === specFilter;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, searchQuery, specFilter]);

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {selectedDoctor && (
        <DoctorDetailModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onEdit={doc => {
            setSelectedDoctor(null);
            handleOpenEdit(doc);
          }}
        />
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Physicians & Medical Staff</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Specialist roster, consultations, credentials and availability
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5" />
          <span>Department:</span>
          <select
            value={specFilter}
            onChange={e => setSpecFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Specialties</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoctor(doc)}
            className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
                    Dr.
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                      Dr. {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600">{doc.specialization}</p>
                  </div>
                </div>

                <span
                  onClick={e => {
                    e.stopPropagation();
                    updateDoctor(doc.id, { isAvailable: !doc.isAvailable });
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    doc.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  title="Click to toggle availability"
                >
                  {doc.isAvailable ? 'Available' : 'On Leave'}
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {doc.bio || `${doc.qualification} with ${doc.experienceYears} years of practice.`}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Experience:</span>
                  <span className="font-semibold text-slate-800">{doc.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Consultation Fee:</span>
                  <span className="font-bold text-slate-900">${doc.consultationFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Rating:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {doc.averageRating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px] truncate max-w-32">{doc.phone}</span>
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                  title="Edit doctor"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove Dr. ${doc.name} from directory?`)) {
                      deleteDoctor(doc.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100"
                  title="Delete doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Doctor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-base">
                  {editingDoctor ? 'Edit Doctor Profile' : 'Add New Medical Doctor'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Cardiology, Neurology"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@hospital.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={e => setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualifications & Board Certifications</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. MD, FACC - Harvard Medical School"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professional Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Clinical interests, specialty focus, research..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="docAvailable"
                  checked={formData.isAvailable}
                  onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="docAvailable" className="font-semibold text-slate-700">Currently active on clinical roster</label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  {editingDoctor ? 'Update Doctor' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
