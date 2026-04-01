"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/redux/api/courseApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useGetSubcategoriesQuery } from "@/redux/api/subcategoryApi";
import { useGetTeachersQuery } from "@/redux/api/teachersApi";
import dynamic from "next/dynamic";
import "jodit/es2021/jodit.min.css";
import { Eye, Pencil, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  editing: any;
  onClose: () => void;
}

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function CourseFormModal({
  open,
  setOpen,
  editing,
  onClose,
}: Props) {

  const [errors, setErrors] = useState<any>({});
  const [tagsInput, setTagsInput] = useState("");
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: subcategories = [] } = useGetSubcategoriesQuery();

  const { data } = useGetTeachersQuery();
  const teachers = data?.teachers || [];

  console.log("Teachers:", teachers);

  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();

  const [form, setForm] = useState<any>({
    category: "",
    subcategory: "",
    name: "",
    difficulty: "",
    shortDescription: "",
    duration: "",
    availability: "available",
    status: "active",
    featured: false,
    certificate: false,
    instructor: "",
    languages: [],
    fee: 0,
    popularTags: [],
    overview: "",
    syllabusPdf: "",
    thumbnail: "",
    introVideo: "",
    syllabus: [{ title: "", description: "" }],
    benefits: [{ title: "", description: "" }],
    whyJoin: [{ title: "", description: "" }],
    testimonials: [{ studentName: "", review: "" }],
  });

  const [activeSection, setActiveSection] = useState<number | null>(0);
  const [activeWhyJoin, setActiveWhyJoin] = useState<number | null>(0);
  const [activeBenefit, setActiveBenefit] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(0);
  const filteredSubcategories = subcategories.filter(
    (sub: any) =>
      sub.category === form.category ||
      sub.category?._id === form.category
  );



  const [files, setFiles] = useState<{
    syllabusPdf?: File | null;
    thumbnail?: File | null;
    introVideo?: File | null;
  }>({});

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const predefinedLanguages = [
    "English",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Portuguese",
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");

  const editorConfig = useMemo(() => ({
    readonly: false,
    height: 300,
    placeholder: "Start typing...",
    toolbarAdaptive: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "paragraph",
      "|",
      "image",
      "video",
      "link",
      "|",
      "align",
      "|",
      "undo",
      "redo",
      "|",
      "source",
    ],
  }), []);


  useEffect(() => {
    if (!open) {
      setForm({
        category: "",
        subcategory: "",
        name: "",
        shortDescription: "",
        duration: "",
        difficulty: "",
        availability: "available",
        status: "active",
        featured: false,
        certificate: false,
        instructor: "",
        languages: [],
        fee: 0,
        popularTags: [],
        overview: "",
        syllabusPdf: "",
        thumbnail: "",
        introVideo: "",
        syllabus: [{ title: "", description: "" }],
        benefits: [{ title: "", description: "" }],
        // whyJoin: [{ title: "", description: "" }],
        whyJoin: [],
        //testimonials: [{ studentName: "", review: "" }],
        testimonials: [],
      });

      setFiles({});
      setThumbnailPreview(null);
      setVideoPreview(null);
      setPdfPreview(null);
    }
  }, [open]);


  useEffect(() => {
    if (editing) {
      setForm({
        category: editing.category?._id || "",
        subcategory: editing.subcategory?._id || "",
        name: editing.name || "",
        shortDescription: editing.shortDescription || "",
        duration: editing.duration || "",
        difficulty: editing.difficulty || "",
        availability: editing.availability || "available",
        status: editing.status || "active",
        featured: editing.featured || false,
        certificate: editing.certificate || false,
        instructor: editing.instructor?._id || "",
        languages: editing.languages || [],
        fee: editing.fee || 0,
        popularTags: editing.popularTags || [],
        overview: editing.overview || "",
        syllabus: editing.syllabus?.length
          ? editing.syllabus
          : [{ title: "", description: "" }],
        benefits: editing.benefits?.length
          ? editing.benefits
          : [{ title: "", description: "" }],

        // whyJoin: editing.whyJoin?.length
        //   ? editing.whyJoin
        //   : [{ title: "", description: "" }],

        // testimonials: editing.testimonials?.length
        //   ? editing.testimonials
        //   : [{ studentName: "", review: "" }],
        whyJoin: editing.whyJoin || [],
        testimonials: editing.testimonials || [],

        syllabusPdf: editing.syllabusPdf || "",
        thumbnail: editing.thumbnail || "",
        introVideo: editing.introVideo || "",
      });
      setTagsInput(editing.popularTags?.join(", ") || "");

    }

  }, [editing]);

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
      console.error("Error downloading PDF:", error);
      window.open(url, "_blank");
    }
  };


  const validateForm = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Course name is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.subcategory) newErrors.subcategory = "Subcategory is required";
    if (!form.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!form.popularTags.length)
      newErrors.popularTags = "At least one tag is required";
    if (!form.languages.length)
      newErrors.languages = "Select at least one language";
    if (!form.difficulty)
      newErrors.difficulty = "Select difficulty level";
    if (!form.duration)
      newErrors.duration = "Duration is required";
    if (!form.availability)
      newErrors.availability = "Select availability";
    if (!form.status)
      newErrors.status = "Select status";
    if (!form.fee)
      newErrors.fee = "Course price is required";
    if (!form.overview || form.overview === "<p><br></p>")
      newErrors.overview = "Overview is required";

    // Thumbnail required
    // if (!files.thumbnail && !form.thumbnail)
    //   newErrors.thumbnail = "Thumbnail image is required";
    if (!form.benefits || form.benefits.length === 0) {
      newErrors.benefits = "At least one benefit is required";
    } else {
      form.benefits.forEach((b: any) => {
        if (!b.title.trim() || !b.description.trim()) {
          newErrors.benefits = "All benefit fields are required";
        }
      });
    }

    // if (!form.whyJoin || form.whyJoin.length === 0) {
    //   newErrors.whyJoin = "At least one Why Join point is required";
    // } else {
    //   form.whyJoin.forEach((item: any) => {
    //     if (!item.title.trim() || !item.description.trim()) {
    //       newErrors.whyJoin =
    //         "All Why Join title and description fields are required";
    //     }
    //   });
    // }

    // Syllabus validation
    if (!form.syllabus || form.syllabus.length === 0) {
      newErrors.syllabus = "At least one syllabus section is required";
    } else {
      form.syllabus.forEach((section: any) => {
        if (!section.title.trim()) {
          newErrors.syllabus = "Each syllabus section must have a title";
        }

        if (!section.description || !section.description.trim()) {
          newErrors.syllabus =
            "Each syllabus section must have a description";
        }
      });
    }
    // PDF optional
    // Video optional
    // Instructor optional
    // Testimonials optional

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("HANDLE SUBMIT CALLED");
    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }
    try {
      const formData = new FormData();

      // 🔹 Safely append normal fields
      for (const key in form) {
        if (key === "syllabusPdf" || key === "thumbnail" || key === "introVideo") {
          continue; // 🚨 skip file fields
        }

        const value = form[key];

        // Fields that must be JSON stringified
        const jsonFields = [
          "languages",
          "popularTags",
          "syllabus",
          "benefits",
          "whyJoin",
          "testimonials",
        ];

        if (jsonFields.includes(key)) {
          try {
            const safeValue =
              value === undefined || value === null || value === ""
                ? []
                : value;

            formData.append(key, JSON.stringify(safeValue));
          } catch {
            formData.append(key, JSON.stringify([]));
          }
        } else {
          formData.append(key, value !== undefined ? String(value) : "");
        }
      }

      // 🔹 Append files properly
      if (files?.syllabusPdf instanceof File) {
        formData.append("syllabusPdf", files.syllabusPdf);
      }

      if (files?.thumbnail instanceof File) {
        formData.append("thumbnail", files.thumbnail);
      }

      if (files?.introVideo instanceof File) {
        formData.append("introVideo", files.introVideo);
      }

      // 🔥 DEBUG LOGS
      console.log("===== FORM DATA CHECK =====");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      console.log("Files state:", files);
      console.log("===========================");

      // 🔹 API Call
      if (editing) {
        await updateCourse({
          id: editing._id,
          data: formData,
        }).unwrap();
        toast.success("Course updated");
      } else {
        await createCourse(formData).unwrap();
        toast.success("Course created");
      }

      onClose();
    } catch (error: any) {
      console.error("Submit Error:", error);
      console.error("Full Error:", JSON.stringify(error, null, 2));
      toast.error("Error saving course");
    }
  };

  return (<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">

      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">
          {editing ? "Edit Course" : "Add New Course"}
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >

        <div className="space-y-6">

          {/* ===== BASIC INFORMATION ===== */}
          <div className="grid grid-cols-2 gap-4">

            {/* Course Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Course Name
              </label>

              <Input
                className="
      h-8
      text-sm
      border border-gray-300
      bg-white

      hover:border-blue-600
      hover:bg-blue-50/30

      focus:outline-none
      focus:ring-0
      focus:ring-offset-0
      focus-visible:ring-0
      focus-visible:ring-offset-0
      focus-visible:outline-none
      focus:border-blue-900

      transition
    "
                value={form.name || ""}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Category
              </label>

              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm({ ...form, category: value, subcategory: "", })
                }
              >
                <SelectTrigger
                  className="
    w-full
    h-9
    rounded-md
    px-3
    text-sm
    border border-gray-300
    bg-white
    hover:border-blue-600
    focus:outline-none
    focus:ring-0
    focus:ring-offset-0
    data-[state=open]:ring-0
    data-[state=open]:border-blue-900
    transition
  "
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  {categories.map((cat: any) => (
                    <SelectItem
                      key={cat._id}
                      value={cat._id}
                      className="text-sm cursor-pointer hover:bg-gray-100"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-600 mt-1">{errors.category}</p>
              )}
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Subcategory
              </label>

              <Select
                value={form.subcategory}
                onValueChange={(value) =>
                  setForm({ ...form, subcategory: value, })
                }
              >
                <SelectTrigger
                  className="
        w-full
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:ring-0
        data-[state=open]:border-blue-900
        transition
      "
                >
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  {filteredSubcategories.map((sub: any) => (
                    <SelectItem
                      key={sub._id}
                      value={sub._id}
                      className="text-sm cursor-pointer hover:bg-gray-100"
                    >
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subcategory && (
                <p className="text-xs text-red-600 mt-1">{errors.subcategory}</p>
              )}

            </div>

          </div>

          {/* Short Description */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800">

                Short Description
              </label>

              <Textarea
                rows={3}
                className="
      text-sm
      border border-gray-300
      bg-white

      hover:border-blue-500
      hover:bg-blue-50

      focus:outline-none
      focus:ring-0
      focus:ring-offset-0
      focus-visible:ring-0
      focus-visible:ring-offset-0
      focus-visible:outline-none
      focus:border-blue-900

      transition
    "
                value={form.shortDescription || ""}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
              />
              {errors.shortDescription && (
                <p className="text-xs text-red-600 mt-1">{errors.shortDescription}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800">
                Popular Tags (comma separated)
              </label>

              <Textarea
                rows={3}
                className="
      text-sm
      border border-gray-300
      bg-white

      hover:border-blue-500
      hover:bg-blue-50

      focus:outline-none
      focus:ring-0
      focus:ring-offset-0
      focus-visible:ring-0
      focus-visible:ring-offset-0
      focus-visible:outline-none
      focus:border-blue-900

      transition
    "
                value={tagsInput}
                onChange={(e) => {
                  const value = e.target.value;

                  setTagsInput(value);

                  setForm({
                    ...form,
                    popularTags: value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag !== ""),
                  });
                }}
              />
              {errors.popularTags && (
                <p className="text-xs text-red-600 mt-1">{errors.popularTags}</p>
              )}
            </div>
            <div className="space-y-3 border rounded-xl p-4 bg-white shadow-sm">

              <label className="block text-sm font-semibold text-gray-800">
                Thumbnail Image
              </label>

              {/* Upload Input */}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFiles((prev) => ({ ...prev, thumbnail: file }));
                    const previewUrl = URL.createObjectURL(file);
                    setThumbnailPreview(previewUrl);
                  }
                }}
              />

              {/* Preview Section */}
              {(thumbnailPreview || form.thumbnail) && (
                <div className="space-y-3">
                  <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                    {thumbnailPreview ? (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                        NEW UPLOAD
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                        EXISTING IMAGE
                      </span>
                    )}
                    <img
                      src={thumbnailPreview || form.thumbnail}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                    <p className="text-sm text-gray-700 truncate max-w-[200px]">
                      {files.thumbnail?.name || "Using current image"}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setFiles((prev) => ({ ...prev, thumbnail: null }));
                        setThumbnailPreview(null);
                        setForm((prev: any) => ({ ...prev, thumbnail: "" }));
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              {errors.thumbnail && (
                <p className="text-xs text-red-600 mt-1">{errors.thumbnail}</p>
              )}
            </div>


            {/* Video Upload */}
            <div className="space-y-3 border rounded-xl p-4 bg-white shadow-sm">

              <label className="block text-sm font-semibold text-gray-800">
                Introduction Video
              </label>

              {/* Upload Input */}
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFiles((prev) => ({ ...prev, introVideo: file }));
                    const previewUrl = URL.createObjectURL(file);
                    setVideoPreview(previewUrl);
                  }
                }}
              />

              {/* Preview Section */}
              {(videoPreview || form.introVideo) && (
                <div className="space-y-3">
                  {/* Video Player */}
                  <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border">
                    {videoPreview ? (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                        NEW UPLOAD
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                        EXISTING VIDEO
                      </span>
                    )}
                    <video
                      src={videoPreview || form.introVideo}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Info + Remove */}
                  <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                    <p className="text-sm text-gray-700 truncate max-w-[200px]">
                      {files.introVideo?.name || "Using current video"}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setFiles((prev) => ({ ...prev, introVideo: null }));
                        setVideoPreview(null);
                        setForm((prev: any) => ({ ...prev, introVideo: "" }));
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

            </div>


          </div>
          <div className="grid grid-cols-2 gap-4">

            <div>
              <div className="space-y-3 border rounded-xl p-4 bg-white shadow-sm">

                <label className="block text-sm font-semibold text-gray-800">
                  Syllabus PDF
                </label>

                {/* Upload Input */}
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFiles((prev) => ({ ...prev, syllabusPdf: file }));
                      const previewUrl = URL.createObjectURL(file);
                      setPdfPreview(previewUrl);
                    }
                  }}
                />

                {/* Preview Section */}
                {(pdfPreview || form.syllabusPdf) && (
                  <div className="space-y-3">
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border flex flex-col items-center justify-center p-4">
                      {pdfPreview ? (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                          NEW UPLOAD
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                          EXISTING PDF
                        </span>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-600 text-4xl">📄</span>
                        <p className="text-xs font-semibold text-gray-600">Syllabus PDF File</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                      <p className="text-sm text-gray-700 truncate max-w-37.5">
                        {files.syllabusPdf?.name || "Using current PDF"}
                      </p>

                      <div className="flex items-center gap-3">
                        <a
                          href={pdfPreview || form.syllabusPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleDownload(e, pdfPreview || form.syllabusPdf, `Syllabus-${form.name.replace(/\s+/g, '-')}.pdf`)}
                          className="text-xs text-blue-700 hover:underline font-medium"
                        >
                          Download
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setFiles((prev) => ({ ...prev, syllabusPdf: null }));
                            setPdfPreview(null);
                            setForm((prev: any) => ({ ...prev, syllabusPdf: "" }));
                          }}
                          className="text-xs text-red-600 hover:underline font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            <div className="space-y-3 border rounded-xl p-4 bg-white shadow-sm">


              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Languages
              </label>

              {/* Tag Input Box */}
              <div className="border rounded-md px-3 py-2 min-h-10 bg-white flex flex-wrap items-center gap-2">

                {form.languages.length > 0 ? (
                  form.languages.map((lang: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev: any) => ({
                            ...prev,
                            languages: prev.languages.filter(
                              (_: string, i: number) => i !== index
                            ),
                          }))
                        }
                        className="text-gray-500 hover:text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    Select languages...
                  </span>
                )}

              </div>

              {/* Select + Custom + Add */}
              {/* Select + Custom + Add */}
              <div className="flex gap-2 mt-2">

                {/* ShadCN Dropdown */}
                <Select
                  value=""
                  onValueChange={(newLang) => {
                    if (!newLang) return;

                    setForm((prev: any) => {
                      if (prev.languages.includes(newLang)) return prev;

                      return {
                        ...prev,
                        languages: [...prev.languages, newLang],
                      };
                    });
                  }}
                >
                  <SelectTrigger
                    className="
        flex-1
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:border-blue-900
        transition
      "
                  >
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>

                  <SelectContent
                    className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                  >
                    {predefinedLanguages.map((lang) => (
                      <SelectItem
                        key={lang}
                        value={lang}
                        className="text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Custom Input */}
                <Input
                  className="flex-1 h-9 text-sm"
                  placeholder="Or type custom"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                />

                {/* Add Button */}
                <Button
                  type="button"
                  className="h-9 px-4 bg-blue-900 hover:bg-blue-800 text-white"
                  onClick={() => {
                    const newLang = customLanguage.trim();
                    if (!newLang) return;

                    setForm((prev: any) => {
                      if (prev.languages.includes(newLang)) return prev;

                      return {
                        ...prev,
                        languages: [...prev.languages, newLang],
                      };
                    });

                    setCustomLanguage("");
                  }}
                >
                  Add
                </Button>

              </div>
              {errors.languages && (
                <p className="text-xs text-red-600 mt-1">{errors.languages}</p>
              )}
            </div>



            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Difficulty Level
              </label>

              <Select
                value={form.difficulty || ""}
                onValueChange={(value) =>
                  setForm({ ...form, difficulty: value })
                }
              >
                <SelectTrigger
                  className="
        w-full
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:border-blue-900
        transition
      "
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  <SelectItem
                    value="beginner"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Beginner
                  </SelectItem>

                  <SelectItem
                    value="intermediate"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Intermediate
                  </SelectItem>

                  <SelectItem
                    value="advanced"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Advanced
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-xs text-red-600 mt-1">{errors.difficulty}</p>
              )}
            </div>
            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Course Duration (in Months)
              </label>

              <Input
                type="number"
                className="
      h-8
      text-sm
      border border-gray-300
      bg-white

      hover:border-blue-600
      hover:bg-blue-50/30

      focus:outline-none
      focus:ring-0
      focus:ring-offset-0
      focus-visible:ring-0
      focus-visible:ring-offset-0
      focus-visible:outline-none
      focus:border-blue-900

      transition
    "
                value={form.duration || ""}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })}
              />
              {errors.duration && (
                <p className="text-xs text-red-600 mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Availability
              </label>

              <Select
                value={form.availability}
                onValueChange={(value) =>
                  setForm({ ...form, availability: value })
                }
              >
                <SelectTrigger
                  className="
        w-full
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:border-blue-900
        transition
      "
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  <SelectItem
                    value="available"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Available
                  </SelectItem>

                  <SelectItem
                    value="unavailable"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Unavailable
                  </SelectItem>

                  <SelectItem
                    value="upcoming"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Upcoming
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.availability && (
                <p className="text-xs text-red-600 mt-1">{errors.availability}</p>
              )}
            </div>

            {/* Featured */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Featured Course
              </label>

              <Select
                value={form.featured ? "yes" : "no"}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    featured: value === "yes",
                  })
                }
              >
                <SelectTrigger
                  className="
        w-full
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:border-blue-900
        transition
      "
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  <SelectItem
                    value="no"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    No
                  </SelectItem>

                  <SelectItem
                    value="yes"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Yes
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.featured && (
                <p className="text-xs text-red-600 mt-1">{errors.featured}</p>
              )}
            </div>

            {/* Certificate */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Certificate
              </label>

              <Select
                value={form.certificate ? "yes" : "no"}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    certificate: value === "yes",
                  })
                }
              >
                <SelectTrigger
                  className="
        w-full
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:border-blue-900
        transition
      "
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  <SelectItem
                    value="no"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    No
                  </SelectItem>

                  <SelectItem
                    value="yes"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Yes
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.certificate && (
                <p className="text-xs text-red-600 mt-1">{errors.certificate}</p>
              )}
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Instructor
              </label>

              <Select
                value={form.instructor || ""}
                onValueChange={(value) =>
                  setForm({ ...form, instructor: value })
                }
              >
                <SelectTrigger
                  className="
        w-full
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:border-blue-900
        transition
      "
                >
                  <SelectValue placeholder="Select Instructor" />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  {teachers.map((teacher: any) => (
                    <SelectItem
                      key={teacher._id}
                      value={teacher._id}
                      className="text-sm cursor-pointer hover:bg-gray-100"
                    >
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Course Price
              </label>

              <Input
                type="number"
                className="
      h-8
      text-sm
      border border-gray-300
      bg-white
      appearance-none

      hover:border-blue-600
      hover:bg-blue-50/30

      focus:outline-none
      focus:ring-0
      focus:ring-offset-0
      focus-visible:ring-0
      focus-visible:ring-offset-0
      focus-visible:outline-none
      focus:border-blue-900

      transition
    "
                value={form.fee || ""}
                onChange={(e) =>
                  setForm({ ...form, fee: Number(e.target.value) })
                }
              />
              {errors.fee && (
                <p className="text-xs text-red-600 mt-1">{errors.fee}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Status
              </label>

              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm({ ...form, status: value })
                }
              >
                <SelectTrigger
                  className="
        w-full
        h-9
        rounded-md
        px-3
        text-sm
        border border-gray-300
        bg-white
        hover:border-blue-600
        focus:outline-none
        focus:ring-0
        focus:ring-offset-0
        data-[state=open]:border-blue-900
        transition
      "
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  className="
        rounded-md
        border
        shadow-md
        max-h-60
        overflow-y-auto
        bg-white
        z-100
      "
                >
                  <SelectItem
                    value="active"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Active
                  </SelectItem>

                  <SelectItem
                    value="inactive"
                    className="text-sm cursor-pointer hover:bg-gray-100"
                  >
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-red-600 mt-1">{errors.status}</p>
              )}
            </div>


            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Overview
              </label>

              <div className="border border-gray-300 rounded-md overflow-hidden hover:border-blue-600 transition">
                <JoditEditor
                  value={form.overview}
                  config={editorConfig}
                  onChange={(newContent) => {
                    setForm((prev: any) => ({
                      ...prev,
                      overview: newContent,
                    }));
                  }}
                />
              </div>
              {errors.overview && (
                <p className="text-xs text-red-600 mt-1">{errors.overview}</p>
              )}
            </div>
            {/* Price */}


          </div>

          {/* ===== FILES ===== */}


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-5">

              {/* HEADER */}
              <h3 className="text-sm font-semibold text-gray-800">
                Course Syllabus
              </h3>

              {form.syllabus?.map((section: any, index: number) => {
                const isOpen = activeSection === index;
                const showActions = form.syllabus.length > 1;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden transition hover:border-blue-300"
                  >

                    {/* COLLAPSED HEADER */}
                    {!isOpen && (
                      <div className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/40 transition">

                        <div
                          className="cursor-pointer font-medium text-sm text-gray-700"
                          onClick={() => setActiveSection(index)}
                        >
                          {section.title || "Click to add section title"}
                        </div>

                        {showActions && (
                          <div className="flex items-center gap-4 text-xs">
                            <button
                              type="button"
                              onClick={() => setActiveSection(index)}
                              className="text-blue-700 hover:text-blue-900 transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = form.syllabus.filter(
                                  (_: any, i: number) => i !== index
                                );
                                setForm({ ...form, syllabus: updated });

                                if (activeSection === index) {
                                  setActiveSection(null);
                                } else if (activeSection !== null && activeSection > index) {
                                  setActiveSection(activeSection! - 1);
                                }
                              }}
                              className="text-red-600 hover:text-red-700 transition"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* EXPANDED CONTENT */}
                    {isOpen && (
                      <div className="p-4 space-y-3 bg-white">

                        <Input
                          placeholder="Section title"
                          className="
                h-8 text-sm border border-gray-300 bg-white
                hover:border-blue-600 hover:bg-blue-50/30
                focus:outline-none focus:ring-0 focus:ring-offset-0
                focus-visible:ring-0 focus-visible:ring-offset-0
                focus-visible:outline-none focus:border-blue-900
                transition
              "
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...form.syllabus];

                            updated[index] = {
                              ...updated[index],
                              title: e.target.value,
                            };

                            setForm((prev: any) => ({
                              ...prev,
                              syllabus: updated,
                            }));
                          }}
                        />

                        <Textarea
                          placeholder="Short Description"
                          rows={3}
                          className="
                text-sm border border-gray-300 bg-white
                hover:border-blue-600 hover:bg-blue-50/30
                focus:outline-none focus:ring-0 focus:ring-offset-0
                focus-visible:ring-0 focus-visible:ring-offset-0
                focus-visible:outline-none focus:border-blue-900
                transition
              "
                          value={section.description}
                          onChange={(e) => {
                            const updated = [...form.syllabus];
                            updated[index] = {
                              ...updated[index],
                              description: e.target.value,
                            }; setForm({ ...form, syllabus: updated });
                          }}
                        />

                      </div>
                    )}

                  </div>
                );
              })}

              {/* ADD BUTTON */}
              <button
                type="button"
                onClick={() => {
                  const newSections = [
                    ...form.syllabus,
                    { title: "", description: "" },
                  ];
                  setForm({ ...form, syllabus: newSections });
                  setActiveSection(newSections.length - 1);
                }}
                className="
      text-sm font-semibold text-blue-900
      hover:text-blue-950
      transition
    "
              >
                + Add more section
              </button>
              {errors.syllabus && (
                <p className="text-xs text-red-600 mt-1">{errors.syllabus}</p>
              )}
            </div>

            <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-5">

              <h3 className="text-sm font-semibold text-gray-800">
                Benefits
              </h3>

              {form.benefits?.map((item: any, index: number) => {
                const isOpen = activeBenefit === index;
                const showActions = form.benefits.length > 1;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden transition hover:border-blue-300"
                  >

                    {/* COLLAPSED HEADER */}
                    {!isOpen && (
                      <div className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/40 transition">

                        <div
                          className="cursor-pointer font-medium text-sm text-gray-700"
                          onClick={() => setActiveBenefit(index)}
                        >
                          {item.title || "Click to add title"}
                        </div>

                        {showActions && (
                          <div className="flex items-center gap-4 text-xs">
                            <button
                              type="button"
                              onClick={() => setActiveBenefit(index)}
                              className="text-blue-700 hover:text-blue-900 transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const updated = form.benefits.filter(
                                  (_: any, i: number) => i !== index
                                );
                                setForm({ ...form, benefits: updated });

                                if (activeBenefit === index) {
                                  setActiveBenefit(null);
                                } else if (activeBenefit !== null && activeBenefit > index) {
                                  setActiveBenefit(activeBenefit! - 1);
                                }
                              }}
                              className="text-red-600 hover:text-red-700 transition"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* EXPANDED CONTENT */}
                    {isOpen && (
                      <div className="p-4 space-y-3 bg-white">

                        <Input
                          placeholder="Title"
                          className="
                h-8 text-sm border border-gray-300 bg-white
                hover:border-blue-600 hover:bg-blue-50/30
                focus:outline-none focus:ring-0 focus:ring-offset-0
                focus-visible:ring-0 focus-visible:ring-offset-0
                focus-visible:outline-none focus:border-blue-900
                transition
              "
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...form.benefits];

                            updated[index] = {
                              ...updated[index],
                              title: e.target.value,
                            };

                            setForm((prev: any) => ({
                              ...prev,
                              benefits: updated,
                            }));
                          }}
                        />

                        <Textarea
                          placeholder="Description"
                          rows={3}
                          className="
                text-sm border border-gray-300 bg-white
                hover:border-blue-600 hover:bg-blue-50/30
                focus:outline-none focus:ring-0 focus:ring-offset-0
                focus-visible:ring-0 focus-visible:ring-offset-0
                focus-visible:outline-none focus:border-blue-900
                transition
              "
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...form.benefits];

                            updated[index] = {
                              ...updated[index],
                              description: e.target.value,
                            };

                            setForm((prev: any) => ({
                              ...prev,
                              benefits: updated,
                            }));
                          }}
                        />

                      </div>
                    )}

                  </div>
                );
              })}

              {/* ADD BUTTON */}
              <button
                type="button"
                disabled={form.benefits.length >= 4}
                onClick={() => {
                  if (form.benefits.length >= 4) return;

                  const newItems = [
                    ...form.benefits,
                    { title: "", description: "" },
                  ];

                  setForm({ ...form, benefits: newItems });
                  setActiveBenefit(newItems.length - 1);
                }}
                className={`text-sm font-semibold transition ${form.benefits.length >= 4
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-900 hover:text-blue-950"
                  }`}
              >
                + Add Benefit (Max 4)
              </button>
              {errors.benefits && (
                <p className="text-xs text-red-600 mt-1">{errors.benefits}</p>
              )}
            </div>


          </div>
          {/* ===== SUBMIT ===== */}
          <div className="flex justify-end items-center gap-6 pt-6 border-t">

            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 text-lg font-medium hover:text-gray-800 transition"
            >
              Cancel
            </button>


            {/* Primary Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-900 hover:bg-blue-950 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition"
            >
              {editing ? "Update Course" : "Save Course"}
            </button>


          </div>

        </div>
      </form>
    </DialogContent>
  </Dialog>
  );
}