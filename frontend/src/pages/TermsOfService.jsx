import React from "react";

const TermsAndConditions = () => {
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
            Legal Agreement
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6">
            Terms & Conditions
          </h1>

          <p className="text-blue-800 text-lg max-w-3xl mx-auto">
            These Terms & Conditions govern your access to and use of the
            ApnaVakil platform and related legal services.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6 space-y-10">

          {/* Intro Dark Card */}
          <div className="bg-blue-900 text-white rounded-3xl p-10 shadow-[0_25px_60px_rgba(0,0,139,0.35)] hover:scale-[1.02] transition duration-300">
            <p className="text-lg leading-relaxed text-blue-100">
              By accessing or using <span className="font-semibold text-white">ApnaVakil</span>,
              you agree to comply with and be bound by these Terms & Conditions.
              If you do not agree with any part of these terms, please discontinue
              use of the platform.
            </p>
          </div>

          {/* Terms Sections */}
          {[
            {
              title: "1. Nature of Services",
              content:
                "ApnaVakil provides AI-powered legal information, draft assistance, and access to verified lawyers. The platform does not constitute formal legal advice."
            },
            {
              title: "2. User Responsibilities",
              content:
                "Users must provide accurate information, use the platform lawfully, and avoid misuse of AI-generated content or violation of intellectual property rights."
            },
            {
              title: "3. AI-Generated Content Disclaimer",
              content:
                "AI-generated outputs are provided for informational purposes only. ApnaVakil does not guarantee accuracy, completeness, or suitability for specific legal matters."
            },
            {
              title: "4. Intellectual Property",
              content:
                "All content, branding, software, and design elements are the intellectual property of ApnaVakil and may not be reproduced without written permission."
            },
            {
              title: "5. Limitation of Liability",
              content:
                "ApnaVakil shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform."
            },
            {
              title: "6. Account Suspension or Termination",
              content:
                "We reserve the right to suspend or terminate access to the platform if users violate these terms or engage in unlawful activities."
            },
            {
              title: "7. Governing Law",
              content:
                "These Terms shall be governed by and interpreted in accordance with the laws of India. Disputes shall fall under the jurisdiction of Indian courts."
            },
            {
              title: "8. Amendments to Terms",
              content:
                "ApnaVakil may update these Terms & Conditions periodically. Continued use of the platform indicates acceptance of revised terms."
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

export default TermsAndConditions;