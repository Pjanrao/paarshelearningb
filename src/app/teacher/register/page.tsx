"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Upload } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface FormErrors {
    [key: string]: string;
}

export default function TeacherRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        designation: "",
        course: "",
        experience: "",
        dateOfJoining: "",
        avatar: "",
        totalStudents: "",
        rating: "",
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true);
            const res = await fetch("/api/courses?limit=200");
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses || []);
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoadingCourses(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
        else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Contact must be 10 digits";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.designation.trim()) newErrors.designation = "Designation is required";
        if (!formData.course.trim()) newErrors.course = "Course domain is required";
        if (!formData.experience.trim()) newErrors.experience = "Experience is required";
        if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors below");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/teacher/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "Registration successful");
                router.push("/signin");
            } else {
                toast.error(data.message || "Registration failed");
                setErrors({ submit: data.message || "Registration failed" });
            }
        } catch (error) {
            toast.error("Something went wrong");
            setErrors({ submit: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "teachers");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({ ...prev, avatar: data.url }));
                toast.success("Image uploaded successfully");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register as a Teacher
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join our faculty and manage your students.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {errors.submit && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="text-sm font-medium text-red-800">{errors.submit}</p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.name ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Number <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="contact"
                                    required
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    maxLength={10}
                                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9]/g, "");
                                    }}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.contact ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                    placeholder="10-digit number"
                                />
                                {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                    placeholder="Minimum 6 characters"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Highest Designation <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="designation"
                                    required
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.designation ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                    placeholder="e.g., Senior Instructor"
                                />
                                {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expertise / Course Domain <span className="text-red-500">*</span></label>
                                {loadingCourses ? (
                                    <div className="mt-1 flex items-center gap-2 text-gray-500">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Loading courses...</span>
                                    </div>
                                ) : (
                                    <>
                                        <select
                                            name="course"
                                            required
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.course ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                        >
                                            <option value="">Select a course</option>
                                            {courses.map((course) => (
                                                <option key={course._id} value={course.name}>
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course}</p>}
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience (Years) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="experience"
                                    required
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.experience ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                    placeholder="e.g., 5+"
                                />
                                {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Available from (Date of Joining) <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    name="dateOfJoining"
                                    required
                                    value={formData.dateOfJoining}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.dateOfJoining ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                                />
                                {errors.dateOfJoining && <p className="mt-1 text-sm text-red-600">{errors.dateOfJoining}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Students <span className="text-gray-500 text-xs">(Optional)</span></label>
                                <input
                                    type="number"
                                    name="totalStudents"
                                    value={formData.totalStudents}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., 100"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating <span className="text-gray-500 text-xs">(Optional - out of 5)</span></label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., 4.8"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profile Picture <span className="text-gray-500 text-xs">(Optional)</span></label>
                            <div className="mt-2 flex items-center gap-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
                                {formData.avatar ? (
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                        <img src={formData.avatar} alt="Profile Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 border-2 border-white shadow-md">
                                        <Upload size={24} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || loadingCourses}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 className="animate-spin mr-2" size={20} />}
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
