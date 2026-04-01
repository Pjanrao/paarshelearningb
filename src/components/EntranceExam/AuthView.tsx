"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users2, Trophy, Sparkles } from "lucide-react";

interface AuthViewProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
  testName: string;
}

export const AuthView: React.FC<AuthViewProps> = ({ onShowLogin, onShowRegister, testName }) => (
  <section className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800">
    <div className="relative mx-auto flex w-full max-w-6xl overflow-hidden rounded bg-white shadow-xl dark:bg-gray-800">
      {/* Left Side - Auth Form */}
      <div className="w-full p-8 md:w-1/2 md:p-10">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to {testName || "Entrance Exam"}
          </h2>
          <p className="text-sm font-medium text-[#01A0E2] dark:text-[#01A0E2]">
            Assessment Portal by Paarsh Infotech
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to showcase your skills? Login or register to begin your assessment.
          </p>

          <div className="space-y-4 pt-4">
            <Button
              onClick={onShowLogin}
              className="group relative w-full space-x-2 rounded bg-[#2C4276] text-white py-6 text-lg transition-all hover:bg-[#1e2e54] hover:shadow-lg dark:bg-[#2C4276] dark:hover:bg-[#1e2e54]"
            >
              <span>Log In</span>
              <ArrowRight className="inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              onClick={onShowRegister}
              variant="outline"
              className="group relative w-full space-x-2 rounded border-[#2C4276] py-6 text-lg text-[#2C4276] transition-all hover:bg-[#2C4276]/5 hover:shadow-lg dark:border-[#01A0E2] dark:text-[#01A0E2] dark:hover:bg-[#01A0E2]/10"
            >
              <span>Register</span>
              <ArrowRight className="inline-block h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Company Info */}
      <div className="hidden bg-gradient-to-br from-[#2C4276] to-[#01A0E2] p-10 text-white md:block md:w-1/2">
        <div className="relative h-full">
          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative space-y-8">
            <h3 className="flex items-center text-2xl font-bold">
              <Sparkles className="mr-3 h-6 w-6" />
              About This Assessment
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Building2 className="h-6 w-6 shrink-0" />
                <div>
                  <h4 className="mb-2 font-semibold">Professional Assessment</h4>
                  <p className="text-white/80">Industry-standard aptitude test designed to evaluate your capabilities.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users2 className="h-6 w-6 shrink-0" />
                <div>
                  <h4 className="mb-2 font-semibold">Fair Evaluation</h4>
                  <p className="text-white/80">Standardized testing environment ensuring equal opportunity for all candidates.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Trophy className="h-6 w-6 shrink-0" />
                <div>
                  <h4 className="mb-2 font-semibold">Instant Results</h4>
                  <p className="text-white/80">Get your detailed performance analysis right after test completion.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded bg-white/10 p-6">
              <p className="italic text-white/90">
                Take your time, stay focused, and show us your best performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);