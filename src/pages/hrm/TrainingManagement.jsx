import React from "react";
import TrainingHeader from "../../components/hrm/training/TrainingHeader";
import TrainingKPICards from "../../components/hrm/training/TrainingKPICards";
import TrainingTopCharts from "../../components/hrm/training/TrainingTopCharts";
import TrainingPrograms from "../../components/hrm/training/TrainingPrograms";
import ParticipantTracking from "../../components/hrm/training/ParticipantTracking";
import TrainingBottomSection from "../../components/hrm/training/TrainingBottomSection";

export default function TrainingManagement() {
  return (
    <div className="min-h-screen bg-[#e8f0f8] font-sans">
      <div className="max-w-[2560px] mx-auto px-4 py-5 flex flex-col gap-4">
        <TrainingHeader />
        <TrainingKPICards />
        <TrainingTopCharts />
        <TrainingPrograms />
        <ParticipantTracking />
        <TrainingBottomSection />
      </div>
    </div>
  );
}
