import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Plus } from 'lucide-react';

const createEntry = () => ({ company: '', designation: '', fromDate: '', toDate: '' });

export default function ServiceHistory({ entries = [], onChange }) {
  const navigate = useNavigate();

  const addEntry = () => {
    onChange([...entries, createEntry()]);
  };

  const removeEntry = (i) => onChange(entries.filter((_, idx) => idx !== i));

  const updateEntry = (i, field, value) => {
    onChange(entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded flex items-center justify-center">
            <img src="/33.png" alt="" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Service History</h2>
        </div>
        <button
          onClick={addEntry}
          className="flex items-center gap-1.5 bg-[#137FEC] hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-md transition-colors cursor-pointer"
        >
          <PlusCircle size={13} />
          Add Entry
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Company Name', 'Designation', 'From Date', 'To Date', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-[#1A6fC4]' : 'bg-[#89B4E0]'}>
                <td className="px-4 py-3">
                  <input
                    value={entry.company || ''}
                    onChange={e => updateEntry(i, 'company', e.target.value)}
                    placeholder="Add New Company"
                    className={`text-sm w-full bg-transparent outline-none placeholder-blue-200 ${i % 2 === 0 ? 'text-black' : 'text-white'}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={entry.designation || ''}
                    onChange={e => updateEntry(i, 'designation', e.target.value)}
                    placeholder="Add Role"
                    className={`text-sm w-full bg-transparent outline-none placeholder-blue-200 ${i % 2 === 0 ? 'text-black' : 'text-white'}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={entry.fromDate || ''}
                    onChange={e => updateEntry(i, 'fromDate', e.target.value)}
                    placeholder="--/--/----"
                    className={`text-sm w-full bg-transparent outline-none placeholder-blue-200 ${i % 2 === 0 ? 'text-black' : 'text-white'}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={entry.toDate || ''}
                    onChange={e => updateEntry(i, 'toDate', e.target.value)}
                    placeholder="--/--/----"
                    className={`text-sm w-full bg-transparent outline-none placeholder-blue-200 ${i % 2 === 0 ? 'text-black' : 'text-white'}`}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  {entries.length > 1 ? (
                    <button onClick={() => removeEntry(i)} className="text-white hover:text-red-300 transition-colors cursor-pointer">
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <button onClick={addEntry} className="text-white hover:text-white transition-colors cursor-pointer">
                      <Plus size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
