import React from "react";
import Link from 'next/link';
import { ChevronRight, RotateCcw, HelpCircle, Calendar } from 'lucide-react';

const ReturnPolicyPage = () => {
  return (
    <div className="bg-white dark:bg-[#0f172a] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-[#0f172a] pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 skew-x-12 transform translate-x-32 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-gray-600 dark:text-gray-300">Return Policy</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] dark:text-white mb-6 leading-tight">
            Return <span className="text-blue-500">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our return policy allows refunds for eligible courses. Cancellations made within the specified period qualify for a full refund.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-2 max-w-4xl py-2 md:py-10">
        <div className="prose prose-blue dark:prose-invert max-w-none space-y-12 text-gray-600 dark:text-gray-400">

          <section>
            <div className="flex items-center gap-3 mb-6 -mt-18">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Calendar size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white m-0">LAST UPDATED</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
              April 14, 2026
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
              Late cancellations may incur fees or restrictions. Our return policy allows refunds for eligible courses. Cancellations made within the specified period qualify for a full refund.
            </p>
          </section>

          <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5 -mt-18">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <RotateCcw size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white m-0">REFUND</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-bold text-xl">
              All sales are final and no refund will be issued.
            </p>
          </section>

          <section className="bg-[#02A1E2] text-white p-10 rounded-[3rem] -mt-10">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle size={24} />
              <h2 className="text-2xl font-bold m-0 text-white">QUESTIONS</h2>
            </div>
            <p className="mb-6 opacity-90 text-lg">
              If you have any questions concerning our return policy, please get in touch with us at:
            </p>
            <a href="mailto:paarshelearning@gmail.com" className="inline-flex items-center gap-2 bg-white text-[#02A1E2] font-bold px-8 py-3 rounded-2xl hover:bg-blue-50 transition-colors">
              paarshelearning@gmail.com 
              <ChevronRight size={18} />
            </a>
          </section>

        </div>
      </main>
    </div>
  );
};

export default ReturnPolicyPage;
