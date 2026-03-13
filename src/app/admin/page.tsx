// // "use client";
// // import { ArrowUpRight, BookOpen, GraduationCap, Users, TrendingUp, BarChart as BarChartIcon, Calendar, ChevronDown, ChevronUp } from "lucide-react";
// // import { StatsCard } from "@/components/admin/StatsCard";
// // import { useEffect, useState } from "react";
// // import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Check } from "lucide-react";

// // const COLORS = ['#2C4276', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e'];

// // const containerVariants = {
// //     hidden: { opacity: 0, y: 20 },
// //     visible: {
// //         opacity: 1,
// //         y: 0,
// //         transition: {
// //             duration: 0.5,
// //             staggerChildren: 0.1,
// //         }
// //     }
// // };

// // const itemVariants = {
// //     hidden: { opacity: 0, y: 20 },
// //     visible: { opacity: 1, y: 0 },
// // };

// // interface PeriodDropdownProps {
// //     value: string;
// //     onChange: (val: string) => void;
// //     options: string[];
// // }

// // const PeriodDropdown = ({ value, onChange, options }: PeriodDropdownProps) => {
// //     const [isOpen, setIsOpen] = useState(false);

// //     return (
// //         <div className="relative">
// //             <button
// //                 onClick={() => setIsOpen(!isOpen)}
// //                 className="flex items-center gap-2 border rounded-lg px-2 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-50 transition-all min-w-[100px] justify-between">
// //                 <div className="flex items-center gap-2">
// //                     <Calendar size={14} className="text-gray-400" />
// //                     <span>{value}</span>
// //                 </div>
// //                 <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
// //             </button>

// //             <AnimatePresence>
// //                 {isOpen && (
// //                     <>
// //                         <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
// //                         <motion.div
// //                             initial={{ opacity: 0, y: 10, scale: 0.95 }}
// //                             animate={{ opacity: 1, y: 0, scale: 1 }}
// //                             exit={{ opacity: 0, y: 10, scale: 0.95 }}
// //                             transition={{ duration: 0.15, ease: "easeOut" }}
// //                             className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
// //                             {options.map((opt) => (
// //                                 <button
// //                                     key={opt}
// //                                     onClick={() => {
// //                                         onChange(opt);
// //                                         setIsOpen(false);
// //                                     }}
// //                                     className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-gray-50
// //                                         ${value === opt ? 'bg-gray-100/80 text-gray-900 font-semibold' : 'text-gray-600'}`}>
// //                                     <div className="flex items-center gap-2 w-full">
// //                                         <div className="w-4 flex items-center justify-center">
// //                                             {value === opt && <Check size={12} className="text-gray-900" />}
// //                                         </div>
// //                                         <Calendar size={14} className="text-gray-400" />
// //                                         <span>{opt}</span>
// //                                     </div>
// //                                 </button>
// //                             ))}
// //                         </motion.div>
// //                     </>
// //                 )}
// //             </AnimatePresence>
// //         </div>
// //     );
// // };

// // export default function AdminPage() {
// //     const [stats, setStats] = useState({
// //         totalStudents: 0,
// //         totalTeachers: 0,
// //         totalCourses: 0,
// //         totalRevenue: 0
// //     });
// //     const [charts, setCharts] = useState({
// //         enrollmentTrends: [],
// //         revenueTrends: [],
// //         enquiryTrends: [],
// //         courseDistribution: []
// //     });
// //     const [recent, setRecent] = useState({
// //         groupRequests: [],
// //         teachers: [],
// //         testimonials: []
// //     });

// //     const [salesPeriod, setSalesPeriod] = useState("Month");
// //     const [revenuePeriod, setRevenuePeriod] = useState("Month");

// //     useEffect(() => {
// //         const fetchDashboardData = async () => {
// //             try {
// //                 const res = await fetch('/api/admin/dashboard/stats');
// //                 const data = await res.json();

// //                 if (data.stats) setStats(data.stats);
// //                 if (data.charts) {
// //                     setCharts({
// //                         enrollmentTrends: data.charts.enrollmentTrends || [],
// //                         revenueTrends: data.charts.revenueTrends || [],
// //                         enquiryTrends: data.charts.enquiryTrends || [],
// //                         courseDistribution: data.charts.courseDistribution || []
// //                     });
// //                 }
// //                 if (data.recent) {
// //                     setRecent({
// //                         groupRequests: data.recent.groupRequests || [],
// //                         teachers: data.recent.teachers || [],
// //                         testimonials: data.recent.testimonials || []
// //                     });
// //                 }
// //             } catch (error) {
// //                 console.error("Dashboard fetch error:", error);
// //             }
// //         };
// //         fetchDashboardData();
// //     }, []);

// //     return (
// //         <motion.div
// //             initial="hidden"
// //             animate="visible"
// //             variants={containerVariants}
// //             className="p-8 bg-gray-50/50 h-full space-y-8">
// //             <div className="flex items-center justify-between">
// //                 <h1 className="text-3xl font-bold text-[#2C4276] -mt-10 -mb-5">Admin Dashboard</h1>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //                 <motion.div variants={itemVariants}>
// //                     <StatsCard
// //                         title="Total Users"
// //                         value={stats.totalStudents + stats.totalTeachers}
// //                         icon={Users}
// //                         trend="Registered users"
// //                     />
// //                 </motion.div>
// //                 <motion.div variants={itemVariants}>
// //                     <StatsCard
// //                         title="Total Courses"
// //                         value={stats.totalCourses}
// //                         icon={BookOpen}
// //                         trend="Available courses"
// //                     />
// //                 </motion.div>
// //                 <motion.div variants={itemVariants}>
// //                     <StatsCard
// //                         title="Sales"
// //                         value={recent.groupRequests.length}
// //                         icon={TrendingUp}
// //                         trend="This month's course purchases"
// //                         showMonthToggle
// //                     />
// //                 </motion.div>
// //                 <motion.div variants={itemVariants}>
// //                     <StatsCard
// //                         title="Revenue"
// //                         value={`₹${stats.totalRevenue.toLocaleString()}`}
// //                         icon={ArrowUpRight}
// //                         trend="This month's revenue"
// //                         showMonthToggle
// //                     />
// //                 </motion.div>
// //             </div>

// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
// //                     <div className="flex justify-between items-start mb-4">
// //                         <div className="flex items-center gap-2">
// //                             <BarChartIcon className="text-blue-600" size={18} />
// //                             <div>
// //                                 <h3 className="text-lg font-bold text-gray-900">Sales</h3>
// //                                 <p className="text-xs text-gray-500">Track your sales performance</p>
// //                             </div>
// //                         </div>
// //                         <PeriodDropdown
// //                             value={salesPeriod}
// //                             onChange={setSalesPeriod}
// //                             options={["Day", "Week", "Month", "Year"]}
// //                         />
// //                     </div>

// //                     <div className="text-center mb-6">
// //                         <p className="text-sm font-bold text-gray-700">Sales Distribution Feb 2026</p>
// //                     </div>

// //                     <div className="h-[350px]">
// //                         <ResponsiveContainer width="100%" height="100%">
// //                             <BarChart data={charts.enquiryTrends} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
// //                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// //                                 <XAxis
// //                                     dataKey="name"
// //                                     axisLine={false}
// //                                     tickLine={false}
// //                                     tick={{ fill: '#64748b', fontSize: 11 }}
// //                                     angle={-45}
// //                                     textAnchor="end"
// //                                 />
// //                                 <YAxis
// //                                     axisLine={false}
// //                                     tickLine={false}
// //                                     tick={{ fill: '#64748b', fontSize: 11 }}
// //                                     tickFormatter={(value) => `${value} sales`}
// //                                 />
// //                                 <Tooltip
// //                                     cursor={{ fill: '#f8fafc' }}
// //                                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
// //                                 />
// //                                 <Bar dataKey="inquiries" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
// //                             </BarChart>
// //                         </ResponsiveContainer>
// //                     </div>
// //                 </motion.div>

// //                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
// //                     <div className="flex justify-between items-start mb-4">
// //                         <div className="flex items-center gap-2">
// //                             <TrendingUp className="text-blue-600" size={18} />
// //                             <div>
// //                                 <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
// //                                 <p className="text-xs text-gray-500">Monitor your revenue growth over time</p>
// //                             </div>
// //                         </div>
// //                         <PeriodDropdown
// //                             value={revenuePeriod}
// //                             onChange={setRevenuePeriod}
// //                             options={["Day", "Week", "Month", "Year"]}
// //                         />
// //                     </div>

// //                     <div className="text-center mb-6">
// //                         <p className="text-sm font-bold text-gray-700">Revenue Trends Feb 2026</p>
// //                     </div>

// //                     <div className="h-[350px]">
// //                         <ResponsiveContainer width="100%" height="100%">
// //                             <AreaChart data={charts.revenueTrends} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
// //                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// //                                 <XAxis
// //                                     dataKey="name"
// //                                     axisLine={false}
// //                                     tickLine={false}
// //                                     tick={{ fill: '#64748b', fontSize: 11 }}
// //                                 />
// //                                 <YAxis
// //                                     axisLine={false}
// //                                     tickLine={false}
// //                                     tick={{ fill: '#64748b', fontSize: 11 }}
// //                                     tickFormatter={(value) => `₹${value}`}
// //                                 />
// //                                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
// //                                 <Area
// //                                     type="monotone"
// //                                     dataKey="revenue"
// //                                     name="Revenue"
// //                                     stroke="#3b82f6"
// //                                     strokeWidth={2}
// //                                     fill="transparent"
// //                                     dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
// //                                 />
// //                             </AreaChart>
// //                         </ResponsiveContainer>
// //                     </div>
// //                 </motion.div>
// //             </div>

// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //                 {/* New Teachers */}
// //                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
// //                     <div className="flex justify-between items-center mb-6">
// //                         <h3 className="text-lg font-bold text-gray-900">New Teachers</h3>
// //                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
// //                     </div>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                         {recent.teachers.length > 0 ? (
// //                             recent.teachers.slice(0, 6).map((t: any, i) => (
// //                                 <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
// //                                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
// //                                         {t.name ? t.name.charAt(0) : "T"}
// //                                     </div>
// //                                     <div className="min-w-0">
// //                                         <p className="text-sm font-bold text-gray-900 truncate">{t.name}</p>
// //                                         <p className="text-[11px] text-gray-500">{t.course || "Expert Instructor"}</p>
// //                                     </div>
// //                                 </div>
// //                             ))
// //                         ) : (
// //                             <p className="text-sm text-gray-400 italic text-center py-8">No new teachers</p>
// //                         )}
// //                     </div>
// //                 </motion.div>

// //                 {/* Sales by Course */}
// //                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
// //                     <div className="flex justify-between items-center mb-6">
// //                         <h3 className="text-lg font-bold text-gray-900">Course Distribution</h3>
// //                     </div>
// //                     <div className="h-[250px]">
// //                         <ResponsiveContainer width="100%" height="100%">
// //                             <PieChart>
// //                                 <Pie
// //                                     data={charts.courseDistribution}
// //                                     cx="50%"
// //                                     cy="50%"
// //                                     innerRadius={60}
// //                                     outerRadius={80}
// //                                     paddingAngle={5}
// //                                     dataKey="value">
// //                                     {charts.courseDistribution.map((entry: any, index: any) => (
// //                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                                     ))}
// //                                 </Pie>
// //                                 <Tooltip />
// //                             </PieChart>
// //                         </ResponsiveContainer>
// //                     </div>
// //                 </motion.div>
// //             </div>

// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //                 {/* Recent Group Requests */}
// //                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
// //                     <div className="flex justify-between items-center mb-6">
// //                         <h3 className="text-lg font-bold text-gray-900">Group Requests</h3>
// //                         <span className="text-[10px] uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-extrabold">Recent</span>
// //                     </div>
// //                     <div className="space-y-3">
// //                         {recent.groupRequests.length > 0 ? (
// //                             recent.groupRequests.slice(0, 4).map((req: any, i) => (
// //                                 <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
// //                                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
// //                                         {req.teacherId?.name ? req.teacherId.name.charAt(0) : "G"}
// //                                     </div>
// //                                     <div className="min-w-0 flex-1">
// //                                         <p className="text-sm font-bold text-gray-900 truncate">{req.course || "Group Session"}</p>
// //                                         <p className="text-[11px] text-gray-500 truncate">By {req.teacherId?.name || "Teacher"}</p>
// //                                     </div>
// //                                     <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${req.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
// //                                         {req.status}
// //                                     </div>
// //                                 </div>
// //                             ))
// //                         ) : (
// //                             <div className="text-center py-8">
// //                                 <Users className="mx-auto text-gray-300 mb-2" size={24} />
// //                                 <p className="text-sm text-gray-400 italic">No recent requests</p>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </motion.div>

// //                 {/* Recent Testimonials */}
// //                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
// //                     <div className="flex justify-between items-center mb-6">
// //                         <h3 className="text-lg font-bold text-gray-900">Recent Feedback</h3>
// //                         <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">Testimonials</span>
// //                     </div>
// //                     <div className="space-y-3">
// //                         {recent.testimonials.length > 0 ? (
// //                             recent.testimonials.slice(0, 3).map((t: any, i) => (
// //                                 <div key={i} className="p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-purple-100 transition-all">
// //                                     <p className="text-xs text-gray-600 italic line-clamp-2 leading-relaxed">"{t.message}"</p>
// //                                     <div className="flex items-center gap-2 mt-2">
// //                                         <div className="w-5 h-5 rounded-full bg-blue-100 text-[10px] flex items-center justify-center text-blue-600 font-bold">
// //                                             {t.name.charAt(0)}
// //                                         </div>
// //                                         <p className="text-[11px] font-bold text-gray-900">{t.name}</p>
// //                                     </div>
// //                                 </div>
// //                             ))
// //                         ) : (
// //                             <p className="text-sm text-gray-400 italic text-center py-8">No testimonials yet</p>
// //                         )}
// //                     </div>
// //                 </motion.div>
// //             </div>
// //         </motion.div>
// //     );
// // }


"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { Users, BookOpen, DollarSign, ShoppingCart } from "lucide-react";
import SalesChart from "@/components/dashboard/SalesChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
    return (
        <>
            <div className="space-y-6">

            <h2 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatsCard
                    title="Total Users"
                    value="120"
                    subtitle="Registered users"
                    icon={<Users size={20} />}
                />

                <StatsCard
                    title="Total Courses"
                    value="30"
                    subtitle="Available courses"
                    icon={<BookOpen size={20} />}
                />

                <StatsCard
                    title="Sales"
                    value="15"
                    subtitle="This month's sales"
                    icon={<ShoppingCart size={20} />}
                />

                <StatsCard
                    title="Revenue"
                    value="₹25,000"
                    subtitle="This month's revenue"
                    icon={<DollarSign size={20} />}
                />

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">
                        Recent Activity
                    </h2>

                    <div className="space-y-5">
                        {[
                            "New user registered",
                            "Course purchased",
                            "New blog published",
                            "Payment received",
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <p className="text-gray-600 text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-6 text-gray-800">
                        Top Selling Courses
                    </h2>

                    <div className="space-y-4">
                        {[
                            "Full Stack Development",
                            "Data Science",
                            "UI/UX Design",
                        ].map((course, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition">
                                <span className="text-gray-700 text-sm">
                                    {course}
                                </span>
                                <span className="text-blue-600 font-medium text-sm">
                                    {Math.floor(Math.random() * 100)} Sales
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Sales Distribution
                    </h2>
                    <SalesChart />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">
                        Revenue Trends
                    </h2>
                    <RevenueChart />
                </div>

            </div>


        </div>
        </>
    );
}