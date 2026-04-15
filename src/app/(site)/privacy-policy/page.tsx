import React from "react";
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Lock, Eye, Users, Bell } from 'lucide-react';

const PrivacyPolicyPage = () => {
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
            <span className="text-gray-600 dark:text-gray-300">Privacy Policy</span>
          </nav>

          <h1 className="text-2xl md:text-4xl font-black text-[#1e293b] dark:text-white mb-6 leading-tight">
            Privacy <span className="text-blue-500">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-4xl py-12 md:py-20">
        <div className="prose prose-blue dark:prose-invert max-w-none space-y-12 text-gray-600 dark:text-gray-400">

          <section>
            <div className="flex items-center gap-3 mb-6 -mt-24">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white m-0">Overview</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              At Paarsh e-learning, accessible from <a href="https://www.paarshelearning.com/" className="text-blue-500 hover:underline">https://www.paarshelearning.com/</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Paarsh e-learning and how we use it.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Paarsh e-learning.
            </p>
          </section>

          <section className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-3xl -mt-18">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Consent</h2>
            <p className="leading-relaxed">
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 -mt-10">
              <Lock className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white m-0">Information We Collect</h2>
            </div>
            <p className="leading-relaxed mb-6">
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3">Direct Contact</h3>
                <p className="text-sm">If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us.</p>
              </div>
              <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3">Account Registration</h3>
                <p className="text-sm">When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 -mt-24">
              <Eye className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white m-0">How We Use Your Information</h2>
            </div>
            <p className="leading-relaxed mb-6">We use the information we collect in various ways, including to:</p>
            <ul className="grid sm:grid-cols-2 gap-4 list-none p-0">
              {[
                "Provide, operate, and maintain our website",
                "Improve, personalize, and expand our website",
                "Understand and analyze how you use our website",
                "Develop new products, services, features, and functionality",
                "Communicate with you for customer service and updates",
                "Send you emails for marketing and promotional purposes",
                "Find and prevent fraud"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 -mt-24">Log Files & Cookies</h2>
            <div className="space-y-6">
              <p className="leading-relaxed">
                Paarsh e-learning follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include IP addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3">Cookies and Web Beacons</h3>
                <p className="text-sm">
                  Like any other website, Paarsh e-learning uses &quot;cookies&quot;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 -mt-24">
              <Users className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white m-0">Your Rights</h2>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">CCPA Privacy Rights</h3>
                <p className="text-sm mb-4">Under the CCPA, California consumers have the right to:</p>
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2 text-sm">
                  <p>• Request disclosure of collected personal data categories.</p>
                  <p>• Request deletion of any personal data collected.</p>
                  <p>• Request that a business does not sell the consumer&apos;s personal data.</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">GDPR Data Protection Rights</h3>
                <p className="text-sm mb-4">Every user is entitled to the following:</p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {[
                    "The right to access – Request copies of your personal data.",
                    "The right to rectification – Request correction of inaccurate info.",
                    "The right to erasure – Request deletion of personal data.",
                    "The right to restrict processing – Request restricted processing.",
                    "The right to object to processing – Object to our processing.",
                    "The right to data portability – Request data transfer to another org."
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 -mt-24">Children&apos;s Information</h2>
            <p className="leading-relaxed">
              Paarsh e-learning does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>
          </section>

          <section className="bg-slate-900 dark:bg-blue-600 p-10 rounded-[3rem] text-white -mt-18">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} />
              <h2 className="text-2xl font-bold m-0 text-white">Contact & Updates</h2>
            </div>
            <p className="mb-6 opacity-90">
              We may update our Privacy Policy from time to time. We advise you to review this page periodically for any changes. If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
            </p>
            <a href="mailto:info@paarshelearning.com" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3 rounded-2xl hover:bg-blue-50 transition-colors">
              Contact Us
              <ChevronRight size={18} />
            </a>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
