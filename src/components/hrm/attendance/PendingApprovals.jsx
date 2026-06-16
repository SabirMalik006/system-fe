import React from "react";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function PendingApprovals({ data }) {
  const approvals = data && data.length > 0 ? data : [];

  return (
    <div className="rounded-2xl p-4 h-full flex flex-col"
      style={{ background: "linear-gradient(135deg,#1a3a8f,#1565c0)" }}>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[13px] font-bold text-white">Pending Approvals</h3>
        <span className="bg-white/20 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {approvals.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {approvals.length > 0 ? approvals.map((a, i) => (
          <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-white">{a.initials || '?'}</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white leading-tight">{a.name}</p>
                <p className="text-[9px] text-blue-200 leading-tight mt-0.5">{a.meta}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <button className="w-6 h-6 rounded-md bg-white/20 hover:bg-green-500/40 flex items-center justify-center transition-colors">
                <Check size={11} className="text-white" />
              </button>
              <button className="w-6 h-6 rounded-md bg-white/20 hover:bg-red-500/40 flex items-center justify-center transition-colors">
                <X size={11} className="text-white" />
              </button>
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-[11px] text-blue-200">No pending approvals</p>
          </div>
        )}
      </div>
    </div>
  );
}
