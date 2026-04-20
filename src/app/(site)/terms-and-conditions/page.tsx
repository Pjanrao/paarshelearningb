import React from "react";
import Link from 'next/link';
import { ChevronRight, ShieldCheck, FileText } from 'lucide-react';

const TermsPage = () => {
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
            <span className="text-gray-600 dark:text-gray-300">Terms & Conditions</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black text-[#1e293b] dark:text-white mb-6 leading-tight">
            Terms <span className="text-blue-500">&</span> Conditions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using our website.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-2 max-w-4xl py-2 md:py-10">
        <div className="prose prose-blue dark:prose-invert max-w-none space-y-12">

          <section>
            <div className="flex items-center gap-3 mb-6 -mt-18">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <FileText size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Introduction</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Welcome to Paarsh E-Learning! These terms and conditions outline the rules and regulations for the use of Paarsh E-Learning&apos;s Website, located at <a href="https://www.paarshelearning.com/" className="text-blue-500 hover:underline">https://www.paarshelearning.com/</a>. By accessing this website we assume you accept these terms and conditions. Do not continue to use Paarsh E-Learning if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The following terminology applies to these Terms and Conditions, Privacy Statement, Disclaimer Notice, and all Agreements.
            </p>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              "Client", "You", and "Your" refer to you — the person who accesses this website and agrees to follow the Company's terms and conditions.
            </p>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              "The Company", "We", "Our", and "Us" refer to our organization.
            </p>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              "Party", "Parties", or "Us"refer to both you (the Client) and the Company together.
            </p>
          </section>

          <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5 -mt-18">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Cookies</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We employ the use of cookies. By accessing Paarsh E-Learning, you agreed to use cookies in agreement with the Paarsh E-Learning&apos;s Privacy Policy. Most interactive websites use cookies to let us retrieve the user&apos;s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 -mt-18">License</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Unless otherwise stated, Paarsh E-Learning and/or its licensors own the intellectual property rights for all material on Paarsh E-Learning. All intellectual property rights are reserved. You may access this from Paarsh E-Learning for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-blue-500/10 shadow-sm mb-6">
              <p className="font-bold text-slate-800 dark:text-white mb-4">You must not:</p>
              <ul className="space-y-3">
                {[
                  "Republish material from Paarsh E-Learning",
                  "Sell, rent or sub-license material from Paarsh E-Learning",
                  "Reproduce, duplicate or copy material from Paarsh E-Learning",
                  "Redistribute content from Paarsh E-Learning"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
              This Agreement shall begin on the date hereof.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 -mt-23">Comments Policy</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Paarsh E-Learning does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Paarsh E-Learning, its agents and/or affiliates.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Paarsh E-Learning reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
              </p>
              <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl">
                <p className="font-bold text-slate-800 dark:text-white mb-4">You warrant and represent that:</p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li>(A) You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
                  <li>(B) The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
                  <li>(C) The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;</li>
                  <li>(D) The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 -mt-22">Content Liability</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5 -mt-22">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 -mt-22">Reservation of Rights</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it&apos;s linking policy at any time.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-white/5 -mt-22">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 -mt-22">Removal of Links</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
              </p>
            </div>
          </section>

          <section className="border-t border-slate-100 dark:border-white/5 pt-12 -mt-22">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white m-0">Disclaimer</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will limit or exclude our or your liability for death or personal injury; limit or exclude our or your liability for fraud or fraudulent misrepresentation.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default TermsPage;
