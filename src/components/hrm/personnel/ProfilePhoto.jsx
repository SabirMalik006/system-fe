import React, { useRef } from 'react';
import { User, Camera } from 'lucide-react';

export default function ProfilePhoto({ value, onChange }) {
  const fileRef = useRef();

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  const handleRemove = () => {
    onChange('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200 overflow-hidden">
            {value ? (
              <img src={value} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-gray-400" />
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-blue-600 transition-colors"
          >
            <Camera size={11} className="text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>

        <div className="flex-1 mt-1">
          <h3 className="text-base font-bold text-gray-900 mb-0.5">Profile Photo</h3>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Upload a high-resolution professional headshot. JPEG or PNG, max 5MB.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="text-blue-500 hover:text-blue-700 text-xs font-bold transition-colors"
            >
              Upload New
            </button>
            {value && (
              <button onClick={handleRemove} className="text-red-400 hover:text-red-600 text-xs font-bold transition-colors">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-4">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill={s <= 3 ? '#e5e7eb' : '#e5e7eb'}>
            <path d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5L7 1z" />
          </svg>
        ))}
      </div>
    </div>
  );
}
