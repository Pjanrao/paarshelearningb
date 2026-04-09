"use client";

import { useMemo, useState } from "react";
import { Subcategory } from "@/redux/api/subcategoryApi";
import { Search, Loader2, Folder, Pencil, Trash2 } from "lucide-react";
import { Eye } from "lucide-react";
import SubcategoryViewModal from "./SubcategoryViewModal";

interface Props {
  subcategories: Subcategory[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 5;

export default function SubcategoryTable({
  subcategories,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: Props) {

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSubcategory, setViewSubcategory] = useState<Subcategory | null>(null);

  const filtered = useMemo(() => {
    return subcategories.filter((sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subcategories, searchQuery]);

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
                Subcategories
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage course subcategories
              </p>
            </div>

            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#2C4276] text-white rounded-lg text-sm font-medium shadow-md hover:bg-opacity-90"
            >
              + Add Subcategory
            </button>

          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center mb-6">

            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search subcategories..."
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
                Fetching subcategories...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 px-4">

              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="text-gray-400" size={32} />
              </div>

              <p className="text-gray-500 text-lg font-medium">
                No subcategories found
              </p>

              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search
              </p>

            </div>
          ) : (
            <>
              {/* TABLE */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs sticky top-0">
                      <tr>

                        <th className="p-4 text-left">ID</th>

                        <th className="p-4 text-left">
                          Category
                        </th>

                        <th className="p-4 text-left">
                          Subcategory
                        </th>

                        <th className="p-4 text-left">
                          Created
                        </th>

                        <th className="p-4 text-left">
                          Actions
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">

                      {paginated.map((sub, index) => (

                        <tr key={sub._id} className="hover:bg-gray-50 transition">

                          {/* ID */}
                          <td className="p-4">
                            {(page - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>

                          {/* CATEGORY */}
                          <td className="p-4 font-medium">
                            {sub.category?.name}
                          </td>

                          {/* SUBCATEGORY */}
                          <td className="p-4">

                            <div className="flex items-center gap-3">

                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white
 font-bold uppercase">
                                {sub.name.charAt(0)}
                              </div>

                              <div className="text-sm font-bold text-gray-900">
                                {sub.name}
                              </div>

                            </div>

                          </td>

                          {/* CREATED */}
                          <td className="p-4">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>

                          {/* ACTIONS */}
                          <td className="p-4">

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setViewSubcategory(sub);
                                  setViewOpen(true);
                                }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              >
                                <Eye size={18} />
                              </button>

                              <button
                                onClick={() => onEdit(sub)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Pencil size={18} />
                              </button>

                              <button
                                onClick={() => onDelete(sub._id)}
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
      <SubcategoryViewModal
        open={viewOpen}
        setOpen={setViewOpen}
        subcategory={viewSubcategory}
      />
    </>
  );
}