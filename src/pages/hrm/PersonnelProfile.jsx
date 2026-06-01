import React from "react";
import Footer from "../../components/common/fotter";
import PersonnelHeader from "../../components/hrm/personnel/PersonnelHeader";
import SystemIdentifier from "../../components/hrm/personnel/SystemIdentifier";
import ProfilePhoto from "../../components/hrm/personnel/ProfilePhoto";
import PersonalInformation from "../../components/hrm/personnel/PersonalInformation";
import ProfessionalInformation from "../../components/hrm/personnel/ProfessionalInformation";
import SkillsProficiency from "../../components/hrm/personnel/SkillsProficiency";
import ServiceHistory from "../../components/hrm/personnel/ServiceHistory";
import SystemAccount from "../../components/hrm/personnel/SystemAccount";

export default function PersonnelProfile() {
  return (
    <div className="min-h-screen bg-[#C8E1FA] font-sans">
      <PersonnelHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4">
        <SystemIdentifier />
        <ProfilePhoto />
        <PersonalInformation />
        <ProfessionalInformation />
        <SkillsProficiency />
        <ServiceHistory />
        <SystemAccount />
      </div>
      <Footer />
    </div>
  );
}
