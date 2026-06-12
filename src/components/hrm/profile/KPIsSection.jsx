import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const kpisLeft = [
    { label: 'Task completion rate', value: '88%' },
    { label: 'Punctuality', value: '92%' },
    { label: 'Resolution Time', value: '5 hrs' },
    { label: 'Accuracy', value: '97%' },
    { label: 'Attendance', value: '96%' },
];

const kpisRight = [
    { label: 'Panel Repairs', value: '18 panels' },
    { label: 'Wiring Installs', value: '24 setups' },
    { label: 'Faulty Connections', value: '3 detected' },
    { label: 'Courses', value: '90%' },
    { label: 'Field Performance', value: '85%' },
];

const overtimeData = [
    { name: 'Overtime', value: 15, color: '#1e40af' },
    { name: 'Regular', value: 85, color: '#e2e8f0' },
];

export default function KPIsSection({ employee = {} }) {
    return (
        <div className="bg-[#f0f7ff] rounded-3xl border border-[#2478B5] shadow-sm p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">KPIs</h3>
                <div className="text-xs text-blue-600 font-medium">505 • 949</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 bg-white rounded-2xl border border-[#2478B5] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-4">
                            {kpisLeft.map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b-1 border-[#2478B5] pb-1 text-[11px]">
                                    <div className="flex items-center gap-4">
                                        <img src="dist/teak.svg" alt="icon" className="w-3 h-3 object-contain" />
                                        <span className="text-gray-700 font-medium">{item.label}</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {kpisRight.map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b-1 border-[#2478B5] pb-1 text-[11px]">
                                    <div className="flex items-center gap-5">
                                        <img src="/dist/teak.svg" alt="icon" className="w-3 h-3 object-contain" />
                                        <span className="text-gray-700 font-medium whitespace-nowrap mr-5">{item.label}</span>
                                    </div>
                                    <span className={`font-medium text-[12px] whitespace-nowrap ${i === 2 ? 'text-red-500' : 'text-gray-900'}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center bg-[#E3F2FD] rounded-2xl border-2 border-[#2478B5] p-8 relative">
                    <div className="relative w-44 h-44">
                        <div className="absolute inset-0 rounded-full"
                            style={{
                                background: 'conic-gradient(#1e40af 0deg, #3b82f6 90deg, #60a5fa 180deg, #93c5fd 270deg, #1e40af 360deg)',
                                filter: 'blur(14px)', opacity: 0.45, zIndex: 1,
                            }} />
                        <PieChart width={176} height={176} style={{ position: 'relative', zIndex: 2 }}>
                            <Pie data={overtimeData} cx="50%" cy="50%" innerRadius={58} outerRadius={82}
                                startAngle={90} endAngle={-270} dataKey="value">
                                {overtimeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="absolute inset-0 flex flex-col gap-5 items-center justify-center z-10">
                            <div className="text-2xl font-medium text-gray-900">15%</div>
                            <div className="text-sm text-gray-900 font-medium -mt-1">Overtime Rate</div>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <div className="text-[10px] font-bold text-gray-400 tracking-[1.5px] uppercase">OVERTIME</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
