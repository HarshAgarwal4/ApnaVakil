import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../zustand/store";
import axios from "../services/axios";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building,
  Award,
  BookOpen,
  DollarSign,
  MapPin,
  Globe,
  Upload,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Edit3,
  Check,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Briefcase
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

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
  "Intellectual Property (IPR)"
];

export default function LawyerPanel() {
  const { user, theme, logout } = useStore();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'requests' | 'preview'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    barNumber: "",
    experience: "5+ Years",
    speciality: "High Court & Civil Advocate",
    courts: "Delhi High Court, District Courts",
    languages: "English, Hindi",
    fee: "₹1,500 / consultation",
    city: "New Delhi",
    address: "",
    desc: "",
    categories: ["Civil Litigation", "Corporate & Business"],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("/profile.png");

  // Requests State
  const [requests, setRequests] = useState([]);
  const [requestFilter, setRequestFilter] = useState("all"); // 'all' | 'pending' | 'accepted' | 'completed'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchRequests();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/lawyer-me");
      if (res.data?.status === 1 && res.data?.lawyer) {
        const l = res.data.lawyer;
        setFormData({
          name: l.name || user?.name || "",
          email: l.email || user?.email || "",
          phone: l.phone || "",
          barNumber: l.barNumber || "",
          experience: l.experience || "5+ Years",
          speciality: l.speciality || "High Court & Civil Advocate",
          courts: Array.isArray(l.courts) ? l.courts.join(", ") : (l.courts || "High Court, District Courts"),
          languages: Array.isArray(l.languages) ? l.languages.join(", ") : (l.languages || "English, Hindi"),
          fee: l.fee || "₹1,500 / consultation",
          city: l.city || "New Delhi",
          address: l.address || "",
          desc: l.desc || "",
          categories: Array.isArray(l.categories) ? l.categories : ["Civil Litigation"],
        });
        if (l.images) setImagePreview(l.images);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/lawyer-requests");
      if (res.data?.status === 1) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);
      payload.append("barNumber", formData.barNumber);
      payload.append("experience", formData.experience);
      payload.append("speciality", formData.speciality);
      payload.append("courts", formData.courts);
      payload.append("languages", formData.languages);
      payload.append("fee", formData.fee);
      payload.append("city", formData.city);
      payload.append("address", formData.address);
      payload.append("desc", formData.desc);
      payload.append("categories", formData.categories.join(","));

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const res = await axios.post("/lawyer-update-profile", payload);
      if (res.data?.status === 1) {
        toast.success("Advocate Profile updated successfully! ⚖️");
        if (res.data.lawyer?.images) setImagePreview(res.data.lawyer.images);
      } else {
        toast.error(res.data?.msg || "Error saving profile");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update advocate profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      const res = await axios.post("/lawyer-request-status", {
        requestId,
        status: newStatus,
        responseMessage: replyMessage,
      });
      if (res.data?.status === 1) {
        toast.success(`Request marked as ${newStatus}`);
        setRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
        setSelectedRequest(null);
        setReplyMessage("");
      } else {
        toast.error(res.data?.msg || "Failed to update status");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating request status");
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (requestFilter === "all") return true;
    return r.status === requestFilter;
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-[#eaf2f8] text-blue-950"
    }`}>
      {/* Top Header */}
      <header className={`px-4 sm:px-8 py-3.5 border-b backdrop-blur-md sticky top-0 z-40 flex items-center justify-between transition-colors ${
        isDark ? "bg-slate-900/90 border-slate-800" : "bg-[#f0f6fc]/90 border-blue-200/90 shadow-sm"
      }`}>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ApnaVakil" className="w-8 h-8 rounded-xl object-contain" />
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5 text-blue-950 dark:text-white">
                <span>Advocate</span>
                <span className="bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Workspace
                </span>
              </h1>
              <p className="text-[10px] font-bold text-blue-900/60 dark:text-slate-400 hidden sm:block">
                Verified Legal Practitioner & Client Consultation Hub
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link
            to="/lawyers"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                : "bg-[#e2edf7] border-blue-300 text-blue-950 hover:bg-[#d5e7f5]"
            }`}
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Advocate Directory</span>
          </Link>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-3.5 py-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-95 cursor-pointer"
          >
            🤖 AI Legal Assistant
          </button>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Banner Card */}
        <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition-all shadow-md ${
          isDark
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-gradient-to-r from-[#dcebf6] via-[#e2edf7] to-[#eaf2f8] border-blue-200/90 text-blue-950"
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt={formData.name || "Advocate"}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-300 dark:border-slate-700 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                  <ShieldCheck size={14} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-blue-950 dark:text-white">
                    {formData.name || "Advocate Profile"}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    BCI Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-blue-900/70 dark:text-slate-300 mt-0.5">
                  {formData.speciality || "Legal Practitioner"} • {formData.barNumber ? `Bar ID: ${formData.barNumber}` : "Bar Council Enrollment Pending"}
                </p>
                <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-1">
                  📍 {formData.city || "New Delhi"} • ⚖️ {formData.experience} Practice
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-4 py-2.5 rounded-2xl border text-center ${
                isDark ? "bg-slate-800/80 border-slate-700" : "bg-[#f0f6fc] border-blue-300 shadow-xs"
              }`}>
                <span className="text-xs font-bold text-blue-900/60 dark:text-slate-400 block">Pending Inquiries</span>
                <span className="text-lg font-black text-blue-950 dark:text-white">
                  {requests.filter(r => r.status === "pending").length}
                </span>
              </div>

              <div className={`px-4 py-2.5 rounded-2xl border text-center ${
                isDark ? "bg-slate-800/80 border-slate-700" : "bg-[#f0f6fc] border-blue-300 shadow-xs"
              }`}>
                <span className="text-xs font-bold text-blue-900/60 dark:text-slate-400 block">Total Consultations</span>
                <span className="text-lg font-black text-blue-950 dark:text-white">
                  {requests.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className={`flex rounded-2xl p-1.5 border gap-1 shadow-xs ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-[#f0f6fc] border-blue-200/90"
        }`}>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white shadow-md"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-blue-950 hover:bg-[#e2edf7]"
            }`}
          >
            <Edit3 size={16} />
            <span>Complete Profile & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 relative cursor-pointer ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white shadow-md"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-blue-950 hover:bg-[#e2edf7]"
            }`}
          >
            <MessageSquare size={16} />
            <span>Client Consultation Requests</span>
            {requests.filter(r => r.status === "pending").length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                {requests.filter(r => r.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "preview"
                ? "bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white shadow-md"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-blue-950 hover:bg-[#e2edf7]"
            }`}
          >
            <Eye size={16} />
            <span>Live Public Preview</span>
          </button>
        </div>

        {/* TAB 1: COMPLETE ADVOCATE PROFILE */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6 transition-all ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#f0f6fc] border-blue-200/90 text-blue-950"
          }`}>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-blue-950 dark:text-white">
                Advocate Verification & Public Profile
              </h3>
              <p className="text-xs sm:text-sm text-blue-900/60 dark:text-slate-400 mt-0.5 font-medium">
                Keep your credentials, bar enrollment details, and practice categories up-to-date for direct client inquiries.
              </p>
            </div>

            {/* Profile Photo Upload */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-300 dark:border-slate-700 shadow-sm"
              />
              <div>
                <label className="block text-xs font-bold mb-1.5 text-blue-950 dark:text-slate-200">
                  Advocate Profile Photo
                </label>
                <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    : "bg-[#e2edf7] border-blue-300 text-blue-950 hover:bg-[#d5e7f5]"
                }`}>
                  <Upload size={14} />
                  <span>Upload High-Res Portrait</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Adv. Rajesh Verma"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
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
                  onChange={(e) => setFormData({ ...formData, barNumber: e.target.value })}
                  placeholder="e.g. D/2841/2016"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
                      : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
                  }`}
                />
              </div>

              {/* Phone / Contact */}
              <div>
                <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
                  Official Contact / Chamber Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
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
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  placeholder="e.g. High Court Senior Criminal Defense Counsel"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
                      : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
                  }`}
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
                  Years of Legal Practice
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 10+ Years"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
                      : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
                  }`}
                />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-xs font-bold mb-1 text-blue-950 dark:text-slate-300 uppercase tracking-wider">
                  Consultation Fee
                </label>
                <input
                  type="text"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  placeholder="e.g. ₹2,000 / consultation"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
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
                  onChange={(e) => setFormData({ ...formData, courts: e.target.value })}
                  placeholder="e.g. Supreme Court, Delhi High Court, Patiala House Courts"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
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
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  placeholder="e.g. English, Hindi, Punjabi"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
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
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. New Delhi"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
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
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Chamber 412, Lawyers Block, High Court Complex"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold outline-none transition ${
                    isDark
                      ? "bg-slate-950 border-slate-700 focus:border-indigo-500"
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
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? "bg-blue-700 text-white border-blue-700 shadow-sm"
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
                Professional Bio & Landmark Cases
              </label>
              <textarea
                rows={4}
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Provide a detailed summary of your courtroom experience, notable victories, advisory work, and practice ethos..."
                className={`w-full p-3.5 rounded-2xl border text-sm font-medium outline-none transition ${
                  isDark
                    ? "bg-slate-950 border-slate-700 focus:border-indigo-500 text-white"
                    : "bg-[#f4f9fd] border-blue-300 text-blue-950 focus:border-blue-700"
                }`}
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:opacity-95 text-white font-bold rounded-2xl shadow-md shadow-blue-900/20 text-xs sm:text-sm flex items-center gap-2 active:scale-98 transition disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving Credentials..." : "Save & Publish Advocate Profile"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CLIENT CONSULTATION REQUESTS */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {["all", "pending", "accepted", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setRequestFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                    requestFilter === f
                      ? "bg-blue-700 text-white shadow-sm"
                      : isDark
                      ? "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                      : "bg-[#f0f6fc] text-blue-950 border border-blue-200 hover:bg-[#e2edf7]"
                  }`}
                >
                  {f} Requests ({f === "all" ? requests.length : requests.filter(r => r.status === f).length})
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border ${
                isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-[#f0f6fc] border-blue-200/90 text-blue-900/70"
              }`}>
                <MessageSquare size={36} className="mx-auto mb-3 opacity-40" />
                <h4 className="text-base font-bold text-blue-950 dark:text-white">No Consultation Inquiries Found</h4>
                <p className="text-xs mt-1">
                  {requestFilter === "all"
                    ? "New client case inquiries sent from the ApnaVakil platform will appear here in real-time."
                    : `No inquiries currently marked as ${requestFilter}.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredRequests.map((req) => (
                  <div
                    key={req._id}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                      isDark
                        ? "bg-slate-900 border-slate-800 text-white"
                        : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-blue-950 dark:text-white">{req.clientName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                            req.status === "pending"
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                              : req.status === "accepted"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-blue-900/60 dark:text-slate-400 mt-0.5">
                          ✉️ {req.clientEmail} {req.clientPhone ? `• 📞 ${req.clientPhone}` : ""}
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-blue-900/50 dark:text-slate-400 flex items-center gap-1">
                        <Clock size={13} />
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>

                    <div className="mt-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900/60 dark:text-slate-400">
                        Matter / Query:
                      </span>
                      <p className={`mt-1 text-xs sm:text-sm p-3.5 rounded-2xl border font-medium leading-relaxed ${
                        isDark ? "bg-slate-950 border-slate-800" : "bg-[#f4f9fd] border-blue-200"
                      }`}>
                        {req.message}
                      </p>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-2">
                        {req.status !== "accepted" && (
                          <button
                            onClick={() => handleUpdateRequestStatus(req._id, "accepted")}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Check size={14} />
                            <span>Accept & Connect</span>
                          </button>
                        )}

                        {req.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateRequestStatus(req._id, "completed")}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <CheckCircle size={14} />
                            <span>Mark Completed</span>
                          </button>
                        )}
                      </div>

                      <a
                        href={`mailto:${req.clientEmail}?subject=Regarding Consultation via ApnaVakil`}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                          isDark
                            ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                            : "bg-[#e2edf7] border-blue-300 text-blue-950 hover:bg-[#d5e7f5]"
                        }`}
                      >
                        <Mail size={14} />
                        <span>Direct Email Reply</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE PUBLIC PREVIEW */}
        {activeTab === "preview" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-100 dark:bg-slate-900 border border-blue-300 dark:border-slate-800 text-xs font-semibold text-blue-950 dark:text-slate-300 flex items-center gap-2">
              <Sparkles size={16} className="text-blue-700 dark:text-indigo-400 shrink-0" />
              <span>This is how your advocate credentials and profile card appear to users across the platform directory.</span>
            </div>

            {/* Profile Card Preview */}
            <div className="max-w-md mx-auto">
              <div className={`rounded-3xl p-6 sm:p-7 border shadow-xl flex flex-col justify-between ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-100 shadow-black/40"
                  : "bg-[#f0f6fc] border-blue-200/90 text-blue-950 shadow-blue-900/5"
              }`}>
                <div>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative shrink-0">
                      <img
                        src={imagePreview}
                        alt={formData.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-200 dark:border-slate-700 shadow-sm"
                      />
                      <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black truncate text-blue-950 dark:text-white">
                        {formData.name || "Advocate Name"}
                      </h3>
                      <p className="text-xs font-semibold text-blue-900/60 dark:text-slate-400 mt-0.5 truncate">
                        {formData.speciality || "High Court & Civil Advocate"}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {formData.categories.slice(0, 3).map((cat, idx) => (
                          <span
                            key={idx}
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              isDark
                                ? "bg-slate-800 border-slate-700 text-indigo-300"
                                : "bg-[#e2edf7] border-blue-300 text-blue-950 font-bold"
                            }`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-blue-950/80 dark:text-slate-300 text-xs leading-relaxed mb-4 line-clamp-3 font-medium">
                    {formData.desc || "Experienced legal practitioner specializing in comprehensive legal advisory and litigation."}
                  </p>
                </div>

                <div className="pt-3 border-t border-blue-200/90 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-950 dark:text-white">
                    💵 {formData.fee}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-blue-300 dark:border-slate-700 text-blue-700 dark:text-indigo-400 hover:bg-[#e2edf7]"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white shadow-sm"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
