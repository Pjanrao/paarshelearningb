"use client";

import { useState } from "react";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CourseFormModal from "@/components/dashboard/courses/CourseFormModal";
import { Eye, Pencil, Trash2, Video as VideoIcon } from "lucide-react";
import CourseViewModal from "@/components/dashboard/courses/CourseViewModal";
import ManageVideosModal from "@/components/dashboard/courses/ManageVideosModal";
import { useDeleteCourseMutation } from "@/redux/api/courseApi";
import { toast } from "sonner";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import DeleteCourseDialog from "@/components/dashboard/courses/DeleteCourseDialog";

export default function CourseManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState<number | "all">(10);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { data: categoryData } = useGetCategoriesQuery();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const categories = categoryData || [];
  const handleClose = () => {
    setEditing(null);
    setOpen(false);
  };

  const { data, isLoading } = useGetCoursesQuery({
    page,
    limit: limit === "all" ? 10000 : limit,
    search,
    category,
    sort,
  });

  const courses = Array.isArray(data?.courses) ? data.courses : [];
  const totalPages = data?.totalPages || 1;

  const [viewOpen, setViewOpen] = useState(false);
  const [viewCourse, setViewCourse] = useState<any>(null);
  const [deleteCourse] = useDeleteCourseMutation();
  const [videosOpen, setVideosOpen] = useState(false);
  const [videoCourse, setVideoCourse] = useState<any>(null);




  return (

    <div className="bg-gray-50 h-full">
      <div className="mb-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>
            <h1 className="text-3xl font-bold text-[#2C4276]">
              Courses Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track all available courses
            </p>
          </div>

          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-[#2C4276] hover:bg-[#1f3159] text-white"
          >
            + Add Course
          </Button>

        </div>
        {/* FILTERS */}
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center">

          {/* Search */}
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="pl-10 bg-gray-50 border rounded-xl"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          {/* Category Filter */}
          <Select
            value={category}
            onValueChange={(val) => {
              setPage(1);
              setCategory(val === "all" ? "" : val);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All</SelectItem>

              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sorting */}
          <Select
            value={sort}
            onValueChange={(val) => setSort(val)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="price_asc">Price: Low → High</SelectItem>
              <SelectItem value="price_desc">Price: High → Low</SelectItem>
              <SelectItem value="date_desc">Newest First</SelectItem>
              <SelectItem value="date_asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>

        </div></div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-auto max-h-[calc(100vh-250px)]">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs sticky top-0 z-10">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Course</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Instructor</th>
              <th className="p-4 text-left">Duration</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {isLoading ? (
              <tr>
                <td colSpan={9} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              courses.map((course: any, index: number) => (
                <tr
                  key={course._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">{(page - 1) * (limit === "all" ? (data?.total || 0) : limit) + index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold uppercase">
                          {course.name.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {course.name}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate w-48">
                          {course.shortDescription}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                      {course.category?.name}
                    </span>
                  </td>

                  <td className="p-4">

                    {course.instructor?.name}
                  </td>

                  <td className="p-4">
                    {course.duration} Months
                  </td>

                  <td className="p-4 font-semibold">
                    ₹ {course.fee}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
    ${course.status === "active"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                        }
`}
                    >
                      {course.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">

                      <button
                        onClick={() => {
                          setViewCourse(course);
                          setViewOpen(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="View Course"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setVideoCourse(course);
                          setVideosOpen(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Manage Videos"
                      >
                        <VideoIcon size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setEditing(course);
                          setOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Course"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => setDeleteId(course._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side Info */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * (limit === "all" ? (data?.total || 0) : limit) + 1} to{" "}
            {Math.min(page * (limit === "all" ? (data?.total || 0) : limit), data?.total || 0)} of{" "}
            {data?.total || 0}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>Show:</span>
            <select
              value={limit}
              onChange={(e) => {
                const val = e.target.value;
                setLimit(val === "all" ? "all" : Number(val));
                setPage(1);
              }}
              className="border px-2 py-1 rounded-lg text-sm bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">

          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg text-sm border transition ${page === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === p
                ? "bg-blue-900 text-white shadow-md"
                : "bg-white border hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg text-sm border transition ${page === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
              }`}
          >
            Next
          </button>

        </div>
      </div>
      <CourseFormModal
        open={open}
        setOpen={setOpen}
        editing={editing}
        onClose={handleClose}
      />

      <CourseViewModal
        open={viewOpen}
        setOpen={setViewOpen}
        course={viewCourse}
      />
      <DeleteCourseDialog
        deleteId={deleteId}
        setDeleteId={setDeleteId}
      />

      <ManageVideosModal
        open={videosOpen}
        setOpen={setVideosOpen}
        course={videoCourse}
      />
    </div>
  );
}