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

interface FeeClassItem {
  standard: string;
  amount: string;
}

interface BusStopItem {
  stopName: string;
  amount: string;
}

interface ActivityItem {
  activityName: string;
  amount: string;
}

interface AdditionalFeeItem {
  title: string;
  amount: string;
  period: string;
  desc: string;
  features: string[];
}

interface FeesConfig {
  classList: FeeClassItem[];
  busStops: BusStopItem[];
  activityList: ActivityItem[];
  additional: {
    book: AdditionalFeeItem;
    bus: AdditionalFeeItem;
    activity: AdditionalFeeItem;
    note?: string;
  };
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
  
  // Tabs: 'fees' | 'teachers' | 'photos' | 'home' | 'students' | 'popup' | 'contact'
  const [activeTab, setActiveTab] = useState<string>("fees");
  
  // Device Mode
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Live Preview Page Switcher: 'fees' | 'school-fees' | 'bus-fees' | 'activity-fees' | 'home' | 'teachers' | 'students'
  const [previewPage, setPreviewPage] = useState<"fees" | "school-fees" | "bus-fees" | "activity-fees" | "home" | "teachers" | "students">("school-fees");

  const [highlightedSection, setHighlightedSection] = useState<string | null>("live-school-table");
  
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

  const locateSection = (sectionId: string, pageName?: "fees" | "school-fees" | "bus-fees" | "activity-fees" | "home" | "teachers" | "students") => {
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

  // --- BUS STOPS HELPERS (NEW!) ---
  const handleBusStopChange = (index: number, field: keyof BusStopItem, val: string) => {
    if (!content) return;
    const current = content.fees.busStops || [];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, fees: { ...content.fees, busStops: updated } });
  };

  const handleAddBusStop = () => {
    if (!content) return;
    const current = content.fees.busStops || [];
    const updated = [...current, { stopName: "New Bus Stop / Route", amount: "2,000" }];
    setContent({ ...content, fees: { ...content.fees, busStops: updated } });
    showToast("➕ Added new bus stop!");
    locateSection("live-bus-table", "bus-fees");
  };

  const handleDeleteBusStop = (index: number) => {
    if (!content) return;
    const current = content.fees.busStops || [];
    const updated = current.filter((_, i) => i !== index);
    setContent({ ...content, fees: { ...content.fees, busStops: updated } });
    showToast("Bus stop removed");
  };

  // --- EXTRACURRICULAR ACTIVITIES HELPERS (NEW!) ---
  const handleActivityChange = (index: number, field: keyof ActivityItem, val: string) => {
    if (!content) return;
    const current = content.fees.activityList || [];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: val };
    setContent({ ...content, fees: { ...content.fees, activityList: updated } });
  };

  const handleAddActivity = () => {
    if (!content) return;
    const current = content.fees.activityList || [];
    const updated = [...current, { activityName: "New Activity Program", amount: "1,500" }];
    setContent({ ...content, fees: { ...content.fees, activityList: updated } });
    showToast("➕ Added new activity program!");
    locateSection("live-activity-table", "activity-fees");
  };

  const handleDeleteActivity = (index: number) => {
    if (!content) return;
    const current = content.fees.activityList || [];
    const updated = current.filter((_, i) => i !== index);
    setContent({ ...content, fees: { ...content.fees, activityList: updated } });
    showToast("Activity program removed");
  };

  // Lowest and highest tuition calculations for the live preview
  const classList = content?.fees?.classList || [];
  const lowestFee = classList.length > 0 ? classList[0].amount : "19,800";
  const highestFee = classList.length > 0 ? classList[classList.length - 1].amount : "23,100";

  // ==========================================
  // 1. PIN AUTHENTICATION SCREEN (School Theme)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-200 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center shadow-md">
            <Image
              src="/emblem.png"
              alt="School Emblem"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-2xl font-black text-[#1E3A5F] tracking-tight font-heading">
            SINAPS Admin Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6 font-medium">
            St. Ignatius Nursery & Primary School, Budapadi
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Enter Master Security PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest font-mono text-slate-800 bg-slate-50"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#1E3A5F] to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 cursor-pointer"
            >
              Unlock Dashboard 🔓
            </button>
          </form>

          <p className="text-[11px] text-slate-400 mt-6">
            Default Security PIN: <code className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">sinaps2026</code>
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
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center text-[#1E3A5F]">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-600">Loading SINAPS Website Data...</p>
      </div>
    );
  }

  // ==========================================
  // 3. MASTER DUAL-PANE CMS DASHBOARD (Light School Theme)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col h-screen overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#1E3A5F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-400/30 flex items-center gap-3 animate-bounce">
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR (School Navy Theme) */}
      <header className="bg-[#1E3A5F] px-5 py-3 flex items-center justify-between border-b border-blue-900 flex-shrink-0 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden p-1">
            <Image src="/emblem.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-tight text-white font-heading">
                SINAPS VISUAL CMS
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Synced
              </span>
            </div>
            <p className="text-[11px] text-blue-200 hidden sm:block">
              St. Ignatius Nursery & Primary School • Budapadi, Erode
            </p>
          </div>
        </div>

        {/* Central Controls: Preview Page Selector & Device Switcher */}
        <div className="flex items-center gap-3">
          {/* Website Page Switcher for Live Inspector */}
          <div className="hidden lg:flex items-center bg-[#132842] p-1 rounded-xl border border-blue-800 text-xs">
            <span className="text-[10px] text-blue-200 font-bold px-2 uppercase">Inspector View:</span>
            <button
              onClick={() => { setPreviewPage("school-fees"); locateSection("live-school-table", "school-fees"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "school-fees" ? "bg-amber-400 text-slate-950 shadow" : "text-blue-200 hover:text-white"
              }`}
            >
              📊 Class Tuition
            </button>
            <button
              onClick={() => { setPreviewPage("bus-fees"); locateSection("live-bus-table", "bus-fees"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "bus-fees" ? "bg-emerald-400 text-slate-950 shadow" : "text-blue-200 hover:text-white"
              }`}
            >
              🚌 Bus Fees Table
            </button>
            <button
              onClick={() => { setPreviewPage("activity-fees"); locateSection("live-activity-table", "activity-fees"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "activity-fees" ? "bg-pink-400 text-slate-950 shadow" : "text-blue-200 hover:text-white"
              }`}
            >
              🎨 Activities Table
            </button>
            <button
              onClick={() => { setPreviewPage("fees"); locateSection("live-fees-cards", "fees"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "fees" ? "bg-blue-400 text-slate-950 shadow" : "text-blue-200 hover:text-white"
              }`}
            >
              💰 Fees Overview
            </button>
            <button
              onClick={() => { setPreviewPage("teachers"); locateSection("live-teachers", "teachers"); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                previewPage === "teachers" ? "bg-purple-500 text-white shadow" : "text-blue-200 hover:text-white"
              }`}
            >
              👩‍🏫 Teachers
            </button>
          </div>

          {/* Device Mockup Toggle */}
          <div className="flex bg-[#132842] p-0.5 rounded-lg border border-blue-800 text-xs">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                deviceMode === "desktop" ? "bg-white text-[#1E3A5F] shadow" : "text-blue-200 hover:text-white"
              }`}
              title="Desktop Screen"
            >
              💻 Desktop
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                deviceMode === "tablet" ? "bg-white text-[#1E3A5F] shadow" : "text-blue-200 hover:text-white"
              }`}
              title="Tablet Screen"
            >
              📱 Tablet
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                deviceMode === "mobile" ? "bg-white text-[#1E3A5F] shadow" : "text-blue-200 hover:text-white"
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
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              💾 Save Draft
            </button>
            <button
              onClick={handlePublishLive}
              disabled={isPublishing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-slate-950 text-xs font-black rounded-lg shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? "⏳ Publishing..." : "🚀 Publish Live"}
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 text-blue-200 hover:text-rose-300 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              title="Sign Out"
            >
              <i className="ti ti-logout text-base"></i>
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS (Light School Theme) */}
      <div className="bg-white px-4 py-2.5 flex items-center gap-2 border-b border-slate-200 overflow-x-auto flex-shrink-0 text-xs shadow-xs">
        <button
          onClick={() => { setActiveTab("fees"); setPreviewPage("school-fees"); locateSection("live-school-table", "school-fees"); }}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "fees" ? "bg-[#1E3A5F] text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          💰 Fees Manager (Tuition, Bus & Activities)
        </button>

        <button
          onClick={() => { setActiveTab("teachers"); setPreviewPage("teachers"); locateSection("live-teachers", "teachers"); }}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "teachers" ? "bg-purple-700 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          👩‍🏫 Staff & Teachers (/teachers)
        </button>

        <button
          onClick={() => { setActiveTab("photos"); setPreviewPage("home"); locateSection("live-marquee", "home"); }}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "photos" ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          📸 Photos & Marquee
        </button>

        <button
          onClick={() => { setActiveTab("home"); setPreviewPage("home"); locateSection("live-hero", "home"); }}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "home" ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🏠 Home & Top Bar
        </button>

        <button
          onClick={() => { setActiveTab("students"); setPreviewPage("students"); locateSection("live-students", "students"); }}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "students" ? "bg-emerald-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🎓 Students & Stats (/students)
        </button>

        <button
          onClick={() => { setActiveTab("popup"); setPreviewPage("home"); locateSection("live-popup", "home"); }}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "popup" ? "bg-rose-600 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          🚨 Urgent Pop-up Alert
        </button>

        <button
          onClick={() => { setActiveTab("contact"); setPreviewPage("home"); locateSection("live-contact", "home"); }}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
            activeTab === "contact" ? "bg-slate-700 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          📍 Campus Info & Contact
        </button>
      </div>

      {/* DUAL PANE WORKSPACE: LEFT = EDITOR CONTROLS, RIGHT = LIVE WEBSITE MIMIC INSPECTOR */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: EDITING FORM (Light Theme, Crisp White Cards) */}
        <div className="w-full lg:w-[48%] xl:w-[45%] bg-slate-50 border-r border-slate-200 overflow-y-auto custom-scrollbar p-4 lg:p-6 text-slate-800">
          
          {/* ==================================================== */}
          {/* TAB 1: FEES & BUS STRUCTURE (FULL ADD BUTTONS FOR BUS & ACTIVITIES) */}
          {/* ==================================================== */}
          {activeTab === "fees" && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                    <span>💰</span> School Fees Manager
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage Class Tuition, Bus Stops & Routes, and Extracurricular Activity fees.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => locateSection("live-school-table", "school-fees")}
                    className="text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                  >
                    Tuition
                  </button>
                  <button
                    onClick={() => locateSection("live-bus-table", "bus-fees")}
                    className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                  >
                    Bus
                  </button>
                  <button
                    onClick={() => locateSection("live-activity-table", "activity-fees")}
                    className="text-xs bg-pink-500 hover:bg-pink-600 text-white font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                  >
                    Activities
                  </button>
                </div>
              </div>

              {/* 1. CLASS-BY-CLASS TUITION (Matches /fees/school) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#1E3A5F] flex items-center gap-1.5">
                      📊 Class-wise Tuition Fees Table
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Live on: <code className="text-blue-600 font-bold">sinaps.in/fees/school</code>
                    </p>
                  </div>
                  <button
                    onClick={handleAddClassFee}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    ➕ Add Class
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
                    <span className="col-span-5">Class / Standard</span>
                    <span className="col-span-5">2026-27 Fees (Rs.)</span>
                    <span className="col-span-2 text-right">Delete</span>
                  </div>

                  {content.fees?.classList?.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200 hover:border-blue-400 transition-all"
                    >
                      <input
                        type="text"
                        value={item.standard}
                        onChange={(e) => handleClassFeeChange(idx, "standard", e.target.value)}
                        placeholder="e.g. LKG"
                        className="col-span-5 bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) => handleClassFeeChange(idx, "amount", e.target.value)}
                        placeholder="e.g. 19,800"
                        className="col-span-5 bg-white text-[#1E3A5F] font-black px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      />
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => handleDeleteClassFee(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                          title="Remove Class"
                        >
                          <i className="ti ti-trash text-base"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. BUS STOPS & TRANSPORT FEES (Matches /fees/bus - WITH ADD BUTTON!) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-800 flex items-center gap-1.5">
                      🚌 School Bus Transport Fees by Stop / Route
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Live on: <code className="text-emerald-600 font-bold">sinaps.in/fees/bus</code>
                    </p>
                  </div>
                  <button
                    onClick={handleAddBusStop}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    ➕ Add Bus Stop
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
                    <span className="col-span-6">Bus Stop / Route Name</span>
                    <span className="col-span-4">Term Fees (Rs.)</span>
                    <span className="col-span-2 text-right">Delete</span>
                  </div>

                  {content.fees?.busStops?.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-emerald-50/40 p-2 rounded-xl border border-emerald-200/80 hover:border-emerald-400 transition-all"
                    >
                      <input
                        type="text"
                        value={item.stopName}
                        onChange={(e) => handleBusStopChange(idx, "stopName", e.target.value)}
                        placeholder="e.g. Anthiyur Bus Stand"
                        className="col-span-6 bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) => handleBusStopChange(idx, "amount", e.target.value)}
                        placeholder="e.g. 2,500"
                        className="col-span-4 bg-white text-emerald-700 font-black px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                      />
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => handleDeleteBusStop(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                          title="Remove Bus Stop"
                        >
                          <i className="ti ti-trash text-base"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. EXTRACURRICULAR ACTIVITIES FEES (Matches /fees/activity - WITH ADD BUTTON!) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-pink-800 flex items-center gap-1.5">
                      🎨 Extracurricular Activity Programs & Fees
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Live on: <code className="text-pink-600 font-bold">sinaps.in/fees/activity</code>
                    </p>
                  </div>
                  <button
                    onClick={handleAddActivity}
                    className="text-xs bg-pink-600 hover:bg-pink-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    ➕ Add Activity
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
                    <span className="col-span-6">Activity Program Name</span>
                    <span className="col-span-4">Annual Fees (Rs.)</span>
                    <span className="col-span-2 text-right">Delete</span>
                  </div>

                  {content.fees?.activityList?.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-pink-50/40 p-2 rounded-xl border border-pink-200/80 hover:border-pink-400 transition-all"
                    >
                      <input
                        type="text"
                        value={item.activityName}
                        onChange={(e) => handleActivityChange(idx, "activityName", e.target.value)}
                        placeholder="e.g. Karate & Martial Arts"
                        className="col-span-6 bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) => handleActivityChange(idx, "amount", e.target.value)}
                        placeholder="e.g. 1,500"
                        className="col-span-4 bg-white text-pink-700 font-black px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
                      />
                      <div className="col-span-2 text-right">
                        <button
                          onClick={() => handleDeleteActivity(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-all cursor-pointer"
                          title="Remove Activity"
                        >
                          <i className="ti ti-trash text-base"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. BOOK & STATIONERY FEES */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="font-extrabold text-sm text-amber-800 flex items-center gap-1.5">
                    📚 Book & Stationery Fees (/fees/book)
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold mb-1">Amount</label>
                    <input
                      type="text"
                      value={content.fees?.additional?.book?.amount || ""}
                      onChange={(e) => {
                        const additional = {
                          ...content.fees.additional,
                          book: { ...content.fees.additional.book, amount: e.target.value }
                        };
                        setContent({ ...content, fees: { ...content.fees, additional } });
                      }}
                      className="w-full bg-white text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold mb-1">Period</label>
                    <input
                      type="text"
                      value={content.fees?.additional?.book?.period || ""}
                      onChange={(e) => {
                        const additional = {
                          ...content.fees.additional,
                          book: { ...content.fees.additional.book, period: e.target.value }
                        };
                        setContent({ ...content, fees: { ...content.fees, additional } });
                      }}
                      className="w-full bg-white text-slate-900 text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  General Disclaimer Note on /fees Page:
                </label>
                <textarea
                  rows={2}
                  value={content.fees?.additional?.note || ""}
                  onChange={(e) => {
                    const additional = { ...content.fees.additional, note: e.target.value };
                    setContent({ ...content, fees: { ...content.fees, additional } });
                  }}
                  className="w-full bg-white text-slate-800 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: TEACHERS & STAFF DIRECTORY (FULL INLINE EDITING) */}
          {/* ==================================================== */}
          {activeTab === "teachers" && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                    <span>👩‍🏫</span> Staff & Teachers Directory
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any field to edit name, qualification, or role directly. Reorder with ↑ / ↓ buttons!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddTeacher}
                    className="text-xs bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    ➕ Add Teacher
                  </button>
                  <button
                    onClick={() => locateSection("live-teachers", "teachers")}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl"
                  >
                    📍 View on Site
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {content.teachers?.map((t: TeacherItem, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                      <span className="font-extrabold text-purple-700 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-800">
                          {idx + 1}
                        </span>
                        Teacher #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveTeacher(idx, "up")}
                          disabled={idx === 0}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-xs font-bold"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveTeacher(idx, "down")}
                          disabled={idx === content.teachers.length - 1}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-xs font-bold"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md ml-1"
                          title="Delete Teacher"
                        >
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-500 block font-bold mb-1">Teacher Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => handleTeacherChange(idx, "name", e.target.value)}
                          placeholder="e.g. Mrs. Anitha R."
                          className="w-full bg-white text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block font-bold mb-1">Qualification</label>
                        <input
                          type="text"
                          value={t.qualification}
                          onChange={(e) => handleTeacherChange(idx, "qualification", e.target.value)}
                          placeholder="e.g. M.A., B.Ed."
                          className="w-full bg-white text-blue-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block font-bold mb-1">Role / Subject</label>
                        <input
                          type="text"
                          value={t.role || ""}
                          onChange={(e) => handleTeacherChange(idx, "role", e.target.value)}
                          placeholder="e.g. Primary Head"
                          className="w-full bg-white text-amber-700 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                    <span>📸</span> School Photo & Marquee Manager
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pick Hero Card photo or upload / reorder photos for the scrolling strip.
                  </p>
                </div>
                <button
                  onClick={() => locateSection("live-marquee", "home")}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  📍 View on Site
                </button>
              </div>

              {/* Upload Box */}
              <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-blue-200 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center text-2xl">
                  📁
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Upload New Campus / Activity Photo</h4>
                  <p className="text-xs text-slate-500">Camera photos are automatically compressed for fast loading.</p>
                </div>
                <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-md">
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
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                  Marquee Photos ({content.marquee.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {content.marquee.map((src, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs relative group"
                    >
                      <div className="h-28 bg-slate-100 relative">
                        <img
                          src={src}
                          alt={`Marquee ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        {content.hero.heroImage === src && (
                          <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                            ⭐ HERO
                          </span>
                        )}
                      </div>
                      <div className="p-2 flex items-center justify-between text-[11px] bg-slate-50 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setContent({ ...content, hero: { ...content.hero, heroImage: src } });
                            showToast("Set as Hero Card Photo!");
                            locateSection("live-hero", "home");
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                        >
                          Make Hero
                        </button>
                        <button
                          onClick={() => {
                            const updated = content.marquee.filter((_, i) => i !== idx);
                            setContent({ ...content, marquee: updated });
                            showToast("Photo removed from strip");
                          }}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
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
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                  <span>🏠</span> Home & Top Announcement Bar
                </h3>
                <button
                  onClick={() => locateSection("live-topbar", "home")}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  📍 View on Site
                </button>
              </div>

              {/* Announcement Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-blue-700">
                  Top Sticky Banner
                </h4>
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Banner Announcement Text</label>
                  <input
                    type="text"
                    value={content.announcement.text}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, text: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block font-bold mb-1">Grade Pill</label>
                    <input
                      type="text"
                      value={content.announcement.gradePill}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, gradePill: e.target.value },
                        })
                      }
                      className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block font-bold mb-1">CBSE Pill</label>
                    <input
                      type="text"
                      value={content.announcement.cbsePill}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, cbsePill: e.target.value },
                        })
                      }
                      className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-700">
                  Hero Section
                </h4>
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Badge</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })
                    }
                    className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold mb-1">Line 1</label>
                    <input
                      type="text"
                      value={content.hero.titleLine1}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, titleLine1: e.target.value } })
                      }
                      className="w-full bg-white text-slate-900 text-xs px-2 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold mb-1">Line 2</label>
                    <input
                      type="text"
                      value={content.hero.titleLine2}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, titleLine2: e.target.value } })
                      }
                      className="w-full bg-slate-900 text-xs px-2 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold mb-1">Highlight</label>
                    <input
                      type="text"
                      value={content.hero.titleHighlight}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })
                      }
                      className="w-full bg-white text-orange-600 font-bold text-xs px-2 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Hero Description</label>
                  <textarea
                    rows={2}
                    value={content.hero.desc}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, desc: e.target.value } })
                    }
                    className="w-full bg-white text-slate-900 text-xs p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">YouTube Tour Video Link</label>
                  <input
                    type="text"
                    value={content.hero.tourVideoUrl}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, tourVideoUrl: e.target.value } })
                    }
                    className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
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
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                  <span>🎓</span> Students & School Statistics
                </h3>
                <button
                  onClick={() => locateSection("live-students", "students")}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  📍 View on Site
                </button>
              </div>

              {/* Students Page Content */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-700">
                  /students Page Content
                </h4>
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Headline</label>
                  <input
                    type="text"
                    value={content.students?.totalCount || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        students: { ...content.students, totalCount: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 font-bold text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={content.students?.desc || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        students: { ...content.students, desc: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 text-xs p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Key Numerical Stats on Homepage */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-blue-700">
                  Homepage Counter Statistics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold">Total Students</label>
                    <input
                      type="text"
                      value={content.stats.students}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, students: e.target.value } })
                      }
                      className="w-full bg-white text-blue-800 font-black text-sm px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold">Teachers Count</label>
                    <input
                      type="text"
                      value={content.stats.teachers}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, teachers: e.target.value } })
                      }
                      className="w-full bg-white text-blue-800 font-black text-sm px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold">Student-Teacher Ratio</label>
                    <input
                      type="text"
                      value={content.stats.ratio}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, ratio: e.target.value } })
                      }
                      className="w-full bg-white text-blue-800 font-black text-sm px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block font-bold">Academic Pass Rate</label>
                    <input
                      type="text"
                      value={content.stats.passRate}
                      onChange={(e) =>
                        setContent({ ...content, stats: { ...content.stats, passRate: e.target.value } })
                      }
                      className="w-full bg-white text-blue-800 font-black text-sm px-2.5 py-1.5 rounded-lg border border-slate-300"
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
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                  <span>🚨</span> Admissions / Urgent Pop-up Alert
                </h3>
                <button
                  onClick={() => locateSection("live-popup", "home")}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  📍 View on Site
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Enable Pop-up Modal on Website:</span>
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
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Pop-up Title</label>
                  <input
                    type="text"
                    value={content.popupAlert.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        popupAlert: { ...content.popupAlert, title: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Pop-up Message</label>
                  <textarea
                    rows={3}
                    value={content.popupAlert.message}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        popupAlert: { ...content.popupAlert, message: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 text-xs p-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={content.popupAlert.ctaText}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        popupAlert: { ...content.popupAlert, ctaText: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
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
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                  <span>📍</span> Campus Address & Contact Info
                </h3>
                <button
                  onClick={() => locateSection("live-contact", "home")}
                  className="text-xs bg-slate-700 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  📍 View on Site
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">School Name</label>
                  <input
                    type="text"
                    value={content.contact.schoolName}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, schoolName: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block font-bold mb-1">Address</label>
                  <textarea
                    rows={2}
                    value={content.contact.address}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, address: e.target.value },
                      })
                    }
                    className="w-full bg-white text-slate-900 text-xs p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block font-bold mb-1">Phone</label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, phone: e.target.value },
                        })
                      }
                      className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block font-bold mb-1">Email</label>
                    <input
                      type="text"
                      value={content.contact.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, email: e.target.value },
                        })
                      }
                      className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: LIVE WEBSITE INSPECTOR (MIMICS REAL SITE EXACTLY) */}
        <div className="hidden lg:flex flex-1 bg-slate-200/80 flex-col overflow-hidden p-4 items-center justify-center">
          
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
            
            {/* LIVE INSPECTOR: PAGE 1 - CLASS-WISE TUITION (/fees/school) */}
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

            {/* LIVE INSPECTOR: PAGE 2 - BUS FEES TABLE (/fees/bus) */}
            {previewPage === "bus-fees" && (
              <div className="fees-page" style={{ paddingTop: "40px", minHeight: "100%" }}>
                <div className="section-container">
                  <h1 style={{ color: "#1E3A5F", textAlign: "center", marginBottom: "16px", fontSize: "28px" }}>
                    School Bus Transport
                  </h1>

                  <div
                    id="live-bus-table"
                    className={`max-w-[550px] mx-auto bg-white rounded-2xl p-6 shadow-xl border border-slate-100 ${
                      highlightedSection === "live-bus-table" ? "site-highlight" : ""
                    }`}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                      <thead>
                        <tr style={{ background: "#f0fdf4", borderBottom: "2px solid #bbf7d0" }}>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: 800, fontSize: "14px" }}>
                            Bus Stop / Route
                          </th>
                          <th style={{ padding: "12px", textAlign: "right", fontWeight: 800, fontSize: "14px" }}>
                            Term Fees (Rs.)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.fees?.busStops?.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "12px", fontWeight: 600, fontSize: "14px" }}>
                              {item.stopName}
                            </td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: 800, color: "#16a34a", fontSize: "14px" }}>
                              {item.amount.startsWith("₹") ? item.amount : `₹${item.amount}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                      <strong>Safety Included:</strong> Verified Drivers, Female Attendant, Comfortable Seating.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE INSPECTOR: PAGE 3 - ACTIVITY FEES TABLE (/fees/activity) */}
            {previewPage === "activity-fees" && (
              <div className="fees-page" style={{ paddingTop: "40px", minHeight: "100%" }}>
                <div className="section-container">
                  <h1 style={{ color: "#1E3A5F", textAlign: "center", marginBottom: "16px", fontSize: "28px" }}>
                    Extracurricular Activities
                  </h1>

                  <div
                    id="live-activity-table"
                    className={`max-w-[550px] mx-auto bg-white rounded-2xl p-6 shadow-xl border border-slate-100 ${
                      highlightedSection === "live-activity-table" ? "site-highlight" : ""
                    }`}
                  >
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                      <thead>
                        <tr style={{ background: "#fdf2f8", borderBottom: "2px solid #fbcfe8" }}>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: 800, fontSize: "14px" }}>
                            Activity Program
                          </th>
                          <th style={{ padding: "12px", textAlign: "right", fontWeight: 800, fontSize: "14px" }}>
                            Annual Fees (Rs.)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.fees?.activityList?.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #fdf2f8" }}>
                            <td style={{ padding: "12px", fontWeight: 600, fontSize: "14px" }}>
                              {item.activityName}
                            </td>
                            <td style={{ padding: "12px", textAlign: "right", fontWeight: 800, color: "#db2777", fontSize: "14px" }}>
                              {item.amount.startsWith("₹") ? item.amount : `₹${item.amount}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 text-xs text-pink-800">
                      <strong>Program Highlights:</strong> Sports coaching, music, arts, karate, yoga & field trips.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE INSPECTOR: PAGE 4 - FEES OVERVIEW (/fees) */}
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
                    {/* Tuition Card (Dynamic Range Synced with Class Table!) */}
                    <div className="fee-card card-blue">
                      <div className="fee-icon">🎓</div>
                      <h3>School Tuition Fees</h3>
                      <p className="fee-desc">Class-specific academic tuition fees from LKG to 5th Standard.</p>
                      <div className="fee-price">
                        <span className="amount">₹{lowestFee} – ₹{highestFee}</span>
                        <span className="period">/ year</span>
                      </div>
                      <ul className="fee-features">
                        <li><i className="ti ti-check"></i> Core Academic Syllabus</li>
                        <li><i className="ti ti-check"></i> Term Examinations</li>
                        <li><i className="ti ti-check"></i> Digital Classroom Access</li>
                      </ul>
                      <div
                        onClick={() => setPreviewPage("school-fees")}
                        className="mt-3 text-center text-xs font-bold text-blue-600 cursor-pointer hover:underline"
                      >
                        View Class-by-Class Table (LKG to 5th) →
                      </div>
                    </div>

                    {/* Book Card */}
                    <div className="fee-card card-orange">
                      <div className="fee-icon">📚</div>
                      <h3>{content.fees?.additional?.book?.title}</h3>
                      <p className="fee-desc">{content.fees?.additional?.book?.desc}</p>
                      <div className="fee-price">
                        <span className="amount">{content.fees?.additional?.book?.amount}</span>
                        <span className="period">{content.fees?.additional?.book?.period}</span>
                      </div>
                      <ul className="fee-features">
                        {content.fees?.additional?.book?.features?.map((f, i) => (
                          <li key={i}><i className="ti ti-check"></i> {f}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Bus Card */}
                    <div className="fee-card card-green">
                      <div className="fee-icon">🚌</div>
                      <h3>{content.fees?.additional?.bus?.title}</h3>
                      <p className="fee-desc">{content.fees?.additional?.bus?.desc}</p>
                      <div className="fee-price">
                        <span className="amount">{content.fees?.additional?.bus?.amount}</span>
                        <span className="period">{content.fees?.additional?.bus?.period}</span>
                      </div>
                      <ul className="fee-features">
                        {content.fees?.additional?.bus?.features?.map((f, i) => (
                          <li key={i}><i className="ti ti-check"></i> {f}</li>
                        ))}
                      </ul>
                      <div
                        onClick={() => setPreviewPage("bus-fees")}
                        className="mt-3 text-center text-xs font-bold text-green-700 cursor-pointer hover:underline"
                      >
                        View Bus Stops & Routes Table →
                      </div>
                    </div>

                    {/* Activity Card */}
                    <div className="fee-card card-pink">
                      <div className="fee-icon">🎨</div>
                      <h3>{content.fees?.additional?.activity?.title}</h3>
                      <p className="fee-desc">{content.fees?.additional?.activity?.desc}</p>
                      <div className="fee-price">
                        <span className="amount">{content.fees?.additional?.activity?.amount}</span>
                        <span className="period">{content.fees?.additional?.activity?.period}</span>
                      </div>
                      <ul className="fee-features">
                        {content.fees?.additional?.activity?.features?.map((f, i) => (
                          <li key={i}><i className="ti ti-check"></i> {f}</li>
                        ))}
                      </ul>
                      <div
                        onClick={() => setPreviewPage("activity-fees")}
                        className="mt-3 text-center text-xs font-bold text-pink-700 cursor-pointer hover:underline"
                      >
                        View All Activities & Coaching Fees →
                      </div>
                    </div>
                  </div>

                  <div className="fees-note mt-6">
                    <p>{content.fees?.additional?.note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE INSPECTOR: PAGE 5 - TEACHERS (/teachers) */}
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

            {/* LIVE INSPECTOR: PAGE 6 - STUDENTS (/students) */}
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

            {/* LIVE INSPECTOR: PAGE 7 - HOME PAGE */}
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

          </div>
        </div>

      </div>

    </div>
  );
}
