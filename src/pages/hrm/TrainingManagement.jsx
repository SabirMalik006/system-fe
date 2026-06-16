import React, { useState, useEffect, useCallback } from 'react';
import TrainingHeader from '../../components/hrm/training/TrainingHeader';
import TrainingKPICards from '../../components/hrm/training/TrainingKPICards';
import TrainingTopCharts from '../../components/hrm/training/TrainingTopCharts';
import TrainingPrograms from '../../components/hrm/training/TrainingPrograms';
import ParticipantTracking from '../../components/hrm/training/ParticipantTracking';
import TrainingBottomSection from '../../components/hrm/training/TrainingBottomSection';
import { trainingAPI } from '../../services/api';

export default function TrainingManagement() {
  const [kpiData, setKpiData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [upcomingData, setUpcomingData] = useState([]);
  const [instructorData, setInstructorData] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [programsPagination, setProgramsPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [participants, setParticipants] = useState([]);
  const [participantsPagination, setParticipantsPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [kpiRes, trendRes, enrollRes, catRes, scoreRes, upRes, instRes, progRes, partRes] = await Promise.all([
        trainingAPI.getKPIStats(),
        trainingAPI.getMonthlyTrend(),
        trainingAPI.getEnrollmentStatus(),
        trainingAPI.getCategoryDist(),
        trainingAPI.getScoreDist(),
        trainingAPI.getUpcoming(),
        trainingAPI.getTopInstructors(),
        trainingAPI.getAll({ page: 1, limit: 10 }),
        trainingAPI.getParticipants({ page: 1, limit: 10 }),
      ]);
      setKpiData(kpiRes.data.data);
      setTrendData(trendRes.data.data);
      setEnrollmentData(enrollRes.data.data);
      setCategoryData(catRes.data.data);
      setScoreData(scoreRes.data.data);
      setUpcomingData(upRes.data.data);
      setInstructorData(instRes.data.data);
      setPrograms(progRes.data.data);
      setProgramsPagination(progRes.data.pagination);
      setParticipants(partRes.data.data);
      setParticipantsPagination(partRes.data.pagination);
    } catch (err) {
      console.error('Failed to fetch training data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll, refreshKey]);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="min-h-screen bg-[#e8f0f8] font-sans">
      <div className="max-w-[2560px] mx-auto px-4 py-5 flex flex-col gap-4">
        <TrainingHeader onRefresh={handleRefresh} />
        <TrainingKPICards data={kpiData} loading={loading} />
        <TrainingTopCharts
          trendData={trendData}
          enrollmentData={enrollmentData}
          categoryData={categoryData}
          loading={loading}
        />
        <TrainingPrograms
          programs={programs}
          pagination={programsPagination}
          onRefresh={handleRefresh}
          onPageChange={(page) => {
            trainingAPI.getAll({ page, limit: 10 }).then(res => {
              setPrograms(res.data.data);
              setProgramsPagination(res.data.pagination);
            });
          }}
        />
        <ParticipantTracking
          participants={participants}
          pagination={participantsPagination}
          onRefresh={handleRefresh}
          onPageChange={(page) => {
            trainingAPI.getParticipants({ page, limit: 10 }).then(res => {
              setParticipants(res.data.data);
              setParticipantsPagination(res.data.pagination);
            });
          }}
        />
        <TrainingBottomSection
          scoreData={scoreData}
          upcomingData={upcomingData}
          instructorData={instructorData}
          loading={loading}
        />
      </div>
    </div>
  );
}
