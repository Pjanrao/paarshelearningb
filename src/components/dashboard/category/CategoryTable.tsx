


"use client";

import { Category } from "@/redux/api/categoryApi";
import { useState, useMemo } from "react";
import { Search, Loader2, Folder, Pencil, Trash2 } from "lucide-react";
import { Eye } from "lucide-react";
import CategoryViewModal from "@/components/dashboard/category/CategoryViewModal";

interface Props {
  categories: Category[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 5;

export default function CategoryTable({
  categories,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewOpen, setViewOpen] = useState(false);

  const [viewCategory, setViewCategory] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="bg-gray-50 h-full">
        <div className="mb-6">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div>
              <h1 className="text-3xl font-bold text-[#2C4276]">
                Categories
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage course categories
              </p>
            </div>

            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#2C4276] text-white rounded-lg text-sm font-medium shadow-md hover:bg-opacity-90"
            >
              + Add Category
            </button>

          </div>


          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center mb-6">
            {/* SEARCH */}

            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#2C4276]/20 outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

          </div>

          {/* LOADING */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-gray-500 animate-pulse">
                Fetching categories...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 px-4">

              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="text-gray-400" size={32} />
              </div>

              <p className="text-gray-500 text-lg font-medium">
                No categories found
              </p>

              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search
              </p>

            </div>
          ) : (
            <>
              {/* TABLE */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-sm">

                  <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs sticky top-0">
                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">

                    {paginated.map((cat, index) => (
                      <tr key={cat._id} className="hover:bg-gray-50 transition">

                        <td className="p-4">
                          {(page - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>

                        {/* CATEGORY */}
                        <td className="p-4">

                          <div className="flex items-center gap-3">

                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white
 font-bold uppercase">
                              {cat.name.charAt(0)}
                            </div>

                            <div className="text-sm font-bold text-gray-900">
                              {cat.name}
                            </div>

                          </div>

                        </td>

                        {/* STATUS */}
                        <td className="p-4">

                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                          ${cat.isActive
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-red-50 text-red-600 border-red-100"
                              }`}
                          >
                            {cat.isActive ? "Active" : "Inactive"}
                          </span>

                        </td>

                        {/* CREATED */}
                        <td className="p-4">
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() => {
                                setViewCategory(cat);
                                setViewOpen(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            >
                              <Eye size={18} />
                            </button>

                            <button
                              onClick={() => onEdit(cat)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              onClick={() => onDelete(cat._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">

                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                  {filtered.length}
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm transition
                      ${page === i + 1
                          ? "bg-[#2C4276] text-white"
                          : "border bg-white hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>

                </div>
              </div>

            </>
          )}
        </div>

      </div>
      <CategoryViewModal
        open={viewOpen}
        setOpen={setViewOpen}
        category={viewCategory}
      />
    </>
  );
}
