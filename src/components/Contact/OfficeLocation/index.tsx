"use client";
import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Location() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Nashik Office Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 shrink-0">
              <MapPin className="text-blue-600" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Nashik Office
            </h3>
          </div>

          <hr className="mb-5 border-gray-200" />

          <div className="flex flex-col xl:grid xl:grid-cols-[1fr_auto_1fr] gap-6 items-start">
            <div className="text-gray-600 leading-relaxed text-md text-justify">
              {settings?.contactDetails?.nashikAddress || "Office no 1, Bhakti Apartment, Near Rasoi Hotel, Suchita Nagar, Mumbai Naka, Nashik 422001"}
            </div>

            <div className="hidden xl:block w-px bg-blue-400 h-full mx-auto" />
            <hr className="xl:hidden border-blue-200 w-full" />

            <div className="space-y-4 w-full">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="text-blue-600" size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 text-md break-all">
                    {settings?.contactDetails?.email || "info@paarshelearning.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call</p>
                  <p className="text-gray-600 text-md">
                    {settings?.contactDetails?.phone || "+91 90752 01035"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pune Office Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 shrink-0">
              <MapPin className="text-blue-600" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Pune Office
            </h3>
          </div>

          <hr className="mb-5 border-gray-200" />

          <div className="flex flex-col xl:grid xl:grid-cols-[1fr_auto_1fr] gap-6 items-start">
            <div className="text-gray-600 leading-relaxed text-md text-justify">
              {settings?.contactDetails?.puneAddress || "Second Floor, Wisteriaa Fortune, C-206-207, Bhumkar Das Gugre Rd, near Bhumkar Chowk, Wakad, Pune, Maharashtra 411057"}
            </div>

            <div className="hidden xl:block w-px bg-blue-400 h-full mx-auto" />
            <hr className="xl:hidden border-blue-200 w-full" />

            <div className="space-y-4 w-full">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="text-blue-600" size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600 text-md break-all">
                    {settings?.contactDetails?.email || "info@paarshelearning.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Phone className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call</p>
                  <p className="text-gray-600 text-md">
                    {settings?.contactDetails?.phone || "+91 90752 01033"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
