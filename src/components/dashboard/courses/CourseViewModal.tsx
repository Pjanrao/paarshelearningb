"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  course: any;
}

const Info = ({ label, value }: any) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-1">
      {value || "-"}
    </p>
  </div>
);

export default function CourseViewModal({ open, setOpen, course }: Props) {
  if (!course) return null;

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>, url: string, filename: string) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading free PDF:", error);
      // Fallback
      window.open(url, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95%] max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Course Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-10">

          {/* COURSE HEADER */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b pb-6">

            <img
              src={course.thumbnail}
              className="w-full sm:w-56 h-40 sm:h-32 rounded-lg object-cover border"
            />

            <div className="space-y-3">

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {course.name}
              </h2>

              <p className="text-gray-600 text-sm">
                {course.shortDescription}
              </p>

              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">

                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {course.category?.name}
                </span>

                <span className="bg-gray-100 px-2 py-1 rounded">
                  {course.subcategory?.name}
                </span>

                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  ₹ {course.fee}
                </span>

              </div>

            </div>
          </div>

          {/* COURSE INFORMATION */}
          <div>

            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Course Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

              <Info label="Difficulty" value={course.difficulty} />
              <Info label="Duration" value={`${course.duration} Days`} />
              <Info label="Availability" value={course.availability} />
              <Info label="Status" value={course.status} />
              <Info label="Instructor" value={course.instructor?.name} />
              <Info label="Certificate" value={course.certificate ? "Yes" : "No"} />
              <Info label="Featured" value={course.featured ? "Yes" : "No"} />

            </div>

          </div>

          {/* LANGUAGES */}
          <div>

            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Languages
            </h3>

            <div className="flex flex-wrap gap-2">

              {course.languages?.map((lang: string, i: number) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm"
                >
                  {lang}
                </span>
              ))}

            </div>

          </div>

          {/* TAGS */}
          <div>

            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Popular Tags
            </h3>

            <div className="flex flex-wrap gap-2">

              {course.popularTags?.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}

            </div>

          </div>

          {/* OVERVIEW */}
          <div>

            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Course Overview
            </h3>

            <div
              className="border rounded-lg p-4 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: course.overview }}
            />

          </div>

          {/* MEDIA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">

            {/* VIDEO */}
            <div>

              <h3 className="text-base sm:text-lg font-semibold mb-3">
                Introduction Video
              </h3>

              {course.introVideo ? (
                <video
                  src={course.introVideo}
                  controls
                  className="rounded-lg border w-full"
                />
              ) : (
                <p className="text-gray-500 text-sm">No video uploaded</p>
              )}

            </div>

            {/* PDF */}
            <div>

              <h3 className="text-base sm:text-lg font-semibold mb-3">
                Syllabus PDF
              </h3>

              {course.syllabusPdf ? (
                <button
                  onClick={(e) => handleDownload(e as any, course.syllabusPdf, `Syllabus-${course.name.replace(/\s+/g, '-')}.pdf`)}
                  className="text-blue-700 underline text-left"
                >
                  Download PDF
                </button>
              ) : (
                <p className="text-gray-500 text-sm">No PDF uploaded</p>
              )}

            </div>

          </div>

          {/* SYLLABUS */}
          <div>

            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Course Syllabus
            </h3>

            <div className="space-y-3">

              {course.syllabus?.map((s: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">
                    {s.title}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {s.description}
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* WHY JOIN */}
          {/* <div>

            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Why Join This Program
            </h3>

            <div className="grid grid-cols-2 gap-4">

              {course.whyJoin?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">
                    {item.title}
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}

            </div>

          </div> */}

          {/* BENEFITS */}
          <div>

            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Benefits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {course.benefits?.map((b: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <p className="font-semibold">
                    {b.title}
                  </p>

                  <p className="text-sm text-gray-600">
                    {b.description}
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* TESTIMONIALS */}
          {/* <div>

            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Student Testimonials
            </h3>

            <div className="grid grid-cols-2 gap-4">

              {course.testimonials?.map((t: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <p className="font-semibold text-gray-800">
                    {t.studentName}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {t.review}
                  </p>
                </div>
              ))}

            </div>

          </div> */}

        </div>

      </DialogContent>
    </Dialog>
  );
}