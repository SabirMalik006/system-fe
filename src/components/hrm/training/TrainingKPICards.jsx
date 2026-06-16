import React from 'react';

export default function TrainingKPICards({ data, loading }) {
  const cards = data ? [
    { label: 'TOTAL PROGRAMS', value: data.totalPrograms, badge: null, sub: 'Active this quarter' },
    { label: 'ENROLLED', value: data.totalEnrolled, badge: { text: `${data.totalPrograms > 0 ? ((data.totalEnrolled / Math.max(data.totalPrograms, 1)).toFixed(1)) : 0}/prog`, style: 'bg-[#2563EB] text-white' }, sub: 'Participants total' },
    { label: 'COMPLETED', value: data.totalCompleted, suffix: `/ ${data.completionRate}%`, badge: null, sub: 'Course completion rate' },
    { label: 'ABSENT / MISSED', value: data.absences, badge: { text: data.absences > 0 ? `${((data.absences / Math.max(data.totalEnrolled, 1)) * 100).toFixed(1)}%` : '0%', style: 'bg-red-100 text-red-600' }, sub: 'Non-attendance rate' },
    { label: 'AVG SCORE', value: data.avgScore, badge: null, sub: 'out of 100 points' },
    { label: 'INSTRUCTORS', value: data.instructorCount, badge: null, sub: 'Active trainers' },
  ] : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-md border border-gray-100 shadow-sm p-5 border-l-8 border-l-[#2563EB] animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-16 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-md border border-gray-100 shadow-sm p-5 border-l-8 ${
            card.badge?.style?.includes('2563EB')
              ? 'border-l-[#2563EB]'
              : card.badge?.style?.includes('red')
                ? 'border-l-[#0EA5E9]'
                : 'border-l-[#2563EB]'
          }`}
        >
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {card.label}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="text-3xl font-bold text-gray-900">
              {card.value}
            </div>
            {card.badge && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${card.badge.style}`}>
                {card.badge.text}
              </span>
            )}
            {card.suffix && (
              <span className="text-sm text-gray-400 font-medium">
                {card.suffix}
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-400">
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
