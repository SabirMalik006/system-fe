import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, DollarSign, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { purchaseRequestAPI } from '../../../services/api';

const kpiConfig = [
  { label: 'Total Requests', key: 'totalRequests', icon: FileText },
  { label: 'Pending Approval', key: 'pendingApproval', icon: Clock },
  { label: 'Approved', key: 'approved', icon: CheckCircle },
  { label: 'Rejected', key: 'rejected', icon: XCircle },
  { label: 'Total PO Value', key: 'totalPOValue', icon: DollarSign, format: 'currency' },
  { label: 'Active Vendors', key: 'activeVendors', icon: Users, hardcoded: 12 },
];

const bgColors = ['bg-[#1E4D7B]', 'bg-[#163A50]', 'bg-[#1E4D7B]', 'bg-[#163A50]', 'bg-[#1E4D7B]', 'bg-[#1E4D7B]'];

export default function ProcurementKPIs() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    purchaseRequestAPI.getKPIs()
      .then(res => setStats(res.data.data))
      .catch(() => toast.error('Failed to load KPIs'));
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpiConfig.map((k, i) => {
        const Icon = k.icon;
        let value;
        if (k.hardcoded) {
          value = k.hardcoded;
        } else if (stats) {
          const raw = stats[k.key];
          value = k.format === 'currency' ? `Rs ${(raw / 1000).toFixed(1)}K` : raw;
        } else {
          value = '...';
        }
        return (
          <div key={k.key} className={`${bgColors[i]} rounded-xl px-4 py-2 border border-[#1e3a5f]`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-white tracking-wider uppercase leading-tight">{k.label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="text-white" />
              </div>
            </div>
            <div className="text-3xl font-medium leading-none mb-1.5 text-white">{value}</div>
          </div>
        );
      })}
    </div>
  );
}
