import React from "react";
import { Icon } from "@iconify/react";

export default function CareerPage() {
    return (
        <div className="bg-gray-50 dark:bg-darkmode pt-40 pb-32 min-h-screen">
            <div className="container mx-auto max-w-4xl px-4 text-center">
                <div className="mb-12">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-600">
                        <Icon icon="solar:suitcase-tag-bold" className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#2C4276] dark:text-white mb-6">
                        Build Your <span className="text-blue-600">Future</span> With Us
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                        We're currently building something amazing for aspiring professionals. 
                        Our career portal is coming soon with exciting job opportunities.
                    </p>
                </div>

                <div className="bg-white dark:bg-dark_border p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        Coming Soon
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Want to be notified?</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Drop your email below and be the first to know when we open new positions!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            className="flex-1 h-14 px-6 bg-gray-50 dark:bg-darkmode border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        />
                        <button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95">
                            Notify Me
                        </button>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Great Culture", icon: "solar:users-group-rounded-bold" },
                        { title: "Growth", icon: "solar:chart-square-bold" },
                        { title: "Flexibility", icon: "solar:clock-circle-bold" }
                    ].map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-dark_border rounded-xl flex items-center justify-center mb-3 text-gray-400">
                                <Icon icon={feature.icon} className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-400 dark:text-gray-500">{feature.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
