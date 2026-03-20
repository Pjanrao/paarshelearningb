"use client";

import { useGetMeetingsQuery } from "@/redux/api/meetingApi";

export default function StudentMeetings() {
    const { data: meetings } = useGetMeetingsQuery("");

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Live Classes</h2>

            <div className="grid gap-4">
                {meetings?.map((m: any) => (
                    <div key={m._id} className="border p-4 rounded-lg">
                        <h3 className="font-bold">{m.title}</h3>
                        <p>{new Date(m.meetingDate).toLocaleString()}</p>

                        <a
                            href={m.meetingLink}
                            target="_blank"
                            className="text-blue-600 font-bold"
                        >
                            Join Meeting
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}