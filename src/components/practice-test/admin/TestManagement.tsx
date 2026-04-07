"use client";

import { useState } from "react";
import { useGetPracticeTestsQuery } from "@/redux/api/practiceTestApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Pencil, 
  Trash2, 
  BookOpen, 
  Plus, 
  Upload, 
  Filter, 
  LayoutGrid, 
  MoreHorizontal 
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AddTestModal from "./AddTestModal";
import EditTestModal from "./EditTestModal";
import DeleteTestDialog from "./DeleteTestDialog";
import Link from "next/link";

export default function TestManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetPracticeTestsQuery({
    page,
    limit: 10,
    search,
    status,
  });

  const tests = data?.tests || [];
  const totalPages = data?.totalPages || 1;
  const totalRecords = data?.total || 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* MAIN PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2C4276] tracking-tight">Practice Tests</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Manage practice tests and questions for your courses
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[#2C4276] hover:bg-[#1e2e52] text-white flex items-center gap-2 px-6 h-11 rounded-xl shadow-md font-bold transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Test
          </Button>
        </div>
      </div>


      {/* REPOSITORY SECTION HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 gap-3 pt-4 border-t border-gray-100 mt-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2C4276] tracking-tight flex items-center gap-2">
            Practice Test Repository
          </h2>
          <p className="text-sm text-gray-500 font-medium">Manage and organize all your practice tests in one place</p>
        </div>
        <div className="bg-white/80 border border-gray-200 px-4 py-2 rounded-xl shadow-sm font-bold text-[#2C4276] text-sm">
          Total: {totalRecords} Tests
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center border border-gray-100/50">
        <div className="flex items-center gap-3 text-sm text-gray-500 font-bold px-2 pointer-events-none whitespace-nowrap">
          <span className="text-[#2C4276]">{tests.length}</span> of {totalRecords} tests
        </div>
        <div className="w-[1px] h-8 bg-gray-100 hidden md:block mx-1"></div>
        <div className="relative flex-1 w-full text-secondary-text">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search test repository..."
            className="pl-10 h-11 bg-gray-50 border-gray-100 rounded-xl focus:ring-[#2C4276] border-none text-gray-700 placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-48 h-11 bg-gray-50 border-none rounded-xl focus:ring-[#2C4276] text-secondary-text font-medium">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Tests</SelectItem>
              <SelectItem value="inactive">Inactive Tests</SelectItem>
            </SelectContent>
          </Select>
          <button className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors">
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Test Name</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Target Course</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Skill/Level</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Duration</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-center">Questions</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-6 bg-white h-20"></td>
                  </tr>
                ))
              ) : tests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                      <BookOpen size={30} />
                    </div>
                    <p className="text-lg font-bold text-gray-500">No tests available</p>
                    <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                tests.map((test: any) => (
                  <tr key={test._id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-[#2C4276] text-base group-hover:text-blue-600 transition-colors">{test.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">ID: {test._id.slice(-6)}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {test.courseIds?.map((c: any) => (
                          <span key={c._id} className="bg-indigo-50/50 text-indigo-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-indigo-100/50">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-gray-700">{test.skill}</div>
                      <div className={`text-[9px] font-extrabold uppercase rounded-lg px-2 py-0.5 w-fit mt-1 border tracking-widest ${
                        test.level === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                        test.level === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {test.level}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-600">
                        <span className="text-[#2C4276]">{test.duration}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Mins</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-block bg-gray-50 px-3 py-1 rounded-xl border border-gray-100 font-bold text-gray-700 text-sm group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                        {test.totalQuestions}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                        test.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/practice-tests/${test._id}`}>
                          <button className="p-3 text-[#2C4276] hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all border border-transparent hover:border-indigo-100" title="Questions">
                            <BookOpen size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setEditingTest(test);
                            setEditOpen(true);
                          }}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(test._id)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                          title="Delete"
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
        {totalPages > 1 && (
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-bold tracking-tight">
              PAGE <span className="text-[#2C4276]">{page}</span> OF <span className="text-[#2C4276]">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-10 rounded-xl border-gray-200 bg-white font-bold text-gray-600 hover:bg-gray-50 shadow-sm px-5 transition-all active:scale-95 disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="h-10 rounded-xl border-gray-200 bg-white font-bold text-gray-600 hover:bg-gray-50 shadow-sm px-5 transition-all active:scale-95 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AddTestModal open={addOpen} setOpen={setAddOpen} />
      <EditTestModal open={editOpen} setOpen={setEditOpen} test={editingTest} />
      <DeleteTestDialog deleteId={deleteId} setDeleteId={setDeleteId} />
    </div>
  );
}
