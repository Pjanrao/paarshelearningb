"use client";

import { useState } from "react";
import { X, Plus, Trash2, Pencil, Eye, Loader2, PlayCircle } from "lucide-react";
import { useGetVideosQuery, useDeleteVideoMutation } from "@/redux/api/videoApi";
import UploadVideoModal from "./UploadVideoModal";
import { toast } from "sonner";
import EditTopicModal from "./EditTopicModal" ;

export default function ManageVideosModal({ course, open, setOpen }: any) {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [editTopicData, setEditTopicData] = useState<any>(null);
    // Safety check for course ID before querying
    const courseId = course?._id || "";
    const { data, isLoading } = useGetVideosQuery(courseId, { skip: !courseId });
    const [editVideo, setEditVideo] = useState<any>(null);
    const videos = data?.videos || [];
    const [deleteVideo] = useDeleteVideoMutation();
    const [viewData, setViewData] = useState<any>(null);
    // Group videos by Topic and Subtopic
    const groupedVideos: Record<string, Record<string, any[]>> = {};
    videos.forEach((video) => {
        if (!groupedVideos[video.topic]) {
            groupedVideos[video.topic] = {};
        }
        if (!groupedVideos[video.topic][video.subtopic]) {
            groupedVideos[video.topic][video.subtopic] = [];
        }
        groupedVideos[video.topic][video.subtopic].push(video);
    });

    if (!open) return null;

    const handleEditTopic = (topic: string) => {
    const topicVideos = videos.filter(v => v.topic === topic);
    setEditTopicData({ topic, videos: topicVideos });
};
  
    const handleDelete = async (id: string) => {
        toast("Are you sure you want to delete?", {
    action: {
        label: "Delete",
        onClick: async () => {
            try {
                await deleteVideo({ id, courseId }).unwrap();
                toast.success("Deleted successfully");
            } catch {
                toast.error("Delete failed");
            }
        },
    },
});
    };
const handleViewTopic = (topic: string) => {
    const topicVideos = videos.filter(v => v.topic === topic);

    // group by subtopic
    const grouped: any = {};

    topicVideos.forEach((v: any) => {
        if (!grouped[v.subtopic]) {
            grouped[v.subtopic] = [];
        }
        grouped[v.subtopic].push(v);
    });

    setViewData({
        topic,
        subtopics: grouped
    });
};
const handleDeleteTopic = async (topic: string) => {
    if (!confirm("Delete this topic and all videos?")) return;

    try {
        const topicVideos = videos.filter((v: any) => v.topic === topic);

        await Promise.all(
            topicVideos.map((video: any) =>
                deleteVideo({
                    id: video._id,
                    courseId: courseId, // ✅ IMPORTANT
                }).unwrap()
            )
        );

        toast.success("Topic deleted successfully");

    } catch (error) {
        console.error(error);
        toast.error("Failed to delete topic");
    }
};

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[800px] h-[85vh] rounded-xl shadow-xl flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-[#2C4276]">Manage Videos</h2>
                        <p className="text-xs text-gray-500 mt-1">{course?.name}</p>
                    </div>
                    <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 bg-white border-b flex justify-end">
                    <button
                        onClick={() => setUploadOpen(true)}
                        className="flex items-center gap-2 bg-[#2C4276] text-white px-4 py-2 rounded-lg hover:bg-[#1f3159] transition"
                    >
                        <Plus size={18} />
                        Add New Video
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Loader2 size={32} className="animate-spin text-[#2C4276] mb-2" />
                            <p className="text-gray-500">Loading videos...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <PlayCircle size={48} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-700">No videos uploaded yet</h3>
                            <p className="text-gray-500 text-sm mt-1 mb-4">Click the button above to upload the first video.</p>
                        </div>
                    ) : (
                       <div className="space-y-5">

{Object.entries(groupedVideos).map(([topic, subtopics]) => (
    
    <div key={topic} className="bg-white rounded-2xl border border-gray-200 shadow-sm">

        {/* TOPIC HEADER */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#2C4276]/10 to-white rounded-t-2xl">

            <div>
                <h3 className="text-lg font-semibold text-[#2C4276]">
                    {topic}
                </h3>
                <p className="text-xs text-gray-500">
                    {Object.values(subtopics).flat().length} videos
                </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

                <button
                    onClick={() => handleViewTopic(topic)}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                >
                    <Eye size={16} />
                </button>

                <button
                    onClick={() => handleEditTopic(topic)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                    <Pencil size={16} />
                </button>

                <button
                    onClick={() => handleDeleteTopic(topic)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                    <Trash2 size={16} />
                </button>

            </div>
        </div>

        {/* SUBTOPICS */}
        <div className="divide-y">

            {Object.entries(subtopics).map(([subtopic, vids]) => (
                
                <div key={subtopic} className="p-4">

                    {/* SUBTOPIC TITLE */}
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        {subtopic}
                    </h4>

                    {/* VIDEO LIST */}
                    <div className="space-y-3">

                        {vids.map((v) => (
                            
                            <div
                                key={v._id}
                                className="flex items-center gap-4 p-3 border rounded-xl hover:shadow-sm hover:bg-gray-50 transition"
                            >

                                {/* VIDEO ICON */}
                                <div className="bg-[#2C4276]/10 p-2.5 rounded-lg text-[#2C4276]">
                                    <PlayCircle size={18} />
                                </div>

                                {/* TEXT */}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {v.title}
                                    </p>

                                    {v.description && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {v.description}
                                        </p>
                                    )}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            ))}

        </div>
    </div>

))}

</div>
                    )}
                </div>
            </div>
           <EditTopicModal
    data={editTopicData}
    open={!!editTopicData}
    close={() => setEditTopicData(null)}
/>
    {viewData && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
        <div className="bg-white w-[800px] max-h-[90vh] rounded-xl shadow-xl flex flex-col overflow-hidden">

            {/* HEADER */}
<div className="flex items-center justify-between px-5 py-3 hover:bg-[#2C4276]/5 transition rounded-lg mx-2">
                <div>
                    <h2 className="text-xl font-bold text-[#2C4276]">
                        {viewData.topic}
                    </h2>
                    <p className="text-xs text-gray-500">
                        View all videos under this topic
                    </p>
                </div>

                <button onClick={() => setViewData(null)}>
                    <X size={22} />
                </button>
            </div>

            {/* BODY */}
            <div className="p-5 overflow-y-auto space-y-5">

                {Object.entries(viewData.subtopics).map(([subtopic, vids]: any) => (
                    <div key={subtopic} className="border rounded-lg overflow-hidden">

                        {/* SUBTOPIC HEADER */}
                        <div className="bg-[#2C4276]/10 px-4 py-2 text-sm font-semibold text-[#2C4276]">
                            {subtopic}
                        </div>

                        {/* VIDEO LIST */}
                        <div className="divide-y">

                            {vids.map((v: any) => (
                                <div key={v._id} className="flex gap-4 p-4 items-start hover:bg-gray-50">

                                    {/* VIDEO THUMB */}
                                    <video
                                        src={v.videoUrl}
                                        className="w-[180px] h-[100px] rounded object-cover border"
                                        controls
                                    />

                                    {/* CONTENT */}
                                    <div className="flex-1">

                                        <p className="font-semibold text-gray-800 text-sm">
                                            {v.title}
                                        </p>

                                        {v.description && (
                                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">
    {v.description}
</p>
                                        )}

                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                ))}

            </div>

            {/* FOOTER */}
            <div className="p-4 border-t flex justify-end">
                <button
                    onClick={() => setViewData(null)}
                    className="px-5 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-[#1f3159]"
                >
                    Close
                </button>
            </div>

        </div>
    </div>
)}
            <UploadVideoModal
                courseId={courseId}
                open={uploadOpen}
                close={() => setUploadOpen(false)}
            />
        </div>
    );
}






// "use client";

// import { useState } from "react";
// import { X, Plus, Trash2, Pencil, Eye, Loader2, PlayCircle } from "lucide-react";
// import { useGetVideosQuery, useDeleteVideoMutation } from "@/redux/api/videoApi";
// import UploadVideoModal from "./UploadVideoModal";
// import { toast } from "sonner";
// import EditTopicModal from "./EditTopicModal";

// export default function ManageVideosModal({ course, open, setOpen }: any) {
//     const [uploadOpen, setUploadOpen] = useState(false);
//     const [editTopicData, setEditTopicData] = useState<any>(null);
//     // Safety check for course ID before querying
//     const courseId = course?._id || "";
//     const { data, isLoading } = useGetVideosQuery(courseId, { skip: !courseId });
//     const [editVideo, setEditVideo] = useState<any>(null);
//     const videos = data?.videos || [];
//     const [deleteVideo] = useDeleteVideoMutation();
//     const [viewData, setViewData] = useState<any>(null);
//     // Group videos by Topic and Subtopic
//     const groupedVideos: Record<string, Record<string, any[]>> = {};
//     videos.forEach((video) => {
//         if (!groupedVideos[video.topic]) {
//             groupedVideos[video.topic] = {};
//         }
//         if (!groupedVideos[video.topic][video.subtopic]) {
//             groupedVideos[video.topic][video.subtopic] = [];
//         }
//         groupedVideos[video.topic][video.subtopic].push(video);
//     });

//     if (!open) return null;

//     const handleEditTopic = (topic: string) => {
//     const topicVideos = videos.filter(v => v.topic === topic);
//     setEditTopicData({ topic, videos: topicVideos });
// };
  
//     const handleDelete = async (id: string) => {
//         toast("Are you sure you want to delete?", {
//     action: {
//         label: "Delete",
//         onClick: async () => {
//             try {
//                 await deleteVideo({ id, courseId }).unwrap();
//                 toast.success("Deleted successfully");
//             } catch {
//                 toast.error("Delete failed");
//             }
//         },
//     },
// });
//     };
// const handleViewTopic = (topic: string) => {
//     const topicVideos = videos.filter(v => v.topic === topic);

//     // group by subtopic
//     const grouped: any = {};

//     topicVideos.forEach((v: any) => {
//         if (!grouped[v.subtopic]) {
//             grouped[v.subtopic] = [];
//         }
//         grouped[v.subtopic].push(v);
//     });

//     setViewData({
//         topic,
//         subtopics: grouped
//     });
// };
// const handleDeleteTopic = async (topic: string) => {
//     if (!confirm("Delete this topic and all videos?")) return;

//     try {
//         const topicVideos = videos.filter((v: any) => v.topic === topic);

//         await Promise.all(
//             topicVideos.map((video: any) =>
//                 deleteVideo({
//                     id: video._id,
//                     courseId: courseId, // ✅ IMPORTANT
//                 }).unwrap()
//             )
//         );

//         toast.success("Topic deleted successfully");

//     } catch (error) {
//         console.error(error);
//         toast.error("Failed to delete topic");
//     }
// };

//     return (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white w-[800px] h-[85vh] rounded-xl shadow-xl flex flex-col relative overflow-hidden">
//                 <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
//                     <div>
//                         <h2 className="text-xl font-bold text-[#2C4276]">Manage Videos</h2>
//                         <p className="text-xs text-gray-500 mt-1">{course?.name}</p>
//                     </div>
//                     <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <div className="p-4 bg-white border-b flex justify-end">
//                     <button
//                         onClick={() => setUploadOpen(true)}
//                         className="flex items-center gap-2 bg-[#2C4276] text-white px-4 py-2 rounded-lg hover:bg-[#1f3159] transition"
//                     >
//                         <Plus size={18} />
//                         Add New Video
//                     </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//                     {isLoading ? (
//                         <div className="flex flex-col items-center justify-center h-full">
//                             <Loader2 size={32} className="animate-spin text-[#2C4276] mb-2" />
//                             <p className="text-gray-500">Loading videos...</p>
//                         </div>
//                     ) : videos.length === 0 ? (
//                         <div className="flex flex-col items-center justify-center h-full text-center">
//                             <PlayCircle size={48} className="text-gray-300 mb-4" />
//                             <h3 className="text-lg font-bold text-gray-700">No videos uploaded yet</h3>
//                             <p className="text-gray-500 text-sm mt-1 mb-4">Click the button above to upload the first video.</p>
//                         </div>
//                     ) : (
//                         <div className="space-y-6">
//                             {Object.entries(groupedVideos).map(([topic, subtopics]) => (
//                                 <div key={topic} className="bg-white rounded-xl shadow-sm border overflow-hidden">
//                                    <div className="bg-[#2C4276]/10 px-4 py-3 border-b flex items-center justify-between">

//    <div className="flex items-center justify-between w-full">

//     {/* TOPIC NAME */}
//     <h3 className="font-bold text-[#2C4276] text-lg">
//         {topic}
//     </h3>

//     {/* ACTION ICONS */}
//     <div className="flex items-center gap-3">

//         {/* VIEW */}
//         <button
//             onClick={() => handleViewTopic(topic)}
//             className="p-1.5 rounded-md text-green-600 hover:bg-green-100 transition"
//             title="View Topic"
//         >
//             <Eye size={16} />
//         </button>

//         {/* EDIT */}
//         <button
//             onClick={() => handleEditTopic(topic)}
//             className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100 transition"
//             title="Edit Topic"
//         >
//             <Pencil size={16} />
//         </button>

//         {/* DELETE */}
//         <button
//             onClick={() => handleDeleteTopic(topic)}
//             className="p-1.5 rounded-md text-red-600 hover:bg-red-100 transition"
//             title="Delete Topic"
//         >
//             <Trash2 size={16} />
//         </button>

//     </div>

// </div>

// </div>
//                                     <div className="p-0">
//                                         {Object.entries(subtopics).map(([subtopic, vids]) => (
//                                             <div key={subtopic} className="border-b last:border-0 border-gray-100">
//                                                 <div className="px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-600">
//                                                     {subtopic}
//                                                 </div>
//                                                 <div className="divide-y divide-gray-100">
//                                                     {vids.map((v) => (
//                                                         <div key={v._id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition">
//                                                             <div className="flex items-center gap-3">
//                                                                 <div className="bg-blue-100 p-2 rounded-full text-blue-600 flex-shrink-0">
//                                                                     <PlayCircle size={16} />
//                                                                 </div>
//                                                                 <div>
//                                                                     <p className="font-medium text-gray-800 text-sm">{v.title}</p>
//                                                                     {v.description && (
//                                                                         <p className="text-xs text-gray-500 line-clamp-1">{v.description}</p>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
                                                         
                                                         
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//            <EditTopicModal
//     data={editTopicData}
//     open={!!editTopicData}
//     close={() => setEditTopicData(null)}
// />
//     {viewData && (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
//         <div className="bg-white w-[800px] max-h-[90vh] rounded-xl shadow-xl flex flex-col overflow-hidden">

//             {/* HEADER */}
//             <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
//                 <div>
//                     <h2 className="text-xl font-bold text-[#2C4276]">
//                         {viewData.topic}
//                     </h2>
//                     <p className="text-xs text-gray-500">
//                         View all videos under this topic
//                     </p>
//                 </div>

//                 <button onClick={() => setViewData(null)}>
//                     <X size={22} />
//                 </button>
//             </div>

//             {/* BODY */}
//             <div className="p-5 overflow-y-auto space-y-5">

//                 {Object.entries(viewData.subtopics).map(([subtopic, vids]: any) => (
//                     <div key={subtopic} className="border rounded-lg overflow-hidden">

//                         {/* SUBTOPIC HEADER */}
//                         <div className="bg-[#2C4276]/10 px-4 py-2 text-sm font-semibold text-[#2C4276]">
//                             {subtopic}
//                         </div>

//                         {/* VIDEO LIST */}
//                         <div className="divide-y">

//                             {vids.map((v: any) => (
//                                 <div key={v._id} className="flex gap-4 p-4 items-start hover:bg-gray-50">

//                                     {/* VIDEO THUMB */}
//                                     <video
//                                         src={v.videoUrl}
//                                         className="w-[180px] h-[100px] rounded object-cover border"
//                                         controls
//                                     />

//                                     {/* CONTENT */}
//                                     <div className="flex-1">

//                                         <p className="font-semibold text-gray-800 text-sm">
//                                             {v.title}
//                                         </p>

//                                         {v.description && (
//                                             <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">
//     {v.description}
// </p>
//                                         )}

//                                     </div>

//                                 </div>
//                             ))}

//                         </div>
//                     </div>
//                 ))}

//             </div>

//             {/* FOOTER */}
//             <div className="p-4 border-t flex justify-end">
//                 <button
//                     onClick={() => setViewData(null)}
//                     className="px-5 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-[#1f3159]"
//                 >
//                     Close
//                 </button>
//             </div>

//         </div>
//     </div>
// )}
//             <UploadVideoModal
//                 courseId={courseId}
//                 open={uploadOpen}
//                 close={() => setUploadOpen(false)}
//             />
//         </div>
//     );
// }