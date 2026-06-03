import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { stockOutAPI } from '../../../services/api';
import GraphContainer from '../../common/GraphContainer';

export default function PendingVsApproved() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await stockOutAPI.getPendingApproved();
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching pending vs approved data:', error);
            setError("Unable to connect to issuance status service.");
        } finally {
            setLoading(false);
        }
    };

    const approved = data?.approved || { count: 0, percentage: 0, change: 0 };
    const pending = data?.pending || { count: 0, percentage: 0, change: 0 };
    const total = data?.total || 0;
    const month = data?.month || 'Current Month';

    return (
        <GraphContainer loading={loading} error={error} className="h-[396px] md:h-[360px] relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-lg font-normal text-[#0F172A] text-center sm:text-left">Pending vs Approved Issuances</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1 ">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                        <span className="text-xs text-[#94A3B8] ">Real-time status tracking</span>
                    </div>
                </div>
                <div className="flex items-center justify-center  gap-1.5 bg-[#1A8FA0] text-white text-xs font-medium px-3 py-2 rounded-sm ">
                    <Calendar size={13} />
                    Current Month: {month}
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 mb-5 ">
                {/* Approved */}
                <div className="bg-gradient-to-br from-[#1A6FC4] to-[#1E60AF] rounded-4xl p-4 relative overflow-hidden">
                    <div className="absolute right-3 top-3 w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <CheckCircle size={15} className="text-[#2B8CEE]" />
                    </div>
                    <div className="text-[12px] font-normal text-blue-200 tracking-widest uppercase mb-2">Approved</div>
                    <div className='flex gap-2 mt-4 mb-3' >
                        <div className="text-3xl font-semibold text-white leading-none">{approved.count.toLocaleString()}</div>
                        <div className={`text-xs text-white font-semibold mt-2 ${approved.change >= 0 ? '' : 'text-red-200'}`}>
                            {approved.change >= 0 ? '+' : ''}{approved.change}%
                        </div>
                    </div>
                    <div className="text-xs text-blue-100 font-medium ">Successful deployments</div>
                    {/* Decorative circle */}
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
                </div>

                {/* Pending */}
                <div className="bg-gradient-to-br from-[#1E4D7B] to-[#2478B5] rounded-4xl p-4 relative overflow-hidden">
                    <div className="absolute right-3 top-3 w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <Clock size={15} className="text-[#2B8CEE]" />
                    </div>
                    <div className="text-[12px] font-normal text-blue-200 tracking-widest uppercase mb-2">Pending</div>
                    <div className='flex gap-4 mt-4 mb-3'>
                        <div className="text-3xl font-semibold text-white leading-none">{pending.count.toLocaleString()}</div>
                        <div className={`text-xs text-white font-semibold mt-2 ${pending.change <= 0 ? '' : 'text-yellow-200'}`}>
                            {pending.change >= 0 ? '+' : ''}{pending.change}%
                        </div>
                    </div>
                    <div className="text-xs text-white font-medium mt-0.5">Awaiting Verification</div>
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
                </div>
            </div>
            {/* Distribution Overview */}
            <div>
                <div className="text-xs font-semibold text-[#64748B] mb-3">Distribution Overview</div>

                {/* Approved bar */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#1A8FA0]">APPROVED ({approved.percentage}%)</span>
                        <span className="text-[11px] font-semibold text-[#1A8FA0]">{approved.count.toLocaleString()} / {total.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#1E293B] overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500 transition-all duration-1000" style={{ width: `${approved.percentage}%` }} />
                    </div>
                </div>

                {/* Pending bar */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-[#64748B]">PENDING ({pending.percentage}%)</span>
                        <span className="text-[11px] font-semibold text-[#64748B]">{pending.count.toLocaleString()} / {total.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#1E293B] overflow-hidden">
                        <div className="h-full rounded-full bg-gray-400 transition-all duration-1000" style={{ width: `${pending.percentage}%` }} />
                    </div>
                </div>
            </div>
        </GraphContainer>
    );
}