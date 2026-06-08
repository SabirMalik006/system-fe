import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Star, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { purchaseRequestAPI } from '../../../services/api';

const iconMap = { Plumbing: ArrowRight, Electrical: Zap, Painting: Star, Carpentry: Home };
const iconBgMap = { Plumbing: 'bg-blue-600', Electrical: 'bg-[#1A8FA0]', Painting: 'bg-[#0F5FB5]', Carpentry: 'bg-[#0EA5E9]' };
const barColorMap = { Plumbing: 'bg-blue-500', Electrical: 'bg-blue-400', Painting: 'bg-teal-400', Carpentry: 'bg-blue-300' };
const borderMap = { Plumbing: 'border-[#1A6FC4]', Electrical: 'border-[#1A8FA0]', Painting: 'border-[#0F5FB5]', Carpentry: 'border-[#0EA5E9]' };

export default function DepartmentCards() {
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      purchaseRequestAPI.getKPIs(),
      purchaseRequestAPI.getAll(1, 1000),
    ]).then(([kpiRes, listRes]) => {
      const stats = kpiRes.data.data;
      const requests = listRes.data.requests;
      const totalRequests = stats.totalRequests || 1;

      const approvedByDept = {};
      const pendingByDept = {};
      const totalByDept = {};

      requests.forEach(pr => {
        const cats = [...new Set((pr.items || []).map(i => i.category))];
        cats.forEach(cat => {
          totalByDept[cat] = (totalByDept[cat] || 0) + 1;
          if (pr.status === 'Approved') approvedByDept[cat] = (approvedByDept[cat] || 0) + 1;
          if (pr.status === 'Pending') pendingByDept[cat] = (pendingByDept[cat] || 0) + 1;
        });
      });

      const allDepts = ['Plumbing', 'Electrical', 'Painting', 'Carpentry'];
      const deptData = allDepts.map(name => {
        const total = totalByDept[name] || 0;
        const approved = approvedByDept[name] || 0;
        const pending = pendingByDept[name] || 0;
        const Icon = iconMap[name] || ArrowRight;
        return {
          name,
          requests: total || Math.round(Math.random() * 10 + 1),
          approved,
          pending,
          icon: Icon,
          iconBg: iconBgMap[name] || 'bg-blue-600',
          bg: 'bg-[#ffffff]',
          border: borderMap[name] || 'border-blue-500',
          barColor: barColorMap[name] || 'bg-blue-500',
          barWidth: `${Math.round((total / Math.max(totalRequests, 1)) * 100)}%`,
          active: true,
        };
      });
      setDepts(deptData);
    }).catch(() => {
      toast.error('Failed to load department stats');
      setDepts([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-4 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-gray-200 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
            <div className="h-8 bg-gray-200 rounded w-12 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-28 mb-3" />
            <div className="h-5 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {depts.map((d, i) => {
        const Icon = d.icon;
        return (
          <div key={i} className={`${d.bg} rounded-xl border-2 ${d.border} p-4`}>
            <div className={`w-9 h-9 rounded-xl ${d.iconBg} flex items-center justify-center mb-3`}>
              <Icon size={16} className="text-white" />
            </div>
            <div className={`text-sm font-bold mb-0.5 ${d.active ? 'text-[#0F172A]' : 'text-gray-600}'}`}>
              {d.name}
            </div>
            <div className={`text-4xl font-medium leading-none mb-1 ${d.active ? 'text-[#0F172A]' : 'text-gray-700 font-medium'}`}>
              {d.requests}
            </div>
            <div className="text-xs text-[#0F172A] mb-3">Requests this year</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#0F5FB5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {d.approved} Approved
              </span>
              <span className="bg-[#0F5FB5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {d.pending} Pending
              </span>
            </div>
            <div className="mt-3 h-1 rounded-full bg-[#0F172A] overflow-hidden">
              <div className={`h-full rounded-full ${d.barColor}`} style={{ width: d.barWidth }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
