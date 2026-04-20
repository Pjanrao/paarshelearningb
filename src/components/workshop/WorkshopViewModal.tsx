"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatWorkshopDate, getWorkshopDateParts } from "@/utils/date";

interface Workshop {
    _id?: string;
    title: string;
    subtitle?: string;
    instructorName: string;
    date: string;
    time: string;
    duration: string;
    mode: "online" | "offline";
    location?: string;
    meetingLink?: string;
    description: string;
    highlights: string[];
    status: "active" | "inactive";
}

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    workshop: Workshop | null;
}

const Info = ({ label, value }: { label: string; value: any }) => (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
            {value || "-"}
        </p>
    </div>
);

export default function WorkshopViewModal({ open, setOpen, workshop }: Props) {
    if (!workshop) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 rounded-2xl">
                
                {/* HEADER */}
                <DialogHeader className="border-b pb-6 mb-8">
                    <DialogTitle className="text-2xl font-bold text-[#2C4276] dark:text-blue-400">
                        Workshop Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    
                    {/* TOP INFO BLOCK */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            {workshop.title}
                        </h2>
                        {workshop.subtitle && (
                            <p className="text-gray-500 dark:text-gray-400 font-medium italic">
                                {workshop.subtitle}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${workshop.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {workshop.mode}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${workshop.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {workshop.status}
                            </span>
                        </div>
                    </div>

                    {/* INFORMATION GRID */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider border-l-4 border-blue-600 pl-3">
                            General Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Info label="Instructor" value={workshop.instructorName} />
                            <Info 
                                label="Date" 
                                value={(() => {
                                    const parts = getWorkshopDateParts(workshop.date);
                                    if (parts) {
                                        return (
                                            <>
                                                {parts.day}<sup className="text-[10px] ml-0.5">{parts.ordinal}</sup> {parts.month} {parts.year}
                                            </>
                                        );
                                    }
                                    return workshop.date || "-";
                                })()} 
                            />
                            <Info label="Time" value={workshop.time} />
                            <Info label="Duration" value={workshop.duration} />
                            <Info label="Mode" value={workshop.mode} />
                            {workshop.mode === "online" ? (
                                <Info label="Meeting Link" value={workshop.meetingLink} />
                            ) : (
                                <Info label="Location" value={workshop.location} />
                            )}
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider border-l-4 border-blue-600 pl-3">
                            Description
                        </h3>
                        <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900/30 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                            {workshop.description}
                        </div>
                    </div>

                    {/* BENEFITS / HIGHLIGHTS */}
                    {workshop.highlights && workshop.highlights.length > 0 && (
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider border-l-4 border-blue-600 pl-3">
                                Workshop Benefits
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {workshop.highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/20">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div className="pt-6 border-t flex justify-end">
                        <button
                            onClick={() => setOpen(false)}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-8 py-3 rounded-xl transition-all"
                        >
                            Close
                        </button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
