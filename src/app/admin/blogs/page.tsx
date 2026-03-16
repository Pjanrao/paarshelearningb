"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Loader2, X, FileText } from "lucide-react";
import DeleteCourseDialog from "@/components/dashboard/courses/DeleteCourseDialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Blog {
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    publishedDate: string;
    tags: string[];
    status: "published" | "draft";
}

interface BlogFormData {
    title: string;
    content: string;
    imageUrl: string;
    author: {
        name: string;
        role: string;
    };
    tags: string;
    status: "published" | "draft";
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const blogsPerPage = 10;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [formData, setFormData] = useState<BlogFormData>({
        title: "",
        content: "",
        imageUrl: "",
        author: {
            name: "",
            role: "",
        },
        tags: "",
        status: "draft",
    });

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/blogs?search=${searchQuery}&page=${currentPage}&limit=${blogsPerPage}`
            );
            const data = await response.json();

            if (response.ok) {
                setBlogs(data.blogs);
                setTotalPages(data.pagination.totalPages);
                setTotal(data.pagination.total);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchBlogs();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentPage]);

    const handleAddBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(",").map((tag) => tag.trim()),
                }),
            });

            if (response.ok) {
                setIsAddModalOpen(false);
                resetForm();
                fetchBlogs();
            } else {
                alert("Failed to create blog");
            }
        } catch (error) {
            console.error("Error creating blog:", error);
            alert("Failed to create blog");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBlog) return;

        setFormLoading(true);

        try {
            const response = await fetch(`/api/blogs/${selectedBlog._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(",").map((tag) => tag.trim()),
                }),
            });

            if (response.ok) {
                setIsEditModalOpen(false);
                resetForm();
                fetchBlogs();
            } else {
                alert("Failed to update blog");
            }
        } catch (error) {
            console.error("Error updating blog:", error);
            alert("Failed to update blog");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const response = await fetch(`/api/blogs/${deleteId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchBlogs();
                setDeleteId(null);
            } else {
                alert("Failed to delete blog");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete blog");
        } finally {
            setDeleteLoading(false);
        }
    };

    const openAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const openEditModal = (blog: Blog) => {
        setSelectedBlog(blog);
        setFormData({
            title: blog.title,
            content: blog.content,
            imageUrl: blog.imageUrl || "",
            author: {
                name: blog.author.name,
                role: blog.author.role,
            },
            tags: blog.tags.join(", "),
            status: blog.status,
        });
        setIsEditModalOpen(true);
    };

    const openViewModal = (blog: Blog) => {
        setSelectedBlog(blog);
        setIsViewModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            content: "",
            imageUrl: "",
            author: { name: "", role: "" },
            tags: "",
            status: "draft",
        });
        setSelectedBlog(null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Blog Management</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Create, edit and manage educational blog posts</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add New Blog</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Loading blogs...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No blogs found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                            {searchQuery
                                ? "We couldn't find any blogs matching your search. Try a different term."
                                : "The blog directory is currently empty. Click 'Add New Blog' to get started."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-auto h-[450px] sm:max-h-[600px] border-x rounded-t-xl">
                            <table className="w-full divide-y divide-gray-200 min-w-[900px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thumbnail</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Published Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tags</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {blogs.map((blog, index) => (
                                        <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {(currentPage - 1) * blogsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                    {blog.imageUrl ? (
                                                        <img src={blog.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg">
                                                            {blog.title.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[200px] truncate" title={blog.title}>
                                                {blog.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase">
                                                        {blog.author.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{blog.author.name}</div>
                                                        <div className="text-xs text-gray-500">{blog.author.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(blog.publishedDate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {blog.tags.slice(0, 2).map((tag, idx) => (
                                                        <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-medium border border-blue-100">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {blog.tags.length > 2 && (
                                                        <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-100">
                                                            +{blog.tags.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${blog.status === "published"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {blog.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openViewModal(blog)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Blog"><Eye size={18} /></button>
                                                    <button onClick={() => openEditModal(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Blog"><Pencil size={18} /></button>
                                                    <button onClick={() => setDeleteId(blog._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Blog"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600 font-medium order-2 md:order-1">
                                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * blogsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * blogsPerPage, total)}</span> of <span className="font-bold text-gray-900">{total}</span> blogs
                            </div>
                            <div className="flex items-center gap-2 order-1 md:order-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Previous
                                </button>
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${currentPage === pageNum ? "bg-[#2C4276] text-white" : "border bg-white hover:bg-gray-50 text-gray-700"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="sm:hidden text-sm font-bold px-3 py-2 border rounded-lg bg-white">
                                    {currentPage} / {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">{isAddModalOpen ? "Write New Blog" : "Edit Blog Content"}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={isAddModalOpen ? handleAddBlog : handleEditBlog} className="p-6 space-y-4 h-[500px] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Blog Title <span className="text-red-500">*</span></label>
                                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Enter an engaging title" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL</label>
                                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="/blog1.png" />
                                {formData.imageUrl && (
                                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-32">
                                        <img src={formData.imageUrl} alt="Cover preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
                                <textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={8} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none" placeholder="Write your blog post here..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author Name <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.author.name} onChange={(e) => setFormData({ ...formData, author: { ...formData.author, name: e.target.value } })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Author Role <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.author.role} onChange={(e) => setFormData({ ...formData, author: { ...formData.author, role: e.target.value } })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Senior Editor" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (Comma separated)</label>
                                <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Technology, Education, News" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Visibility Status</label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as "published" | "draft" })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white">
                                    <option value="draft">Draft (Private)</option>
                                    <option value="published">Published (Public)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" disabled={formLoading} className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold">
                                    {formLoading && <Loader2 className="animate-spin" size={16} />}
                                    {isAddModalOpen ? "Create Post" : "Update Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isViewModalOpen && selectedBlog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Blog Preview</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    {selectedBlog.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-100">{tag}</span>
                                    ))}
                                    <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedBlog.status === "published"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {selectedBlog.status}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-6">{selectedBlog.title}</h1>

                                {selectedBlog.imageUrl && (
                                    <div className="rounded-xl overflow-hidden border border-gray-100 mb-6 h-56">
                                        <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                                        {selectedBlog.author.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{selectedBlog.author.name}</div>
                                        <div className="text-xs text-gray-500">{selectedBlog.author.role} • {formatDate(selectedBlog.publishedDate)}</div>
                                    </div>
                                </div>

                                <div className="prose prose-blue max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                                        {selectedBlog.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => { setIsViewModalOpen(false); openEditModal(selectedBlog); }}
                                className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 font-bold shadow-md transition-all"
                            >
                                Edit Post
                            </button>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white dark:bg-gray-900">
                    <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                            <Trash2 className="text-red-600" size={22} />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                            Delete Blog Post
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete this blog post? This action cannot be undone and will permanently delete the post from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                        >
                            {deleteLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
