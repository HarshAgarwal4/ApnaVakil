import React, { useState } from "react";
import { Upload, ShieldCheck, Check, Save } from "lucide-react";
import { useStore } from "../zustand/store";

const PRACTICE_AREAS = [
  "Criminal Law",
  "Civil Litigation",
  "Corporate & Business",
  "Property & Real Estate",
  "Family & Divorce",
  "Constitutional Writs",
  "Consumer Protection",
  "Cyber & IT Law",
  "Taxation & GST",
  "Banking & Debt Recovery",
  "Labour & Employment",
  "Intellectual Property (IPR)",
  "Arbitration & Mediation",
  "Cheque Bounce (Sec 138 NI Act)"
];

export default function LawyerProfileTab({
  formData,
  setFormData,
  imagePreview,
  setImageFile,
  setImagePreview,
  handleSaveProfile,
  isSaving
}) {
  const { theme } = useStore();
  const isDark = theme === "dark";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  return (
    <form
      onSubmit={handleSaveProfile}
      className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
      }`}
    >
      <div>
        <h3 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white">
          Advocate Credentials & Bar Verification
        </h3>
        <p className="text-xs sm:text-sm text-blue-900/60 dark:text-slate-400 mt-0.5 font-medium">
          Ensure all Bar Council registration details, practice jurisdictions, and chamber contacts are accurate.
        </p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Profile Preview"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-300 dark:border-slate-700 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
            <ShieldCheck size={14} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5 text-blue-950 dark:text-slate-200">
            Advocate Portrait Photo
          </label>
          <label
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                : "bg-[#e2edf7] border-blue-300 text-blue-950 hover:bg-[#d5e7f5]"
            }`}
          >
            <Upload size={14} />
            <span>Upload High-Resolution Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <span className="text-[11px] text-blue-900/50 dark:text-slate-400 block mt-1">
            JPG, PNG or WEBP (Max 5MB)
          </span>
        </div>
      </div>

      {/* Core Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Full Advocate Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g. Adv. Rajesh Verma"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Bar Council Enrollment Number */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Bar Council Enrollment ID *
          </label>
          <input
            type="text"
            required
            value={formData.barNumber}
            onChange={(e) =>
              setFormData({ ...formData, barNumber: e.target.value })
            }
            placeholder="e.g. D/2841/2016"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Phone / Contact */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Chamber / WhatsApp Phone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="e.g. +91 98765 43210"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Primary Specialization Title */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Specialization Title
          </label>
          <input
            type="text"
            value={formData.speciality}
            onChange={(e) =>
              setFormData({ ...formData, speciality: e.target.value })
            }
            placeholder="e.g. High Court Senior Criminal Defense Counsel"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Years of Court Practice
          </label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
            placeholder="e.g. 10+ Years"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Consultation Fee (Per Session)
          </label>
          <input
            type="text"
            value={formData.fee}
            onChange={(e) =>
              setFormData({ ...formData, fee: e.target.value })
            }
            placeholder="e.g. ₹2,000 / consultation"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Courts Practicing In */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Courts of Practice (comma separated)
          </label>
          <input
            type="text"
            value={formData.courts}
            onChange={(e) =>
              setFormData({ ...formData, courts: e.target.value })
            }
            placeholder="e.g. Supreme Court, Delhi High Court, Patiala House Courts"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Languages Spoken
          </label>
          <input
            type="text"
            value={formData.languages}
            onChange={(e) =>
              setFormData({ ...formData, languages: e.target.value })
            }
            placeholder="e.g. English, Hindi, Punjabi"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Jurisdiction / City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="e.g. New Delhi"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>

        {/* Office / Chamber Address */}
        <div>
          <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
            Chamber / Office Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="e.g. Chamber 412, Lawyers Block, High Court Complex"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
              isDark
                ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
            }`}
          />
        </div>
      </div>

      {/* Practice Areas / Categories Selection */}
      <div>
        <label className="block text-xs font-bold mb-2 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
          Practice Categories & Domains
        </label>
        <div className="flex flex-wrap gap-2">
          {PRACTICE_AREAS.map((cat) => {
            const selected = formData.categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                  selected
                    ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-blue-700 shadow-xs"
                    : isDark
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    : "bg-[#e2edf7] border-blue-300 text-blue-950 hover:bg-[#d5e7f5]"
                }`}
              >
                {selected ? <Check size={13} /> : null}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bio / Description */}
      <div>
        <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
          Professional Bio & Practice Summary
        </label>
        <textarea
          rows={4}
          value={formData.desc}
          onChange={(e) =>
            setFormData({ ...formData, desc: e.target.value })
          }
          placeholder="Detail your courtroom experience, specialized cases, litigation track record, and client advisory focus..."
          className={`w-full p-3.5 rounded-2xl border text-sm font-medium outline-none transition ${
            isDark
              ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
              : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
          }`}
        />
      </div>

      {/* Save Button */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-2xl shadow-md shadow-blue-900/20 text-xs sm:text-sm flex items-center gap-2 active:scale-98 transition disabled:opacity-50 cursor-pointer"
        >
          <Save size={16} />
          <span>{isSaving ? "Saving Credentials..." : "Save & Publish Advocate Profile"}</span>
        </button>
      </div>
    </form>
  );
}
