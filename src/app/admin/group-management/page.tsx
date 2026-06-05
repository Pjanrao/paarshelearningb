"use client";

import { useState, useEffect } from "react";
import {
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    Plus,
    Search,
    Loader2,
    ArrowRight,
    UserCircle,
    Mail,
    Phone,
    Calendar,
    Filter,
    Trash2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Participant {
    studentId: {
        _id: string;
        name: string;
        email: string;
        contact: string;
    };
    consentStatus: "pending" | "accepted" | "declined";
    notifiedAt: string;
}

interface GroupRequest {
    _id: string;
    course: string;
    teacherId: {
        _id: string;
        name: string;
        email: string;
        designation: string;
    };
    participants: Participant[];
    teacherConsent: "pending" | "accepted" | "declined";
    status: "awaiting_consent" | "active" | "completed" | "cancelled";
    proposedSchedule: string;
    createdAt: string;
}

export default function GroupManagementPage() {
    const [requests, setRequests] = useState<GroupRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        course: "",
        teacherId: "",
        studentIds: [] as string[],
        proposedSchedule: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    useEffect(() => {
        if (isAddModalOpen) {
            fetchTeachersAndStudents();
        }
    }, [isAddModalOpen]);

    const fetchTeachersAndStudents = async () => {
        try {
            const [tRes, sRes] = await Promise.all([
                fetch('/api/teachers?limit=100'),
                fetch('/api/students?limit=100')
            ]);
            const [tData, sData] = await Promise.all([tRes.json(), sRes.json()]);
            setTeachers(tData.teachers || []);
            setStudents(sData.students || []);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/group-requests${filter !== 'all' ? `?status=${filter}` : ''}`);
            const data = await res.json();
            setRequests(data.requests || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateConsent = async (requestId: string, studentId: string, status: string) => {
        try {
            const request = requests.find(r => r._id === requestId);
            if (!request) return;

            const updatedParticipants = request.participants.map(p =>
                p.studentId._id === studentId ? { ...p, consentStatus: status } : p
            );

            const res = await fetch(`/api/group-requests/${requestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participants: updatedParticipants })
            });

            if (res.ok) fetchRequests();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const updateTeacherConsent = async (requestId: string, status: string) => {
        try {
            const res = await fetch(`/api/group-requests/${requestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherConsent: status })
            });
            if (res.ok) {
                toast.success(`Teacher consent updated to ${status}`);
                fetchRequests();
            } else {
                toast.error("Failed to update teacher consent");
            }
        } catch (error) {
            toast.error("Error updating teacher consent");
        }
    };

    const handleAddRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        if (!formData.course.trim()) newErrors.course = "Course name is required";
        if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
        if (formData.studentIds.length === 0) newErrors.studentIds = "At least one student is required";
        if (!formData.proposedSchedule.trim()) newErrors.proposedSchedule = "Schedule is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fill all required fields");
            return;
        }

        setFormLoading(true);
        try {
            const payload = {
                course: formData.course,
                teacherId: formData.teacherId,
                participants: formData.studentIds.map(id => ({
                    studentId: id,
                    consentStatus: "pending"
                })),
                proposedSchedule: formData.proposedSchedule,
                status: "awaiting_consent"
            };

            const res = await fetch('/api/group-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Group request sent successfully");
                setIsAddModalOpen(false);
                setFormData({ course: "", teacherId: "", studentIds: [], proposedSchedule: "" });
                setErrors({});
                fetchRequests();
            } else {
                toast.error("Failed to send group request");
            }
        } catch (error) {
            toast.error("Error sending group request");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteRequest = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/group-requests/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Request deleted successfully");
                fetchRequests();
                setDeleteId(null);
            } else {
                toast.error("Failed to delete request");
            }
        } catch (error) {
            toast.error("Error deleting request");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 h-full">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C4276]">Group Consent Management</h1>
                        <p className="text-gray-500 mt-1">Convert one-to-one sessions into groups with participant consent</p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-white border-0 shadow-sm rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#2C4276]"
                        >
                            <option value="all">All Status</option>
                            <option value="awaiting_consent">Awaiting Consent</option>
                            <option value="active">Active Groups</option>
                        </select>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[#2C4276] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all font-medium shadow-md"
                        >
                            <Plus size={20} /> New Group Request
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#2C4276] mb-4" size={40} />
                    <p className="text-gray-500 animate-pulse">Loading requests...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2C4276]">
                        <Users size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No Group Requests Found</h3>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">Start by creating a group request for students taking similar courses.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {requests.map((request) => (
                        <div key={request._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="p-5 border-b bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {request.course}
                                    </span>
                                    <h3 className="text-lg font-bold text-[#2C4276] mt-2 flex items-center gap-2">
                                        Group Session Request
                                        <ArrowRight size={16} className="text-gray-400" />
                                    </h3>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${request.status === 'awaiting_consent' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {request.status.replace('_', ' ')}
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Teacher Section */}
                                <div className={`p-4 rounded-xl border transition-all ${request.participants.every(p => p.consentStatus === 'accepted')
                                    ? "bg-blue-50/30 border-blue-100"
                                    : "bg-gray-50 border-gray-100 opacity-60"
                                    }`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${request.participants.every(p => p.consentStatus === 'accepted') ? "bg-[#2C4276]" : "bg-gray-400"
                                                }`}>
                                                <UserCircle size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{request.teacherId?.name}</p>
                                                <p className="text-xs text-gray-500">{request.teacherId?.designation}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Teacher Consent (Final Step)</span>
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={!request.participants.every(p => p.consentStatus === 'accepted')}
                                                    onClick={() => updateTeacherConsent(request._id, 'accepted')}
                                                    className={`p-1.5 rounded-lg transition-all ${request.teacherConsent === 'accepted'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-white text-gray-400 hover:text-green-500 shadow-sm disabled:cursor-not-allowed'
                                                        }`}
                                                    title={request.participants.every(p => p.consentStatus === 'accepted') ? "Approve" : "Waiting for all students to accept"}
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <button
                                                    disabled={!request.participants.every(p => p.consentStatus === 'accepted')}
                                                    onClick={() => updateTeacherConsent(request._id, 'declined')}
                                                    className={`p-1.5 rounded-lg transition-all ${request.teacherConsent === 'declined'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white text-gray-400 hover:text-red-500 shadow-sm disabled:cursor-not-allowed'
                                                        }`}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {!request.participants.every(p => p.consentStatus === 'accepted') && (
                                        <p className="text-[9px] font-bold text-orange-500 flex items-center gap-1 mt-1">
                                            <Clock size={10} /> PHASE 1: AWAITING ALL STUDENTS CONSENT
                                        </p>
                                    )}
                                </div>

                                {/* Participants Section */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2"><Users size={14} /> Phase 1: Students Admission ({request.participants.filter(p => p.consentStatus === 'accepted').length}/{request.participants.length})</span>
                                        {request.participants.every(p => p.consentStatus === 'accepted') && (
                                            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={12} /> Ready for Stage 2</span>
                                        )}
                                    </h4>
                                    <div className="space-y-3">
                                        {request.participants.map((p, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-white hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#2C4276] font-bold text-xs">
                                                        {p.studentId?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{p.studentId?.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <Mail size={10} className="text-gray-400" />
                                                            <span className="text-[10px] text-gray-500">{p.studentId?.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${p.consentStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        p.consentStatus === 'declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {p.consentStatus === 'pending' && <Clock size={10} />}
                                                        {p.consentStatus}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => updateConsent(request._id, p.studentId._id, 'accepted')}
                                                            className="p-1 hover:text-green-600 transition-colors"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateConsent(request._id, p.studentId._id, 'declined')}
                                                            className="p-1 hover:text-red-600 transition-colors"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Schedule Info */}
                                <div className="pt-4 border-t flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={16} />
                                        <span className="text-xs font-medium">Proposed: {request.proposedSchedule}</span>
                                    </div>
                                    <button
                                        onClick={() => setDeleteId(request._id)}
                                        className="text-red-500 text-xs font-bold hover:underline"
                                    >
                                        Delete Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Record Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Request Group Conversion</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleAddRequest} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. MERN Stack"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.course ? 'border-red-500' : ''}`}
                                />
                                {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Teacher</label>
                                <select
                                    required
                                    value={formData.teacherId}
                                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.teacherId ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Choose a teacher</option>
                                    {teachers.map(t => (
                                        <option key={t._id} value={t._id}>{t.name} ({t.course})</option>
                                    ))}
                                </select>
                                {errors.teacherId && <p className="text-red-500 text-xs mt-1">{errors.teacherId}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Students (Multi-select)</label>
                                <select
                                    multiple
                                    required
                                    value={formData.studentIds}
                                    onChange={(e) => {
                                        const values = Array.from(e.target.selectedOptions, option => option.value);
                                        setFormData({ ...formData, studentIds: values });
                                    }}
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 ${errors.studentIds ? 'border-red-500' : ''}`}
                                >
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                                    ))}
                                </select>
                                {errors.studentIds && <p className="text-red-500 text-xs mt-1">{errors.studentIds}</p>}
                                <p className="text-[10px] text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple students</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Proposed Schedule</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Mon-Wed-Fri 4PM to 6PM"
                                    value={formData.proposedSchedule}
                                    onChange={(e) => setFormData({ ...formData, proposedSchedule: e.target.value })}
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.proposedSchedule ? 'border-red-500' : ''}`}
                                />
                                {errors.proposedSchedule && <p className="text-red-500 text-xs mt-1">{errors.proposedSchedule}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold"
                                >
                                    {formLoading && <Loader2 className="animate-spin" size={16} />}
                                    Send Requests
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl text-center">
                    <div className="p-8 space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50 text-red-600">
                            <Trash2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                                Delete Request?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-gray-400">
                                Are you sure you want to delete this group request? This action cannot be reversed and will notify all participants.
                            </AlertDialogDescription>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDeleteRequest}
                                disabled={deleteLoading}
                                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {deleteLoading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={18} />}
                                Confirm Delete
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 bg-transparent hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
