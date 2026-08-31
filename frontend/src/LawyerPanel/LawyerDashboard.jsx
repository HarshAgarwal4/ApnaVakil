import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useStore } from "../zustand/store";

import LawyerSidebar from "./LawyerSidebar";
import LawyerHeader from "./LawyerHeader";
import LawyerOverviewTab from "./LawyerOverviewTab";
import LawyerProfileTab from "./LawyerProfileTab";
import LawyerRequestsTab from "./LawyerRequestsTab";
import LawyerChatTab from "./LawyerChatTab";
import LawyerPreviewTab from "./LawyerPreviewTab";
import LawyerSettingsTab from "./LawyerSettingsTab";

export default function LawyerDashboard() {
  const { user, theme } = useStore();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'profile' | 'requests' | 'preview' | 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          courts: Array.isArray(l.courts)
            ? l.courts.join(", ")
            : l.courts || "High Court, District Courts",
          languages: Array.isArray(l.languages)
            ? l.languages.join(", ")
            : l.languages || "English, Hindi",
          fee: l.fee || "₹1,500 / consultation",
          city: l.city || "New Delhi",
          address: l.address || "",
          desc: l.desc || "",
          categories: Array.isArray(l.categories)
            ? l.categories
            : ["Civil Litigation"],
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
        toast.success("Advocate credentials updated and published! ⚖️");
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
      });
      if (res.data?.status === 1) {
        toast.success(`Request marked as ${newStatus}`);
        setRequests((prev) =>
          prev.map((r) =>
            r._id === requestId ? { ...r, status: newStatus } : r
          )
        );
      } else {
        toast.error(res.data?.msg || "Failed to update status");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating request status");
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const activeCount = requests.filter((r) => r.status === "active" || r.status === "accepted").length;

  const TAB_TITLES = {
    overview: "Advocate Dashboard Overview",
    profile: "Complete Profile & Credentials",
    requests: "Incoming Client Inquiries",
    chat: "Client Consultations & Legal Chat",
    preview: "Live Public Profile Preview",
    settings: "Chamber & Availability Configuration",
  };

  return (
    <div
      className={`h-screen w-full flex overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-[#eaf2f8] text-blue-950"
      }`}
    >
      {/* Dedicated Lawyer Sidebar (Fixed on Desktop, Slide-out on Mobile) */}
      <LawyerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingCount={pendingCount}
        activeCount={activeCount}
        lawyerData={{ ...formData, images: imagePreview }}
      />

      {/* Main Workspace Area (Scrollable of Full Height) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <LawyerHeader
          setSidebarOpen={setSidebarOpen}
          lawyerData={{ ...formData, images: imagePreview }}
          activeTabTitle={TAB_TITLES[activeTab] || "Advocate Dashboard"}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
          {activeTab === "overview" && (
            <LawyerOverviewTab
              lawyerData={{ ...formData, images: imagePreview }}
              requests={requests}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && (
            <LawyerProfileTab
              formData={formData}
              setFormData={setFormData}
              imagePreview={imagePreview}
              setImageFile={setImageFile}
              setImagePreview={setImagePreview}
              handleSaveProfile={handleSaveProfile}
              isSaving={isSaving}
            />
          )}

          {activeTab === "requests" && (
            <LawyerRequestsTab
              requests={requests}
              handleUpdateRequestStatus={handleUpdateRequestStatus}
              initialFilter="pending"
            />
          )}

          {activeTab === "chat" && (
            <LawyerChatTab requests={requests} />
          )}

          {activeTab === "preview" && (
            <LawyerPreviewTab
              formData={formData}
              imagePreview={imagePreview}
            />
          )}

          {activeTab === "settings" && <LawyerSettingsTab />}
        </main>
      </div>
    </div>
  );
}
