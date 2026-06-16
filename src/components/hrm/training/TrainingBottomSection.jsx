import React from 'react';

export default function TrainingBottomSection({ scoreData, upcomingData, instructorData, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const scoreDistData = scoreData ? [
    { label: 'High Pass', count: scoreData.highPass || 0, pct: scoreData.highPass ? Math.min(Math.round((scoreData.highPass / Math.max(scoreData.highPass + scoreData.pass + scoreData.lowPass + scoreData.fail, 1)) * 100), 100) : 0, color: 'bg-blue-600' },
    { label: 'Pass', count: scoreData.pass || 0, pct: scoreData.pass ? Math.min(Math.round((scoreData.pass / Math.max(scoreData.highPass + scoreData.pass + scoreData.lowPass + scoreData.fail, 1)) * 100), 100) : 0, color: 'bg-blue-400' },
    { label: 'Low Pass', count: scoreData.lowPass || 0, pct: scoreData.lowPass ? Math.min(Math.round((scoreData.lowPass / Math.max(scoreData.highPass + scoreData.pass + scoreData.lowPass + scoreData.fail, 1)) * 100), 100) : 0, color: 'bg-blue-200' },
    { label: 'Fail', count: scoreData.fail || 0, pct: scoreData.fail ? Math.min(Math.round((scoreData.fail / Math.max(scoreData.highPass + scoreData.pass + scoreData.lowPass + scoreData.fail, 1)) * 100), 100) : 0, color: 'bg-red-300' },
  ] : [];

  const upcoming = upcomingData && upcomingData.length > 0 ? upcomingData : [];
  const instructors = instructorData && instructorData.length > 0 ? instructorData : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Score Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-800 mb-3">Score Distribution</h3>

        <div className="flex flex-col gap-2 mb-4">
          {scoreDistData.length === 0 ? (
            <p className="text-gray-400 text-xs">No score data available</p>
          ) : (
            scoreDistData.map((r, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-gray-500">{r.label}</span>
                  <span className="text-[10px] font-bold text-gray-700">{r.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-black text-gray-900">{scoreData?.avgScore || '—'}</div>
            <div className="text-[9px] text-gray-400">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-gray-900">{scoreData?.scoreRange || '—'}</div>
            <div className="text-[9px] text-gray-400">Score Range</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-gray-900">{scoreData?.highest || '—'}</div>
            <div className="text-[9px] text-gray-400">Highest</div>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-800 mb-3">Upcoming Schedule</h3>
        <div className="flex flex-col gap-2.5">
          {upcoming.length === 0 ? (
            <p className="text-gray-400 text-xs">No upcoming programs</p>
          ) : (
            upcoming.map((s, i) => (
              <div key={s._id || i} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1`} />
                <div>
                  <div className="text-xs font-semibold text-gray-800 leading-tight">{s.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {s.startDate ? new Date(s.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Instructors */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-xs font-bold text-gray-800 mb-3">Active Instructors</h3>
        <div className="flex flex-col gap-2.5">
          {instructors.length === 0 ? (
            <p className="text-gray-400 text-xs">No instructors found</p>
          ) : (
            instructors.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${a.color || 'bg-blue-600'} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
                    {a.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                  </div>
                  <span className="text-xs text-gray-700 font-medium leading-tight">{a.name}</span>
                </div>
                <span className="text-xs font-black text-blue-600">{a.score}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
