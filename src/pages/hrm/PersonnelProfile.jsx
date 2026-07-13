import React, { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/common/fotter";
import PersonnelHeader from "../../components/hrm/personnel/PersonnelHeader";
import SystemIdentifier from "../../components/hrm/personnel/SystemIdentifier";
import ProfilePhoto from "../../components/hrm/personnel/ProfilePhoto";
import PersonalInformation from "../../components/hrm/personnel/PersonalInformation";
import ProfessionalInformation from "../../components/hrm/personnel/ProfessionalInformation";
import SkillsProficiency from "../../components/hrm/personnel/SkillsProficiency";
import ServiceHistory from "../../components/hrm/personnel/ServiceHistory";
import { employeeAPI } from "../../services/api";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  employeeId: '',
  firstName: '', lastName: '', dateOfBirth: '', gender: '',
  cnic: '', phone: '', email: '', emergencyContact: '',
  designation: '', trade: '', employmentType: 'Permanent',
  employmentStatus: 'Draft', unit: 'CMES ISB/LHR', geAe: 'GE SOUTH',
  joiningDate: '', department: '', skills: [], serviceHistory: [],
  profilePhoto: '',
};

export default function PersonnelProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  // Load employee data if editing
  React.useEffect(() => {
    if (editId) {
      employeeAPI.getById(editId).then(({ data }) => {
        if (data.success) setForm({ ...EMPTY_FORM, ...data.data });
      }).catch(() => toast.error('Failed to load employee'));
    }
  }, [editId]);

  const update = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async (status) => {
    setLoading(true);
    try {
      const payload = { ...form };
      if (status) {
        payload.employmentStatus = status;
      }
      const res = editId
        ? await employeeAPI.update(editId, payload)
        : await employeeAPI.create(payload);
      if (res.data.success) {
        if (status === 'Draft') {
          toast.success('Employee saved as draft');
        } else {
          toast.success(editId ? 'Employee updated' : 'Employee created');
        }
        navigate('/department');
      } else {
        toast.error(res.data.error || 'Operation failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#C8E1FA] font-sans">
      <PersonnelHeader
        loading={loading}
        onSaveDraft={() => handleSave('Draft')}
        onSubmit={() => handleSave()}
        onCancel={() => navigate('/department')}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4">
        <SystemIdentifier value={form.employeeId} onChange={(v) => update('employeeId', v)} />
        <ProfilePhoto value={form.profilePhoto} onChange={(v) => update('profilePhoto', v)} />
        <PersonalInformation
          values={form}
          onChange={update}
        />
        <ProfessionalInformation
          values={form}
          onChange={update}
        />
        <SkillsProficiency
          skills={form.skills}
          onChange={(skills) => update('skills', skills)}
        />
        <ServiceHistory
          entries={form.serviceHistory}
          onChange={(entries) => update('serviceHistory', entries)}
        />
      </div>
      <Footer />
    </div>
  );
}
