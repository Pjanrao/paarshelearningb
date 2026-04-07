"use client";

import { useGetStudentTestsQuery } from "@/redux/api/practiceTestApi";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, BarChart, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentTestList() {
  const { data: tests, isLoading } = useGetStudentTestsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
          <BookOpen size={30} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Practice Tests Available</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Currently, there are no practice tests assigned to your enrolled courses.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map((test: any) => (
        <motion.div
          key={test._id}
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${test.level === 'Easy' ? 'bg-green-50 text-green-600 border-green-100' :
                  test.level === 'Intermediate' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-red-50 text-red-600 border-red-100'
                }`}>
                {test.level}
              </div>
              <div className="text-[#2C4276] bg-blue-50 p-2 rounded-lg group-hover:bg-[#2C4276] group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2C4276] transition-colors line-clamp-1">
              {test.name}
            </h3>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>{test.duration} Minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BarChart size={16} />
                <span>{test.totalQuestions} Questions</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-6">
              {test.courseIds?.map((c: any) => (
                <span key={c._id} className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded border border-gray-100 uppercase font-bold">
                  {c.name}
                </span>
              ))}
            </div>

            <Link href={`/student/tests/${test._id}`}>
              <Button className="w-full bg-[#2C4276] text-white py-2 rounded-lg hover:bg-blue-600">
                <span>Start Practice Test</span>
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
