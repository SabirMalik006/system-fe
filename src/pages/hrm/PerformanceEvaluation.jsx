import React from "react";
import PerformanceHeader from "../../components/hrm/performance/PerformanceHeader";
import NewEvaluationForm from "../../components/hrm/performance/NewEvaluationForm";
import RatingAndTrend from "../../components/hrm/performance/RatingAndTrend";
import EvaluationHistory from "../../components/hrm/performance/EvaluationHistory";
import TopPerformersLeaderboard from "../../components/hrm/performance/TopPerformersLeaderboard";
import KPIHeatmap from "../../components/hrm/performance/KPIHeatmap";

export default function PerformanceEvaluation() {
  return (
    <div className="min-h-screen bg-[#e8f0f8] font-sans">
      <div className="w-full max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-5 flex flex-col gap-5">
        <PerformanceHeader />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-1">
            <NewEvaluationForm />
          </div>
          <div className="xl:col-span-2 flex flex-col gap-5">
            <RatingAndTrend />
            <EvaluationHistory />
          </div>
        </div>
        <TopPerformersLeaderboard />
        <KPIHeatmap />
      </div>
    </div>
  );
}
