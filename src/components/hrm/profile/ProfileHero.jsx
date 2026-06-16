import React from 'react';
import { Phone, MessageSquare, IdCard, CheckCircle, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileHero({ employee = {} }) {
  const name = `${employee.firstName || 'Muhammad'} ${employee.lastName || 'Jameel'}`;
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'MJ';
  const id = employee.employeeId || 'EMP-8530879';
  const status = employee.employmentStatus || 'Active';
  const unit = employee.unit || 'CMES COMLOG';
  const designation = employee.designation || 'Senior Lineman | Electrical Services';
  const rating = employee.rating || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
      <div className="flex items-start gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-26 sm:h-28 rounded-2xl overflow-hidden border-2 border-gray-100 flex items-center justify-center bg-[#1A6FC4] text-white text-2xl font-bold">
            {employee.profilePhoto ? (
              <img src={employee.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <span className={`absolute bottom-4 right-2 w-3.5 h-3.5 rounded-full border-2 border-white ${status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <div className="flex items-center gap-0.5 mt-2 justify-center">
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill={s <= rating ? '#1a3a8f' : '#e2e8f0'}>
                <path d="M6 1l1.5 3L11 4.5 8.5 7l.5 3.5L6 9 3 10.5l.5-3.5L1 4.5 4.5 4z"/>
              </svg>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-medium text-gray-900 leading-tight">{name}</h1>
          <p className="text-sm font-semibold text-[#137FEC] mt-0.5">{designation}</p>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
           <div className='bg-[#DBEAFE] flex gap-3 py-2 px-2 rounded-sm' >
             <div className="flex items-center gap-1.5 text-xs text-[#1A6FC4] bg-[#DBEAFE]">
              <IdCard size={12} className="text-[#1A6FC4]" />
              <span>ID: {id}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#1A6FC4] bg-[#DBEAFE]">
              <CheckCircle size={12} className="text-[#1A6FC4]" />
              <span>Status: <span className="font-semibold text-[#1A6FC4]">{status}</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#1A6FC4] bg-[#DBEAFE]">
              <Building size={12} className="text-[#1A6FC4]" />
              <span className="font-medium">{unit}</span>
            </div>
           </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => toast.success(`Calling ${employee.phone || 'N/A'}...`)}
            className="w-9 h-9 bg-[#DBEAFE] hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <Phone size={16} className="text-blue-600" />
          </button>
          <button
            onClick={() => {
              if (employee.email) { navigator.clipboard.writeText(employee.email); toast.success('Email copied'); }
              else toast.error('No email on record');
            }}
            className="w-9 h-9 bg-[#DBEAFE] hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <MessageSquare size={16} className="text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
