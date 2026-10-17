import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Star,
  Clock,
  Calendar,
  Phone,
  Mail,
  Award,
  DollarSign,
  User,
  MessageSquare,
} from 'lucide-react';
import { Doctor } from '../../types';
import { useHospital } from '../../context/HospitalContext';

interface DoctorDetailModalProps {
  doctor: Doctor;
  onClose: () => void;
  onEdit: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onEdit,
}) => {
  const { doctorAvailabilities, doctorReviews, addDoctorReview, patients } = useHospital();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [patientName, setPatientName] = useState(patients[0]?.name || 'Anonymous Patient');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const daysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const availabilities = doctorAvailabilities.filter(a => a.doctorId === doctor.id);
  const reviews = doctorReviews.filter(r => r.doctorId === doctor.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;
    addDoctorReview({
      doctorId: doctor.id,
      patientName,
      rating,
      comment,
    });
    setComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold shadow-inner">
              Dr.
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Dr. {doctor.name}</h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  doctor.isAvailable ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' : 'bg-red-500/20 text-red-200 border border-red-400/30'
                }`}>
                  {doctor.isAvailable ? 'Available on duty' : 'On Leave'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1 font-medium">{doctor.specialization} • {doctor.experienceYears} Years Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(doctor)}
              className="px-3 py-1.5 rounded-lg bg-white text-indigo-900 text-xs font-semibold hover:bg-indigo-50"
            >
              Edit Staff
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Quick stats banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Consultation Fee</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">${doctor.consultationFee.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Patients Treated</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{doctor.totalPatients}+</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Staff Rating</span>
              <p className="text-base font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {doctor.averageRating.toFixed(1)} / 5.0
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">License ID</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1 truncate">{doctor.licenseNumber || 'MD-REG-001'}</p>
            </div>
          </div>

          {/* Credentials & Bio */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Qualifications & Background</h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-medium">{doctor.qualification || 'Certified Medical Practitioner'}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{doctor.bio || 'Experienced healthcare specialist providing compassionate clinical care.'}</p>
              <div className="flex items-center gap-6 pt-2 text-slate-500 border-t border-slate-200">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {doctor.phone}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {doctor.email}</span>
              </div>
            </div>
          </div>

          {/* Weekly Availability Schedule */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Weekly Clinic Hours</h4>
            {availabilities.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-center">
                Standard hours: Monday – Friday, 09:00 AM – 05:00 PM
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availabilities.map(av => (
                  <div key={av.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{daysMap[av.dayOfWeek]}</span>
                    <span className="font-mono text-indigo-700 font-medium">{av.startTime} - {av.endTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Patient Reviews & Feedback */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm">Patient Reviews & Testimonials ({reviews.length})</h4>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {showReviewForm ? 'Cancel' : '+ Write a Review'}
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 mb-4 space-y-3">
                <h5 className="font-bold text-indigo-900 text-xs uppercase">Submit Patient Feedback</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Star Rating (1 - 5)</label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Review Comments</label>
                  <textarea
                    required
                    rows={2}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe your consultation experience..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  Post Review
                </button>
              </form>
            )}

            <div className="space-y-2.5">
              {reviews.length === 0 ? (
                <p className="text-slate-400 italic">No reviews yet for this doctor.</p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.patientName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">{rev.createdAt.split('T')[0]}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
