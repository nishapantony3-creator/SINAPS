"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface AnnouncementConfig {
  text: string;
  gradePill: string;
  cbsePill: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

interface HeroConfig {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleHighlight: string;
  desc: string;
  pills: string[];
  heroImage: string;
  tourVideoUrl: string;
}

interface PopupConfig {
  enabled: boolean;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
}

interface StatsConfig {
  students: string;
  teachers: string;
  ratio: string;
  passRate: string;
}

interface TeacherItem {
  name: string;
  qualification: string;
  role?: string;
}

interface FeeOverviewCard {
  title: string;
  amount: string;
  period: string;
  desc: string;
  features: string[];
}

interface FeeClassItem {
  standard: string;
  amount: string;
}

interface FeesConfig {
  overview: {
    tuition: FeeOverviewCard;
    book: FeeOverviewCard;
    bus: FeeOverviewCard;
    activity: FeeOverviewCard;
    note?: string;
  };
  classList: FeeClassItem[];
}

interface StudentsConfig {
  totalCount: string;
  desc: string;
  prePrimaryLabel: string;
  prePrimarySub: string;
  primaryLabel: string;
  primarySub: string;
}

interface ContactConfig {
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
}

interface SiteContent {
  announcement: AnnouncementConfig;
  hero: HeroConfig;
  marquee: string[];
  popupAlert: PopupConfig;
  stats: StatsConfig;
  teachers: TeacherItem[];
  students: StudentsConfig;
  fees: FeesConfig;
  contact: ContactConfig;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Tabs: 'fees' | 'photos' | 'home' | 'teachers' | 'students' | 'popup' | 'contact'
  const [activeTab, setActiveTab] = useState<string>("fees");
  
  // Device Mode
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Live Preview Page Switcher: 'home' | 'fees' | 'school-fees' | 'teachers' | 'students'
  const [previewPage, setPreviewPage] = useState<"home" | "fees" | "school-fees" | "teachers" | "students">("fees");

  const [highlightedSection, setHighlightedSection] = useState<string | null>("live-fees");
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const previewScrollRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const json = await res.json();
      if (json.success && json.data) {
        setContent(json.data);
      } else {
        showToast("Error loading content");
      }
    } catch (err) {
      console.error("Failed to load content:", err);
      showToast("Error loading content from server");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // Dynamic Tailwind Loader Safeguard
    if (typeof window !== "undefined") {
      const existingScript = document.getElementById("sinaps-tailwind-cdn");
      if (!existingScript) {
        const s = document.createElement("script");
        s.id = "sinaps-tailwind-cdn";
        s.src = "/tailwind.min.js";
        s.onerror = () => {
          const fallback = document.createElement("script");
          fallback.src = "https://cdn.tailwindcss.com";
          document.head.appendChild(fallback);
        };
        document.head.appendChild(s);
      }
    }

    const savedPin = typeof window !== "undefined" ? localStorage.getItem("sinaps_admin_pin") : null;
    if (savedPin === "sinaps2026") {
      setIsAuthenticated(true);
    }
    fetchContent();
  }, [fetchContent]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "sinaps2026") {
      localStorage.setItem("sinaps_admin_pin", pinInput);
      setIsAuthenticated(true);
      setPinError("");
      fetchContent();
    } else {
      setPinError("Invalid Admin PIN. Please check and try again.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sinaps_admin_pin");
    }
    setIsAuthenticated(false);
    setPinInput("");
  };

  const locateSection = (sectionId: string, pageName?: "home" | "fees" | "school-fees" | "teachers" | "students") => {
    if (pageName) {
      setPreviewPage(pageName);
    }
    setHighlightedSection(sectionId);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el && previewScrollRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  // --- Handlers for Content Modifications ---
  const handleSaveDraft = async () => {
    if (!content) return;
    showToast("💾 Saving changes...");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: "sinaps2026", data: content }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("✅ Changes saved successfully!");
      } else {
        showToast("❌ " + (json.error || "Save failed"));
      }
    } catch {
      showToast("❌ Failed to save changes");
    }
  };

  const handlePublishLive = async () => {
    setIsPublishing(true);
    showToast("🚀 Publishing live to sinaps.in...");
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: "sinaps2026", data: content }),
      });

      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin: "sinaps2026",
          commitMessage: `Website Content Update via Admin Portal (${new Date().toLocaleTimeString()})`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("🎉 Published live! Vercel is updating the website.");
      } else {
        showToast("⚠️ " + (json.message || "Changes saved locally"));
      }
    } catch {
      showToast("❌ Publish error occurred");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !content) return;

    setIsUploading(true);
    showToast("⏳ Compressing and uploading photo...");
    try {
      const fd = new FormData();
      fd.append("pin", "sinaps2026");
      fd.append("file", file);

      const res = await fetch("/api/admin/photos", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        const updatedMarquee = [json.url, ...content.marquee];
        const updated = { ...content, marquee: updatedMarquee };
        setContent(updated);
        showToast("🎉 Photo uploaded & added to marquee!");
        locateSection("live-marquee", "home");
      } else {
        showToast("❌ " + (json.error || "Upload failed"));
      }
    } catch {
      showToast("❌ Upload error occurred");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // --- TEACHER EDITING HELPERS ---
  const handleTeacherChange = (index: number, field: keyof TeacherItem, val: string) => {
    if (!content) return;
    const updated = [...content.teachers];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, teachers: updated });
  };

  const handleAddTeacher = () => {
    if (!content) return;
    const newTeacher: TeacherItem = {
      name: "New Teacher Name",
      qualification: "B.Ed. / M.Sc.",
      role: "Subject Teacher",
    };
    setContent({ ...content, teachers: [...content.teachers, newTeacher] });
    showToast("➕ New teacher added! You can now edit their details.");
    locateSection("live-teachers", "teachers");
  };

  const handleDeleteTeacher = (index: number) => {
    if (!content) return;
    if (confirm(`Are you sure you want to remove ${content.teachers[index]?.name}?`)) {
      const updated = content.teachers.filter((_, i) => i !== index);
      setContent({ ...content, teachers: updated });
      showToast("Teacher removed");
    }
  };

  const handleMoveTeacher = (index: number, direction: "up" | "down") => {
    if (!content) return;
    const teachers = [...content.teachers];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= teachers.length) return;
    const temp = teachers[index];
    teachers[index] = teachers[targetIdx];
    teachers[targetIdx] = temp;
    setContent({ ...content, teachers });
  };

  // --- CLASS FEES HELPERS ---
  const handleClassFeeChange = (index: number, field: keyof FeeClassItem, val: string) => {
    if (!content) return;
    const updated = [...content.fees.classList];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, fees: { ...content.fees, classList: updated } });
  };

  const handleAddClassFee = () => {
    if (!content) return;
    const updated = [...content.fees.classList, { standard: "New Class", amount: "20,000" }];
    setContent({ ...content, fees: { ...content.fees, classList: updated } });
    showToast("➕ Added new class slab");
  };

  const handleDeleteClassFee = (index: number) => {
    if (!content) return;
    const updated = content.fees.classList.filter((_, i) => i !== index);
    setContent({ ...content, fees: { ...content.fees, classList: updated } });
  };

  // --- OVERVIEW FEES HELPERS ---
  const handleOverviewFeeChange = (
    key: "tuition" | "book" | "bus" | "activity",
    field: "amount" | "period" | "desc",
    val: string
  ) => {
    if (!content) return;
    const overview = { ...content.fees.overview };
    overview[key] = { ...overview[key], [field]: val };
    setContent({ ...content, fees: { ...content.fees, overview } });
  };

  // ==========================================
  // 1. PIN AUTHENTICATION SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1E3A5F] to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center shadow-lg">
            <Image
              src="/emblem.png"
              alt="School Emblem"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight font-heading">
            SINAPS Admin Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6 font-medium">
            St. Ignatius Nursery & Primary School, Budapadi
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Enter Master Security PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest font-mono text-slate-800 bg-slate-50"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-500 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              Unlock Dashboard 🔓
            </button>
          </form>

          <p className="text-[11px] text-slate-400 mt-6">
            Default Security PIN: <code className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">sinaps2026</code>
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. LOADING STATE
  // ==========================================
  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-300">Loading SINAPS Website Data...</p>
      </div>
    );
  }

  // ==========================================
  // 3. MASTER DUAL-PANE CMS DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col h-screen overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 flex-shrink-0 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md overflow-hidden">
            <Image src="/emblem.png" alt="Logo" width={28} height={28} className="object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                SINAPS Visual CMS
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              St. Ignatius Nursery & Primary School • Budapadi, Erode
            </p>
          </div>
        </div>

        {/* Central Controls: Preview Page Selector & Device Switcher */}
        <div className="flex items-center gap-3">
          {/* Website Page Switcher for Live Inspector */}
          <div className="hidden lg:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-bold px-2 uppercase">Preview Page:</span>
            <button
              onClick={() => { setPreviewPage("home"); locateSection("live-hero", "home"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "home" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => { setPreviewPage("fees"); locateSection("live-fees-cards", "fees"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "fees" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              💰 Fees Overview
            </button>
            <button
              onClick={() => { setPreviewPage("school-fees"); locateSection("live-school-table", "school-fees"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "school-fees" ? "bg-amber-400 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              📊 Class Tuition
            </button>
            <button
              onClick={() => { setPreviewPage("teachers"); locateSection("live-teachers", "teachers"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "teachers" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              👩‍🏫 Teachers
            </button>
            <button
              onClick={() => { setPreviewPage("students"); locateSection("live-students", "students"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "students" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              🎓 Students
            </button>
          </div>

          {/* Device Mockup Toggle */}
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                deviceMode === "desktop" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Desktop Screen"
            >
              💻 Desktop
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                deviceMode === "tablet" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Tablet Screen"
            >
              📱 Tablet
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                deviceMode === "mobile" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Mobile Screen"
            >
              📲 Mobile
            </button>
          </div>

          {/* Action Buttons: Save & Publish */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              💾 Save Draft
            </button>
            <button
              onClick={handlePublishLive}
              disabled={isPublishing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-extrabold rounded-lg shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? "⏳ Publishing..." : "🚀 Publish Live"}
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              title="Sign Out"
            >
              <i className="ti ti-logout text-base"></i>
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS (Directly Mimicking Website Sections) */}
      <div className="bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-slate-800 overflow-x-auto flex-shrink-0 text-xs">
        <button
          onClick={() => { setActiveTab("fees"); setPreviewPage("fees"); locateSection("live-fees-cards", "fees"); }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "fees" ? "bg-amber-400 text-slate-950 shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          💰 Fees Structure (/fees & /fees/school)
        </button>

        <button
          onClick={() => { setActiveTab("teachers"); setPreviewPage("teachers"); locateSection("live-teachers", "teachers"); }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "teachers" ? "bg-purple-600 text-white shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          👩‍🏫 Staff & Teachers (/teachers)
        </button>

        <button
          onClick={() => { setActiveTab("photos"); setPreviewPage("home"); locateSection("live-marquee", "home"); }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "photos" ? "bg-blue-600 text-white shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          📸 Photos & Marquee
        </button>

        <button
          onClick={() => { setActiveTab("home"); setPreviewPage("home"); locateSection("live-hero", "home"); }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "home" ? "bg-blue-600 text-white shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          🏠 Home & Top Bar
        </button>

        <button
          onClick={() => { setActiveTab("students"); setPreviewPage("students"); locateSection("live-students", "students"); }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "students" ? "bg-emerald-600 text-white shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          🎓 Students & Stats (/students)
        </button>

        <button
          onClick={() => { setActiveTab("popup"); setPreviewPage("home"); locateSection("live-popup", "home"); }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "popup" ? "bg-rose-600 text-white shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          🚨 Urgent Pop-up Alert
        </button>

        <button
          onClick={() => { setActiveTab("contact"); setPreviewPage("home"); locateSection("live-contact", "home"); }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "contact" ? "bg-slate-700 text-white shadow" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          📍 Campus Info & Contact
        </button>
      </div>

      {/* DUAL PANE WORKSPACE: LEFT = EDITOR CONTROLS, RIGHT = LIVE WEBSITE MIMIC INSPECTOR */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: EDITING FORM (45% Width) */}
        <div className="w-full lg:w-[48%] xl:w-[45%] bg-slate-900 border-r border-slate-800 overflow-y-auto custom-scrollbar p-4 lg:p-6 text-slate-100">
          
          {/* ==================================================== */}
          {/* TAB 1: FEES & BUS STRUCTURE (ACCURATE & FULLY EDITABLE) */}
          {/* ==================================================== */}
          {activeTab === "fees" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <span>💰</span> School Fees & Slabs Manager
                  </h3>
                  <button
                    onClick={() => locateSection("live-fees-cards", "fees")}
                    className="text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-md flex items-center gap-1"
                  >
                    📍 Locate on Site
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Changes made here instantly update both the <strong>/fees</strong> overview cards and the detailed <strong>/fees/school</strong> class-wise tuition table!
                </p>
              </div>

              {/* PART A: DETAILED CLASS-BY-CLASS TUITION (Matches /fees/school) */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                      📊 Class-wise Tuition Fees Table
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      As seen on: <code className="text-amber-400">sinaps.in/fees/school</code>
                    </p>
                  </div>
                  <button
                    onClick={handleAddClassFee}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-md flex items-center gap-1"
                  >
                    ➕ Add Class
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    <span className="col-span-5">Class / Standard</span>
                    <span className="col-span-5">Fees (Rs.)</span>
                    <span className="col-span-2 text-right">Action</span>
                  </div>

                  {content.fees?.classList?.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-900/60 p-2 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
                    >
                      <input
                        type="text"
                        value={item.standard}
                        onChange={(e) => handleClassFeeChange(idx, "standard", e.target.value)}
                        placeholder="e.g. LKG"
                        className="col-span-5 bg-slate-800 text-white px-2.5 py-1.5 rounded-lg border border-slate-600 text-xs font-semibold focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) => handleClassFeeChange(idx, "amount", e.target.value)}
                        placeholder="e.g. 19,800"
                        className="col-span-5 bg-slate-800 text-amber-300 font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 text-xs focus:outline-none focus:border-amber-400 text-right"
                      />
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => handleDeleteClassFee(idx)}
                          className="text-slate-400 hover:text-rose-400 p-1.5 rounded-md hover:bg-slate-800 transition-all"
                          title="Remove Class"
                        >
                          <i className="ti ti-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART B: 4 OVERVIEW FEE CARDS (Matches /fees) */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-4">
                <h4 className="font-extrabold text-sm text-blue-300 flex items-center gap-1.5 border-b border-slate-700 pb-2">
                  🎓 4 Overview Fee Cards (As seen on /fees)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Card 1: School Tuition */}
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-blue-900/50 space-y-2">
                    <span className="text-xs font-bold text-blue-400">1. School Tuition Fees</span>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Amount</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.tuition?.amount || ""}
                        onChange={(e) => handleOverviewFeeChange("tuition", "amount", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Period</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.tuition?.period || ""}
                        onChange={(e) => handleOverviewFeeChange("tuition", "period", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Card 2: Book Fees */}
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-amber-900/50 space-y-2">
                    <span className="text-xs font-bold text-amber-400">2. Book & Stationery</span>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Amount</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.book?.amount || ""}
                        onChange={(e) => handleOverviewFeeChange("book", "amount", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Period</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.book?.period || ""}
                        onChange={(e) => handleOverviewFeeChange("book", "period", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Card 3: Bus Transport */}
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-emerald-900/50 space-y-2">
                    <span className="text-xs font-bold text-emerald-400">3. Bus Transport</span>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Amount</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.bus?.amount || ""}
                        onChange={(e) => handleOverviewFeeChange("bus", "amount", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Period</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.bus?.period || ""}
                        onChange={(e) => handleOverviewFeeChange("bus", "period", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Card 4: Extracurricular Activities */}
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-pink-900/50 space-y-2">
                    <span className="text-xs font-bold text-pink-400">4. Activities Fees</span>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Amount</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.activity?.amount || ""}
                        onChange={(e) => handleOverviewFeeChange("activity", "amount", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold">Period</label>
                      <input
                        type="text"
                        value={content.fees?.overview?.activity?.period || ""}
                        onChange={(e) => handleOverviewFeeChange("activity", "period", e.target.value)}
                        className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Disclaimer Note on Fees Page:
                  </label>
                  <textarea
                    rows={2}
                    value={content.fees?.overview?.note || ""}
                    onChange={(e) => {
                      const updatedOverview = { ...content.fees.overview, note: e.target.value };
                      setContent({ ...content, fees: { ...content.fees, overview: updatedOverview } });
                    }}
                    className="w-full bg-slate-900 text-slate-200 text-xs p-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: TEACHERS & STAFF DIRECTORY (FULL INLINE EDITING) */}
          {/* ==================================================== */}
          {activeTab === "teachers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <span>👩‍🏫</span> Staff & Teachers Directory
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any field to edit name, qualification, or role directly. Reorder with ↑ / ↓ buttons!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddTeacher}
                    className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow cursor-pointer"
                  >
                    ➕ Add Teacher
                  </button>
                  <button
                    onClick={() => locateSection("live-teachers", "teachers")}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2.5 py-1.5 rounded-lg"
                  >
                    📍 Locate
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {content.teachers?.map((t: TeacherItem, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-slate-700/60 pb-2">
                      <span className="font-extrabold text-purple-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        Teacher #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveTeacher(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-30"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveTeacher(idx, "down")}
                          disabled={idx === content.teachers.length - 1}
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-30"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(idx)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded ml-1"
                          title="Delete Teacher"
                        >
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Teacher Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => handleTeacherChange(idx, "name", e.target.value)}
                          placeholder="e.g. Mrs. Anitha R."
                          className="w-full bg-slate-900 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Qualification</label>
                        <input
                          type="text"
                          value={t.qualification}
                          onChange={(e) => handleTeacherChange(idx, "qualification", e.target.value)}
                          placeholder="e.g. M.A., B.Ed."
                          className="w-full bg-slate-900 text-blue-300 font-semibold text-xs px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block font-semibold mb-0.5">Role / Subject</label>
                        <input
                          type="text"
                          value={t.role || ""}
                          onChange={(e) => handleTeacherChange(idx, "role", e.target.value)}
                          placeholder="e.g. Primary Head"
                          className="w-full bg-slate-900 text-amber-300 font-semibold text-xs px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: PHOTOS & MARQUEE MANAGER */}
          {/* ==================================================== */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <span>📸</span> School Photo & Marquee Manager
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pick Hero Card photo or upload / reorder photos for the scrolling strip.
                  </p>
                </div>
                <button
                  onClick={() => locateSection("live-marquee", "home")}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-md"
                >
                  📍 Locate on Site
                </button>
              </div>

              {/* Upload Box */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-dashed border-slate-700 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center text-xl">
                  📁
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Upload New Campus / Activity Photo</h4>
                  <p className="text-[11px] text-slate-400">Large raw camera photos are automatically optimized.</p>
                </div>
                <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow">
                  <span>{isUploading ? "Uploading..." : "Browse Photo File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPhoto}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Current Photos Grid */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">
                  Marquee Photos ({content.marquee.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {content.marquee.map((src, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative group"
                    >
                      <div className="h-28 bg-slate-950 relative">
                        <img
                          src={src}
                          alt={`Marquee ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        {content.hero.heroImage === src && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                            ⭐ HERO
                          </span>
                        )}
                      </div>
                      <div className="p-2 flex items-center justify-between text-[11px] bg-slate-850">
                        <button
                          onClick={() => {
                            setContent({ ...content, hero: { ...content.hero, heroImage: src } });
                            showToast("Set as Hero Card Photo!");
                            locateSection("live-hero", "home");
                          }}
                          className="text-blue-400 hover:text-blue-300 font-bold"
                        >
                          Make Hero
                        </button>
                        <button
                          onClick={() => {
                            const updated = content.marquee.filter((_, i) => i !== idx);
                            setContent({ ...content, marquee: updated });
                            showToast("Photo removed from strip");
                          }}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: HOME & TOP BAR */}
          {/* ==================================================== */}
          {activeTab === "home" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>🏠</span> Home & Top Announcement Bar
                </h3>
                <button
                  onClick={() => locateSection("live-topbar", "home")}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-md"
                >
                  📍 Locate on Site
                </button>
              </div>

              {/* Announcement Bar */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-blue-400">
                  Top Sticky Banner
                </h4>
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Banner Announcement Text</label>
                  <input
                    type="text"
                    value={content.announcement.text}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, text: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block font-semibold mb-1">Grade Pill</label>
                    <input
                      type="text"
                      value={content.announcement.gradePill}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, gradePill: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block font-semibold mb-1">CBSE Pill</label>
                    <input
                      type="text"
                      value={content.announcement.cbsePill}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, cbsePill: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-400">
                  Hero Section
                </h4>
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Badge</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })
                    }
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold mb-1">Line 1</label>
                    <input
                      type="text"
                      value={content.hero.titleLine1}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, titleLine1: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-white text-xs px-2 py-1.5 rounded-lg border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold mb-1">Line 2</label>
                    <input
                      type="text"
                      value={content.hero.titleLine2}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, titleLine2: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-white text-xs px-2 py-1.5 rounded-lg border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold mb-1">Highlight</label>
                    <input
                      type="text"
                      value={content.hero.titleHighlight}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-amber-400 font-bold text-xs px-2 py-1.5 rounded-lg border border-slate-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Hero Description</label>
                  <textarea
                    rows={2}
                    value={content.hero.desc}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, desc: e.target.value } })
                    }
                    className="w-full bg-slate-900 text-white text-xs p-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">YouTube Tour Video Link</label>
                  <input
                    type="text"
                    value={content.hero.tourVideoUrl}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, tourVideoUrl: e.target.value } })
                    }
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: STUDENTS & STATS */}
          {/* ==================================================== */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>🎓</span> Students & School Statistics
                </h3>
                <button
                  onClick={() => locateSection("live-students", "students")}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-md"
                >
                  📍 Locate on Site
                </button>
              </div>

              {/* Students Page Content */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-400">
                  /students Page Content
                </h4>
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Headline</label>
                  <input
                    type="text"
                    value={content.students?.totalCount || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        students: { ...content.students, totalCount: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={content.students?.desc || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        students: { ...content.students, desc: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white text-xs p-2 rounded-xl border border-slate-700"
                  />
                </div>
              </div>

              {/* Key Numerical Stats on Homepage */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-blue-400">
                  Homepage Counter Statistics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold">Total Students</label>
                    <input
                      type="text"
                      value={content.stats.students}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, students: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-yellow-400 font-black text-sm px-2 py-1.5 rounded-lg border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold">Teachers Count</label>
                    <input
                      type="text"
                      value={content.stats.teachers}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, teachers: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-yellow-400 font-black text-sm px-2 py-1.5 rounded-lg border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold">Student-Teacher Ratio</label>
                    <input
                      type="text"
                      value={content.stats.ratio}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, ratio: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-yellow-400 font-black text-sm px-2 py-1.5 rounded-lg border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-semibold">Academic Pass Rate</label>
                    <input
                      type="text"
                      value={content.stats.passRate}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, passRate: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-yellow-400 font-black text-sm px-2 py-1.5 rounded-lg border border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: POPUP ALERT */}
          {/* ==================================================== */}
          {activeTab === "popup" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>🚨</span> Admissions / Urgent Pop-up Alert
                </h3>
                <button
                  onClick={() => locateSection("live-popup", "home")}
                  className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-2.5 py-1 rounded-md"
                >
                  📍 Locate on Site
                </button>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Enable Pop-up Modal on Website:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.popupAlert.enabled}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          popupAlert: { ...content.popupAlert, enabled: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Pop-up Title</label>
                  <input
                    type="text"
                    value={content.popupAlert.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        popupAlert: { ...content.popupAlert, title: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Pop-up Message</label>
                  <textarea
                    rows={3}
                    value={content.popupAlert.message}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        popupAlert: { ...content.popupAlert, message: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white text-xs p-2 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={content.popupAlert.ctaText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        popupAlert: { ...content.popupAlert, ctaText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: CAMPUS INFO & CONTACT */}
          {/* ==================================================== */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <span>📍</span> Campus Address & Contact Info
                </h3>
                <button
                  onClick={() => locateSection("live-contact", "home")}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white font-bold px-2.5 py-1 rounded-md"
                >
                  📍 Locate on Site
                </button>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">School Name</label>
                  <input
                    type="text"
                    value={content.contact.schoolName}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, schoolName: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block font-semibold mb-1">Address</label>
                  <textarea
                    rows={2}
                    value={content.contact.address}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, address: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 text-white text-xs p-2 rounded-xl border border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block font-semibold mb-1">Phone</label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, phone: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block font-semibold mb-1">Email</label>
                    <input
                      type="text"
                      value={content.contact.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, email: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-xl border border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: LIVE WEBSITE INSPECTOR (MIMICS REAL SITE EXACTLY) */}
        <div className="hidden lg:flex flex-1 bg-slate-950 flex-col overflow-hidden p-4 items-center justify-center">
          
          <div
            className={`w-full h-full bg-[#FFFDF7] rounded-2xl overflow-y-auto custom-scrollbar shadow-2xl transition-all duration-300 ${
              deviceMode === "mobile"
                ? "preview-phone max-w-[390px] h-[92vh]"
                : deviceMode === "tablet"
                ? "preview-tablet max-w-[768px] h-[92vh]"
                : "max-w-full h-full"
            }`}
            ref={previewScrollRef}
          >
            
            {/* LIVE INSPECTOR: PAGE 1 - HOME PAGE */}
            {previewPage === "home" && (
              <div>
                {/* Top Announcement Bar */}
                <div
                  id="live-topbar"
                  className={`top-bar ${highlightedSection === "live-topbar" ? "site-highlight" : ""}`}
                >
                  <div className="top-bar-inner">
                    <span>{content.announcement.text}</span>
                    <span className="sep">•</span>
                    <span>{content.announcement.gradePill}</span>
                    <span className="sep">•</span>
                    <span>{content.announcement.cbsePill}</span>
                    <span className="sep">•</span>
                    <span>📞 {content.announcement.phone}</span>
                  </div>
                </div>

                {/* Navbar */}
                <nav className="navbar">
                  <div className="navbar-inner">
                    <div className="navbar-brand">
                      <img src="/emblem.png" alt="Logo" className="navbar-logo" />
                      <div className="navbar-brand-text">
                        <span className="navbar-school-name">{content.contact.schoolName}</span>
                        <span className="navbar-school-sub">Budapadi, Erode • CBSE Integrated</span>
                      </div>
                    </div>
                  </div>
                </nav>

                {/* Hero Section */}
                <section
                  id="live-hero"
                  className={`hero ${highlightedSection === "live-hero" ? "site-highlight" : ""}`}
                >
                  <div className="hero-inner">
                    <div className="hero-content">
                      <div className="hero-badge">
                        <span className="emoji">⭐</span> {content.hero.badge}
                      </div>
                      <h1 className="hero-title">
                        {content.hero.titleLine1} <br />
                        {content.hero.titleLine2}
                        <span className="highlight">{content.hero.titleHighlight}</span>
                      </h1>
                      <p className="hero-desc">{content.hero.desc}</p>
                      <div className="hero-buttons">
                        <span className="btn-primary">Enroll Now →</span>
                        <span className="btn-secondary">▶ Watch Tour</span>
                      </div>
                    </div>
                    <div className="hero-visual">
                      <div className="hero-card">
                        <img
                          src={content.hero.heroImage}
                          alt="Hero Student"
                          className="hero-card-img"
                        />
                        <div className="hero-card-footer">
                          <img src="/emblem.png" alt="Emblem" className="hero-card-logo" />
                          <div className="hero-card-info">
                            <div className="hero-card-name">{content.contact.schoolName}</div>
                            <div className="hero-card-loc">Budapadi, Anthiyur Taluk</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Marquee Section */}
                <section
                  id="live-marquee"
                  className={`photo-strip ${highlightedSection === "live-marquee" ? "site-highlight" : ""}`}
                >
                  <div className="photo-strip-inner">
                    {content.marquee.slice(0, 10).map((src, i) => (
                      <img key={i} src={src} alt="School Marquee" className="photo-strip-img" />
                    ))}
                  </div>
                </section>

                {/* Counter Stats */}
                <section
                  id="live-stats"
                  className={`stats-section ${highlightedSection === "live-stats" ? "site-highlight" : ""}`}
                >
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-number">{content.stats.students}</div>
                      <div className="stat-label">Happy Students</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{content.stats.teachers}</div>
                      <div className="stat-label">Caring Teachers</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{content.stats.ratio}</div>
                      <div className="stat-label">Student:Teacher Ratio</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{content.stats.passRate}</div>
                      <div className="stat-label">Academic Success</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* LIVE INSPECTOR: PAGE 2 - FEES OVERVIEW (/fees) */}
            {previewPage === "fees" && (
              <div className="fees-page" style={{ paddingTop: "20px", minHeight: "100%" }}>
                <div className="fees-hero">
                  <h1 className="fees-title">Transparent & Premium Education</h1>
                  <p className="fees-subtitle">Fee Structure for Academic Year 2026-2027</p>
                </div>

                <div
                  id="live-fees-cards"
                  className={`fees-content ${highlightedSection === "live-fees-cards" ? "site-highlight" : ""}`}
                >
                  <div className="fees-grid">
                    {/* Tuition Card */}
                    <div className="fee-card card-blue">
                      <div className="fee-icon">🎓</div>
                      <h3>{content.fees?.overview?.tuition?.title}</h3>
                      <p className="fee-desc">{content.fees?.overview?.tuition?.desc}</p>
                      <div className="fee-price">
                        <span className="amount">{content.fees?.overview?.tuition?.amount}</span>
                        <span className="period">{content.fees?.overview?.tuition?.period}</span>
                      </div>
                      <ul className="fee-features">
                        {content.fees?.overview?.tuition?.features?.map((f, i) => (
                          <li key={i}><i className="ti ti-check"></i> {f}</li>
                        ))}
                      </ul>
                      <div
                        onClick={() => setPreviewPage("school-fees")}
                        className="mt-3 text-center text-xs font-bold text-blue-600 cursor-pointer hover:underline"
                      >
                        Click to view Class-wise breakdown (LKG to 5th) →
                      </div>
                    </div>

                    {/* Book Card */}
                    <div className="fee-card card-orange">
                      <div className="fee-icon">📚</div>
                      <h3>{content.fees?.overview?.book?.title}</h3>
                      <p className="fee-desc">{content.fees?.overview?.book?.desc}</p>
                      <div className="fee-price">
                        <span className="amount">{content.fees?.overview?.book?.amount}</span>
                        <span className="period">{content.fees?.overview?.book?.period}</span>
                      </div>
                      <ul className="fee-features">
                        {content.fees?.overview?.book?.features?.map((f, i) => (
                          <li key={i}><i className="ti ti-check"></i> {f}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Bus Card */}
                    <div className="fee-card card-green">
                      <div className="fee-icon">🚌</div>
                      <h3>{content.fees?.overview?.bus?.title}</h3>
                      <p className="fee-desc">{content.fees?.overview?.bus?.desc}</p>
                      <div className="fee-price">
                        <span className="amount">{content.fees?.overview?.bus?.amount}</span>
                        <span className="period">{content.fees?.overview?.bus?.period}</span>
                      </div>
                      <ul className="fee-features">
                        {content.fees?.overview?.bus?.features?.map((f, i) => (
                          <li key={i}><i className="ti ti-check"></i> {f}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Activity Card */}
                    <div className="fee-card card-pink">
                      <div className="fee-icon">🎨</div>
                      <h3>{content.fees?.overview?.activity?.title}</h3>
                      <p className="fee-desc">{content.fees?.overview?.activity?.desc}</p>
                      <div className="fee-price">
                        <span className="amount">{content.fees?.overview?.activity?.amount}</span>
                        <span className="period">{content.fees?.overview?.activity?.period}</span>
                      </div>
                      <ul className="fee-features">
                        {content.fees?.overview?.activity?.features?.map((f, i) => (
                          <li key={i}><i className="ti ti-check"></i> {f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="fees-note mt-6">
                    <p>{content.fees?.overview?.note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE INSPECTOR: PAGE 3 - CLASS-WISE TUITION (/fees/school) */}
            {previewPage === "school-fees" && (
              <div className="fees-page" style={{ paddingTop: "40px", minHeight: "100%" }}>
                <div className="section-container">
                  <h1 style={{ color: "#1E3A5F", textAlign: "center", marginBottom: "20px", fontSize: "28px" }}>
                    School Tuition Fees (2026-27)
                  </h1>

                  <div
                    id="live-school-table"
                    className={`max-w-[550px] mx-auto bg-white rounded-2xl p-6 shadow-xl border border-slate-100 ${
                      highlightedSection === "live-school-table" ? "site-highlight" : ""
                    }`}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: 800, fontSize: "14px" }}>
                            Class
                          </th>
                          <th style={{ padding: "12px", textAlign: "right", fontWeight: 800, fontSize: "14px" }}>
                            2026-27 Fees (Rs.)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.fees?.classList?.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "12px", fontWeight: 600, fontSize: "14px" }}>
                              {item.standard}
                            </td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: 700, color: "#1E3A5F", fontSize: "14px" }}>
                              {item.amount.startsWith("₹") ? item.amount : `₹${item.amount}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE INSPECTOR: PAGE 4 - TEACHERS (/teachers) */}
            {previewPage === "teachers" && (
              <div className="fees-page" style={{ paddingTop: "40px", minHeight: "100%" }}>
                <div className="section-container">
                  <h1 style={{ color: "#1E3A5F", textAlign: "center", marginBottom: "16px", fontSize: "28px" }}>
                    Our Teachers
                  </h1>
                  <p style={{ textAlign: "center", marginBottom: "28px", color: "#64748B", fontSize: "15px" }}>
                    Meet our dedicated team of educators shaping young minds.
                  </p>

                  <div
                    id="live-teachers"
                    className={`grid grid-cols-2 gap-4 max-w-[700px] mx-auto ${
                      highlightedSection === "live-teachers" ? "site-highlight" : ""
                    }`}
                  >
                    {content.teachers?.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-sm"
                      >
                        <h4 className="font-extrabold text-slate-800 text-sm mb-1">{t.name}</h4>
                        <p className="text-blue-600 font-bold text-xs mb-1.5">{t.qualification}</p>
                        {t.role && (
                          <span className="inline-block bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                            {t.role}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LIVE INSPECTOR: PAGE 5 - STUDENTS (/students) */}
            {previewPage === "students" && (
              <div className="fees-page" style={{ paddingTop: "40px", minHeight: "100%" }}>
                <div className="section-container">
                  <h1 style={{ color: "#1E3A5F", textAlign: "center", marginBottom: "16px", fontSize: "28px" }}>
                    Student Details
                  </h1>

                  <div
                    id="live-students"
                    className={`max-w-[550px] mx-auto bg-white rounded-2xl p-6 shadow-xl border border-slate-100 text-center ${
                      highlightedSection === "live-students" ? "site-highlight" : ""
                    }`}
                  >
                    <h2 className="text-2xl font-black text-blue-700 mb-2">{content.students?.totalCount}</h2>
                    <p className="text-slate-600 text-sm mb-6">{content.students?.desc}</p>
                    <div className="flex justify-around gap-4">
                      <div className="p-4 bg-orange-50 rounded-xl flex-1 border border-orange-100">
                        <h3 className="text-xl font-black text-orange-600 mb-1">{content.students?.prePrimaryLabel}</h3>
                        <p className="text-xs text-slate-600">{content.students?.prePrimarySub}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl flex-1 border border-emerald-100">
                        <h3 className="text-xl font-black text-emerald-600 mb-1">{content.students?.primaryLabel}</h3>
                        <p className="text-xs text-slate-600">{content.students?.primarySub}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
