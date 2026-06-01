import React from "react";
import ProfileActionBar from "../../components/hrm/profile/ProfileActionBar";
import ProfileMetaBar from "../../components/hrm/profile/ProfileMetaBar";
import ProfileHero from "../../components/hrm/profile/ProfileHero";
import ProfileKPICards from "../../components/hrm/profile/ProfileKPICards";
import ProfileCharts from "../../components/hrm/profile/ProfileCharts";
import PersonalInformation from "../../components/hrm/profile/PersonalInformation";
import ProfessionalEmployment from "../../components/hrm/profile/ProfessionalEmployment";
import ServiceHistoryLog from "../../components/hrm/profile/ServiceHistoryLog";
import KPIsSection from "../../components/hrm/profile/KPIsSection";
import SkillsCertifications from "../../components/hrm/profile/SkillsCertifications";
import AccountOverview from "../../components/hrm/profile/AccountOverview";
import UserAccountLinkage from "../../components/hrm/profile/UserAccountLinkage";
import Footer from "../../components/common/fotter";

export default function EmployeeProfile() {
  return (
    <div className="min-h-screen bg-[#dce9f7] font-sans">
      <ProfileActionBar />
      <ProfileMetaBar />
      <div className="max-w-[2560px] mx-auto px-4 sm:px-5 py-4 flex flex-col gap-4">
        <ProfileHero />
        <ProfileKPICards />
        <ProfileCharts />
        {/* Main content: Left (2/3) + Right (1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 flex flex-col gap-4">
            <PersonalInformation />
            <ProfessionalEmployment />
            <ServiceHistoryLog />
            <KPIsSection />
          </div>
          <div className="xl:col-span-1 flex flex-col gap-4">
            <SkillsCertifications />
            <AccountOverview />
            <UserAccountLinkage />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
