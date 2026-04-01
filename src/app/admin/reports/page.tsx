"use client";

import { useState } from "react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
    GraduationCap, Building2, ClipboardList, TrendingUp,
    TrendingDown, CheckCircle, XCircle, Loader2, RefreshCw,
    Users, Award, BarChart3, BookOpen,
} from "lucide-react";
import { useGetReportsQuery } from "@/redux/api/reportsApi";

// ── Color Palette ─────────────────────────────────────────────
const COLORS = {
    primary: "#2C4276",
    blue: "#3B82F6",
    emerald: "#10B981",
    red: "#EF4444",
    amber: "#F59E0B",
    purple: "#8B5CF6",
    indigo: "#6366F1",
    cyan: "#06B6D4",
};

const PIE_COLORS = [COLORS.red, COLORS.amber, COLORS.blue, COLORS.emerald, COLORS.purple];

// ── Reusable KPI Card ─────────────────────────────────────────
function KpiCard({
    label, value, sub, icon: Icon, color, trend, trendValue,
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    color: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
}) {
    const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-gray-400";
    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "12" }}>
                    <Icon size={16} style={{ color }} />
                </div>
            </div>
            <div>
                <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
                {sub && <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>}
            </div>
            {trendValue && TrendIcon && (
                <div className={`flex items-center gap-1 text-[10px] font-bold ${trendColor}`}>
                    <TrendIcon size={11} />
                    <span>{trendValue}</span>
                </div>
            )}
        </div>
    );
}

// ── Section Header ────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-2">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight">{title}</h2>
            {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
        </div>
    );
}

// ── Custom Tooltip ────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
                <p className="font-bold text-gray-700 mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color }} className="font-medium">
                        {p.name}: <span className="font-bold">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ── Main Page ─────────────────────────────────────────────────
export default function ReportsPage() {
    const { data, isLoading, isError, refetch } = useGetReportsQuery();
    const [activeTab, setActiveTab] = useState<"overview" | "exam" | "students">("overview");

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "exam", label: "Entrance Exam", icon: ClipboardList },
        { id: "students", label: "Students", icon: Users },
    ] as const;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-40 gap-4">
                <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                <p className="text-gray-500 font-medium animate-pulse">Loading reports...</p>
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-40 gap-4">
                <XCircle className="text-red-400" size={40} />
                <p className="text-gray-600 font-semibold">Failed to load reports</p>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2C4276] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
                >
                    <RefreshCw size={15} /> Retry
                </button>
            </div>
        );
    }

    const { kpis, monthlyStudents, collegePerformance, scoreDistribution, monthlySessions, recentSessions, categoryPerformance } = data.data;

    return (
        <div className="space-y-4">
            {/* ── Page Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Reports & Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Real-time insights across your entrance exam platform</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all active:scale-95 w-full sm:w-auto"
                >
                    <RefreshCw size={16} /> <span>Refresh Data</span>
                </button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-fit overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none active:scale-95
                            ${activeTab === tab.id
                                ? "bg-white text-[#2C4276] shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ══════════════════ OVERVIEW TAB ══════════════════ */}
            {activeTab === "overview" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <KpiCard
                            label="Total Students"
                            value={kpis.totalStudents.toLocaleString()}
                            sub={`${kpis.studentsThisMonth} this month`}
                            icon={GraduationCap}
                            color={COLORS.primary}
                            trend={kpis.studentGrowth >= 0 ? "up" : "down"}
                            trendValue={`${kpis.studentGrowth >= 0 ? "+" : ""}${kpis.studentGrowth}%`}
                        />
                        <KpiCard
                            label="Colleges"
                            value={kpis.totalColleges}
                            sub="Institutions"
                            icon={Building2}
                            color={COLORS.indigo}
                        />
                        <KpiCard
                            label="Exams"
                            value={kpis.totalExams}
                            sub="Total created"
                            icon={BookOpen}
                            color={COLORS.cyan}
                        />
                        <KpiCard
                            label="Pass Rate"
                            value={`${kpis.passRate}%`}
                            sub={`${kpis.passedSessions} passed`}
                            icon={Award}
                            color={kpis.passRate >= 60 ? COLORS.emerald : COLORS.amber}
                            trend={kpis.passRate >= 60 ? "up" : "down"}
                            trendValue={`${kpis.passRate}%`}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <SectionHeader title="Pass vs Fail" />
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Passed", value: kpis.passedSessions },
                                            { name: "Failed", value: kpis.totalSessions - kpis.passedSessions },
                                        ]}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        <Cell fill={COLORS.emerald} />
                                        <Cell fill={COLORS.red} />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:col-span-2">
                            <SectionHeader title="Exam Attempts (Last 6 Months)" />
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={monthlySessions} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9fa' }} />
                                    <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="passed" name="Passed" fill={COLORS.emerald} radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="failed" name="Failed" fill={COLORS.red} radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════ EXAM TAB ══════════════════ */}
            {activeTab === "exam" && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <SectionHeader title="Pass vs Fail by College" />
                        <div className="overflow-x-auto no-scrollbar">
                            <div className="min-w-[500px] lg:min-w-0">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={collegePerformance} layout="vertical" barGap={2} margin={{ left: -10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 11 }} />
                                        <YAxis dataKey="college" type="category" width={110} tick={{ fontSize: 10, fontWeight: 600 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                                        <Bar dataKey="passed" name="Passed" fill={COLORS.emerald} radius={[0, 3, 3, 0]} />
                                        <Bar dataKey="failed" name="Failed" fill={COLORS.red} radius={[0, 3, 3, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Score Distribution - Enhanced Donut */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <SectionHeader title="Score Distribution" subtitle="Performance brackets" />
                            <div className="relative h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={scoreDistribution.filter((d: any) => d.count > 0)}
                                            dataKey="count"
                                            nameKey="range"
                                            cx="50%" cy="50%"
                                            innerRadius={60} outerRadius={85}
                                            paddingAngle={2}
                                            stroke="none"
                                        >
                                            {scoreDistribution.map((entry: any, i: number) => (
                                                <Cell key={i} fill={[COLORS.red, COLORS.amber, COLORS.blue, COLORS.emerald, COLORS.indigo][i % 5]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="bottom" align="center" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontWeight: 600 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-10px]">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Total</p>
                                    <p className="text-xl font-black text-gray-800">{kpis.totalSessions}</p>
                                </div>
                            </div>
                        </div>

                        {/* Category Performance */}
                        {categoryPerformance && categoryPerformance.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <SectionHeader title="Performance by Category" subtitle="Accuracy per topic" />
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={categoryPerformance} layout="vertical" margin={{ left: -15 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis dataKey="category" type="category" width={90} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} formatter={(v: number) => [`${v}%`, "Accuracy"]} />
                                        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={12}>
                                            {categoryPerformance.map((entry: any, index: number) => (
                                                <Cell key={index} fill={entry.accuracy > 70 ? COLORS.emerald : entry.accuracy > 40 ? COLORS.amber : COLORS.red} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <SectionHeader title="Recent Exam Results" />
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-sm min-w-[500px]">
                                <thead>
                                    <tr className="text-left border-b border-gray-100 font-bold">
                                        <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider">Student</th>
                                        <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider text-center">Batch</th>
                                        <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider text-center">Score</th>
                                        <th className="pb-3 text-xs text-gray-400 uppercase tracking-wider text-center">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentSessions.length === 0 ? (
                                        <tr><td colSpan={4} className="py-8 text-center text-gray-400">No sessions</td></tr>
                                    ) : recentSessions.map((s: any, i: number) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-2.5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 leading-tight">{s.studentName}</span>
                                                    <span className="text-[10px] text-gray-500">{s.college}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 text-center">
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold uppercase">{s.batchName || "N/A"}</span>
                                            </td>
                                            <td className="py-2.5 text-center font-bold">{s.percentage}%</td>
                                            <td className="py-2.5 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${s.isPassed ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                                    {s.isPassed ? "PASS" : "FAIL"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════ STUDENTS TAB ══════════════════ */}
            {activeTab === "students" && (
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <SectionHeader title="Student Registrations (Last 6 Months)" />
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={monthlyStudents}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="students"
                                    name="New Students"
                                    stroke={COLORS.primary}
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: COLORS.primary, strokeWidth: 1, stroke: "#fff" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Registered</p>
                            <p className="text-3xl font-bold text-[#2C4276]">{kpis.totalStudents.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">This Month</p>
                            <p className="text-3xl font-bold text-emerald-600">+{kpis.studentsThisMonth}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Growth Rate</p>
                            <p className={`text-3xl font-bold ${kpis.studentGrowth >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                                {kpis.studentGrowth >= 0 ? "+" : ""}{kpis.studentGrowth}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

