import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
    BarChart, Bar,
} from 'recharts';
import { Calendar } from 'lucide-react';

const workOrderData = [
    { name: 'Elec. Wiring', value: 27, color: '#1a3a8f' },
    { name: 'Installation', value: 26, color: '#2563eb' },
    { name: 'Panel Repair', value: 24, color: '#60a5fa' },
    { name: 'Troubleshoot', value: 23, color: '#bfdbfe' },
];

const attendanceDays = [
    { color: '#1a3a8f' }, { color: '#1a3a8f' }, { color: '#1a3a8f' },
    { color: '#2ec4b6' }, { color: '#1a3a8f' },
];

export default function ProfileCharts({ employee = {} }) {
    const rating = employee.rating || 0;

    const perfData = [
        { m: 'J', v: 62 }, { m: 'F', v: 58 }, { m: 'M', v: 65 },
        { m: 'A', v: 70 }, { m: 'M', v: 68 }, { m: 'J', v: 75 },
        { m: 'J', v: 72 }, { m: 'A', v: 80 }, { m: 'S', v: 78 },
        { m: 'O', v: 85 }, { m: 'N', v: 90 }, { m: 'D', v: 94 },
    ].map(d => rating > 0 ? { ...d, v: Math.round(d.v * (rating / 5)) } : d);

    const tasksData = [
        { m: 'J', completed: 8, overdue: 2 },
        { m: 'F', completed: 10, overdue: 1 },
        { m: 'M', completed: 7, overdue: 3 },
        { m: 'A', completed: 12, overdue: 0 },
        { m: 'M', completed: 9, overdue: 2 },
        { m: 'J', completed: 14, overdue: 1 },
    ].map(d => rating > 0 ? { ...d, completed: Math.round(d.completed * (rating / 5)) } : d);

    const totalOrders = workOrderData.reduce((a, b) => a + b.value, 0);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="border-2 border-[#1A6FC4] rounded-md p-3">
                    <div className="text-xs font-bold text-gray-700 mb-2">Yearly Performance Report</div>
                    <div className="h-[110px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={perfData} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="m" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[50, 100]} />
                                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                                <Line type="monotone" dataKey="v" stroke="#1a3a8f" strokeWidth={2}
                                    dot={{ r: 2, fill: '#fff', stroke: '#1a3a8f', strokeWidth: 1.5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #1A6FC4CC, #2478B5B2)' }}>
                    <div className="text-xs font-bold text-white mb-2">Work Orders by Type</div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-[80px] h-[80px] flex-shrink-0">
                            <PieChart width={80} height={80}>
                                <Pie data={workOrderData} cx={35} cy={35} innerRadius={22} outerRadius={38}
                                    paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                                    {workOrderData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                            </PieChart>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-[#0A1628] rounded-full w-11 h-11 pt-2">
                                <div className="text-xs font-black text-white">{totalOrders}</div>
                                <div className="text-[7px] text-white/70">Orders</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            {workOrderData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
                                        <span className="text-[9px] text-white/80">{d.name}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-white">{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-2 border-[#1A6FC4] rounded-xl p-3">
                    <div className="text-xs font-bold text-gray-700 mb-2">Tasks Completed / Overdue</div>
                    <div className="h-[110px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tasksData} barSize={8} barGap={2}
                                margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="m" tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                                <Bar dataKey="completed" name="Completed" fill="#1a3a8f" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="overdue" name="Overdue" fill="#60a5fa" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="border border-[#E2E8F0] rounded-xl p-3">
                   <div className='bg-[#137FEC0D] px-2 py-1 rounded-md mb-2'>
                     <div className="text-xs font-bold text-gray-700 mb-2">Recent Attendance</div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-[#137FEC1A] rounded-lg flex items-center justify-center">
                            <Calendar size={14} className="text-blue-600" />
                        </div>
                        <div>
                            <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wide">Attendance Rate</div>
                            <div className="text-xl font-black text-gray-900 leading-none">98.4%</div>
                        </div>
                   </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {attendanceDays.map((d, i) => (
                            <div key={i} className="flex-1 h-8 rounded-sm" style={{ background: d.color }} />
                        ))}
                    </div>
                    <div className="text-[9px] text-[#1E293B] mt-1.5 text-center">Last updated: Today, 08:30 AM</div>
                </div>

            </div>
        </div>
    );
}
