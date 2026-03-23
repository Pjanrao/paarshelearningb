"use client";

export default function BatchViewModal({ batch, close }: any) {

    if (!batch) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg relative p-6 space-y-5">

                {/* CLOSE */}
                <button
                    onClick={close}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-[#2C4276]">
                    Batch Details
                </h2>

                {/* 📌 BATCH INFO */}
                <div className="border rounded-lg overflow-hidden">

                    <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700">
                        Batch Information
                    </div>

                    <div className="divide-y">

                        <div className="flex justify-between p-3">
                            <span className="text-gray-500">Batch Name</span>
                            <span>{batch.name}</span>
                        </div>

                        <div className="flex justify-between p-3">
                            <span className="text-gray-500">Course</span>
                            <span>{batch.courseId?.name}</span>
                        </div>

                        <div className="flex justify-between p-3">
                            <span className="text-gray-500">Start Date</span>
                            <span>
                                {batch.startDate
                                    ? new Date(batch.startDate).toLocaleDateString()
                                    : "-"}
                            </span>
                        </div>

                        <div className="flex justify-between p-3">
                            <span className="text-gray-500">End Date</span>
                            <span>
                                {batch.endDate
                                    ? new Date(batch.endDate).toLocaleDateString()
                                    : "-"}
                            </span>
                        </div>

                        <div className="flex justify-between p-3">
                            <span className="text-gray-500">Status</span>
                            <span
                                className={`px-2 py-1 rounded text-xs ${batch.status === "Active"
                                        ? "bg-green-100 text-green-600"
                                        : batch.status === "Upcoming"
                                            ? "bg-yellow-100 text-yellow-600"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {batch.status}
                            </span>
                        </div>

                    </div>

                </div>

                {/* 📌 STUDENT LIST */}
                <div className="border rounded-lg overflow-hidden">

                    <div className="bg-blue-50 px-4 py-2 font-semibold text-blue-700">
                        Student List ({batch.students?.length || 0})
                    </div>

                    {batch.students?.length === 0 ? (
                        <p className="p-4 text-gray-400 text-sm">
                            No students assigned
                        </p>
                    ) : (
                        <div className="divide-y">

                            {batch.students.map((s: any, index: number) => (
                                <div
                                    key={s._id || index}
                                    className="flex justify-between p-3"
                                >
                                    <div>
                                        <p className="font-medium">{s.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {s.email}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {s.contact}
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}