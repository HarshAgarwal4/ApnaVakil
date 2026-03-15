import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ================= GLOBAL BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-sky-100 to-blue-100"></div>
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]"></div>

      {/* Soft background blobs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/3 -right-40 h-96 w-96 bg-sky-300/30 rounded-full blur-3xl -z-10"></div>

      {/* ================= HERO ================= */}
      <section className="py-28 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <span className="inline-block mb-6 px-6 py-2 rounded-full bg-blue-200 text-blue-900 text-sm font-semibold shadow-sm">
            Privacy & Data Protection
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6">
            Privacy Policy
          </h1>

          <p className="text-blue-800 text-lg max-w-3xl mx-auto">
            This Privacy Policy explains how ApnaVakil collects, processes,
            and safeguards your personal information when you use our platform.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6 space-y-10">

          {/* Intro Dark Card */}
          <div className="bg-blue-900 text-white rounded-3xl p-10 shadow-[0_25px_60px_rgba(0,0,139,0.35)] hover:scale-[1.02] transition duration-300">
            <p className="text-lg leading-relaxed text-blue-100">
              At <span className="font-semibold text-white">ApnaVakil</span>,
              protecting your privacy is a core priority. This policy outlines
              how information is collected, used, disclosed, and protected
              while delivering AI-powered legal services and lawyer access.
            </p>
          </div>

          {/* Policy Sections */}
          {[
            {
              title: "1. Scope of This Policy",
              content:
                "This policy applies to all users accessing our website, AI tools, and legal support services."
            },
            {
              title: "2. Personal Data We Collect",
              content:
                "We may collect your name, contact details, account information, and data shared in legal queries. Technical data such as IP address and device information may also be collected."
            },
            {
              title: "3. Purpose of Data Collection",
              content:
                "Information is used to provide legal services, improve platform functionality, enhance AI performance, and maintain security."
            },
            {
              title: "4. Data Sharing & Disclosure",
              content:
                "We do not sell personal information. Data may only be shared with verified lawyers or service providers when required to deliver services."
            },
            {
              title: "5. Data Security",
              content:
                "We implement industry-standard technical and organizational safeguards to protect personal information against unauthorized access or misuse."
            },
            {
              title: "6. User Rights",
              content:
                "Users may request access, correction, or deletion of their personal information by contacting our support team."
            },
            {
              title: "7. Policy Updates",
              content:
                "We may update this Privacy Policy periodically. Continued use of the platform signifies acceptance of any revisions."
            }
          ].map((section, index) => (
            <div
              key={index}
              className="bg-blue-900 text-white rounded-2xl p-8 shadow-[0_25px_60px_rgba(0,0,139,0.35)] hover:scale-[1.02] transition duration-300"
            >
              <h2 className="text-xl font-bold text-blue-200 mb-3">
                {section.title}
              </h2>
              <p className="text-blue-100 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-3xl p-10 shadow-[0_30px_80px_rgba(0,0,139,0.45)]">
            <h2 className="text-2xl font-bold mb-4">
              Contact Information
            </h2>
            <p className="text-blue-100">📧 apnavakilsupport@gmail.com</p>
            <p className="text-blue-100 mt-2">📍 India</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;