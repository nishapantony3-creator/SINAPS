"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  // Content state loaded from /api/admin/content
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("photos");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [highlightedSection, setHighlightedSection] = useState<string | null>("live-marquee");
  
  // Status feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Photos list
  const [availablePhotos, setAvailablePhotos] = useState<any[]>([]);

  // Preview iframe / container ref
  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Check saved session
  useEffect(() => {
    const savedPin = localStorage.getItem("sinaps_admin_pin");
    if (savedPin === "sinaps2026") {
      setIsAuthenticated(true);
      fetchContent();
      fetchPhotos();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "sinaps2026") {
      localStorage.setItem("sinaps_admin_pin", pinInput);
      setIsAuthenticated(true);
      setPinError("");
      fetchContent();
      fetchPhotos();
    } else {
      setPinError("Invalid Admin PIN. Please check and try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sinaps_admin_pin");
    setIsAuthenticated(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const json = await res.json();
      if (json.success && json.data) {
        setContent(json.data);
      }
    } catch (err) {
      console.error("Failed to load content:", err);
      showToast("Error loading content from server");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/admin/photos");
      const json = await res.json();
      if (json.success && json.photos) {
        setAvailablePhotos(json.photos);
      }
    } catch (err) {
      console.error("Failed to list photos:", err);
    }
  };

  const saveContent = async () => {
    if (!content) return;
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: "sinaps2026", data: content }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("✅ Changes saved to local configuration!");
      } else {
        showToast("❌ " + (json.error || "Save failed"));
      }
    } catch (err) {
      console.error("Failed to save:", err);
      showToast("❌ Network error while saving");
    }
  };

  // Highlighting engine: scrolls preview to element and triggers glowing outline
  const locateSection = (sectionId: string) => {
    setHighlightedSection(sectionId);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);

    // Auto remove highlight pulse after 4s
    setTimeout(() => {
      setHighlightedSection((prev) => (prev === sectionId ? null : prev));
    }, 4000);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "photos") locateSection("live-marquee");
    else if (tab === "announcements") locateSection("live-topbar");
    else if (tab === "hero") locateSection("live-hero");
    else if (tab === "popup") locateSection("live-popup");
    else if (tab === "stats") locateSection("live-stats");
    else if (tab === "fees") locateSection("live-fees");
    else if (tab === "contact") locateSection("live-footer");
  };

  // Upload photo handler with auto-compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    showToast("⏳ Compressing and uploading photo with Sharp...");

    try {
      const fd = new FormData();
      fd.append("pin", "sinaps2026");
      fd.append("file", file);

      const res = await fetch("/api/admin/photos", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        showToast("🎉 Photo uploaded & added to marquee!");
        await fetchContent();
        await fetchPhotos();
        locateSection("live-marquee");
      } else {
        showToast("❌ " + (json.error || "Upload failed"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("❌ Upload error occurred");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // 1-Click Publish to Live Website
  const handlePublishLive = async () => {
    setIsPublishing(true);
    showToast("🚀 Syncing with GitHub & triggering Vercel build...");

    try {
      // Save current content first
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
          commitMessage: `Admin CMS update: ${new Date().toLocaleString()}`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("🌟 Published Live! https://www.sinaps.in is updating!");
      } else {
        showToast("❌ Publish error: " + (json.error || "Check terminal"));
      }
    } catch (err) {
      console.error("Publish error:", err);
      showToast("❌ Network error triggering publish");
    } finally {
      setIsPublishing(false);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-cream)" }}>
        <div className="w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-200" style={{ background: "#ffffff" }}>
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shadow-md">
              <Image src="/logo.png" alt="SINAPS Logo" width={56} height={56} className="rounded-full object-cover" />
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", color: "var(--blue-dark)", fontSize: "24px", fontWeight: 900 }}>
              SINAPS Admin Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              St. Ignatius Nursery & Primary School • Budapadi
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter Admin PIN / Password</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: sinaps2026)"
                className="w-full text-center tracking-widest text-lg font-bold border-2 border-slate-200 rounded-2xl p-3 focus:border-blue-500 outline-none transition-all"
                autoFocus
              />
              {pinError && <p className="text-red-500 text-xs font-semibold mt-2 text-center">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
              style={{ background: "var(--blue-dark)" }}
            >
              Unlock Dashboard 🔓
            </button>
          </form>

          <div className="text-center mt-6 text-[11px] text-slate-400">
            Protected CMS • Official School Administration
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-cream)" }}>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-slate-700">Loading SINAPS Content Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-cream)", color: "var(--text-dark)" }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce-short text-xs font-bold">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40" style={{ background: "#ffffff" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden shadow-sm">
            <Image src="/logo.png" alt="SINAPS" width={38} height={38} className="rounded-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "var(--font-heading)", color: "var(--blue-dark)", fontWeight: 900, fontSize: "17px" }}>
                SINAPS VISUAL CMS
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                ● Live Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500">St. Ignatius Nursery & Primary School • Budapadi, Erode</p>
          </div>
        </div>

        {/* Center Device Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              deviceMode === "desktop" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              deviceMode === "tablet" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            💻 Tablet
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              deviceMode === "mobile" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            📱 Mobile
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={saveContent}
            className="px-4 py-2 rounded-xl text-xs font-extrabold border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-800 shadow-sm transition-all active:scale-95"
          >
            💾 Save Changes
          </button>

          <button
            onClick={handlePublishLive}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            style={{ background: isPublishing ? "#64748B" : "var(--green)" }}
          >
            <i className="ti ti-rocket"></i>
            <span>{isPublishing ? "Deploying..." : "🚀 Publish Live"}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <i className="ti ti-logout" style={{ fontSize: "1.2rem" }}></i>
          </button>
        </div>
      </header>

      {/* DUAL PANE WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: "calc(100vh - 65px)" }}>
        
        {/* LEFT PANE: CMS CONTROLLER & TABS (42% width) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] border-r border-slate-200 flex flex-col bg-white overflow-hidden shadow-sm">
          
          {/* Navigation Tabs Bar */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto custom-scrollbar flex-shrink-0 text-xs">
            <button
              onClick={() => handleTabChange("photos")}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                activeTab === "photos" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              📸 Photos & Marquee
            </button>
            <button
              onClick={() => handleTabChange("announcements")}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                activeTab === "announcements" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              📢 Top Bar & Hero
            </button>
            <button
              onClick={() => handleTabChange("popup")}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                activeTab === "popup" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              🚨 Urgent Pop-up
            </button>
            <button
              onClick={() => handleTabChange("stats")}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                activeTab === "stats" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              🎓 Stats & Team
            </button>
            <button
              onClick={() => handleTabChange("fees")}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                activeTab === "fees" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              💰 Fees & Bus
            </button>
            <button
              onClick={() => handleTabChange("contact")}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
                activeTab === "contact" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              📍 Campus Info
            </button>
          </div>

          {/* Left Form Panels */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">

            {/* TAB: PHOTOS & MARQUEE */}
            {activeTab === "photos" && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl border border-blue-200 flex items-center justify-between" style={{ background: "var(--bg-sky)" }}>
                  <div>
                    <h3 className="font-extrabold text-sm" style={{ color: "var(--blue-dark)" }}>School Photo Manager</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">Upload, reorder, or pick photos for Hero Card & Marquee Strip.</p>
                  </div>
                  <button
                    onClick={() => locateSection("live-marquee")}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl text-white shadow-sm"
                    style={{ background: "var(--orange)" }}
                  >
                    🎯 Locate on Site
                  </button>
                </div>

                {/* Active Hero Photo Selector */}
                <div className="p-4 rounded-2xl border border-slate-200 space-y-3" style={{ background: "#ffffff" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-blue-900">🌟 Active Hero Image</span>
                    <button onClick={() => locateSection("live-hero-card")} className="text-blue-600 font-bold hover:underline">
                      🎯 View in Hero
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative">
                      <img src={content.hero.heroImage} alt="Hero" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <p className="font-bold text-slate-800">Current: <code>{content.hero.heroImage}</code></p>
                      <p className="text-[11px] text-slate-400">Click &quot;Make Hero&quot; on any photo below to instantly replace this image.</p>
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 text-center space-y-2 bg-blue-50/50">
                  <i className="ti ti-cloud-upload text-blue-600" style={{ fontSize: "2rem" }}></i>
                  <p className="font-extrabold text-slate-800">Upload New Photo (Auto-Resized)</p>
                  <p className="text-[11px] text-slate-500">DSLR 20MB raw photos are auto-compressed with Sharp to &lt;150KB for fast 4G loading.</p>
                  <label className="inline-block mt-2 px-4 py-2 rounded-xl text-white font-extrabold cursor-pointer transition-all active:scale-95" style={{ background: "var(--blue)" }}>
                    Browse Image File
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploading} />
                  </label>
                </div>

                {/* Marquee Photo Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800">Current Marquee Photos ({content.marquee.length})</h4>
                    <span className="text-[11px] text-slate-400">Appears in scrolling strip</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {content.marquee.map((src: string, idx: number) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-2 bg-slate-50 space-y-2 group shadow-sm">
                        <div className="h-24 rounded-lg overflow-hidden bg-slate-200 relative">
                          <img src={src} alt={`Photo ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 rounded">
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <button
                            onClick={() => {
                              setContent({ ...content, hero: { ...content.hero, heroImage: src } });
                              locateSection("live-hero-card");
                              showToast("Updated Hero photo!");
                            }}
                            className="font-bold text-blue-600 hover:underline"
                          >
                            Set Hero
                          </button>
                          <button
                            onClick={() => locateSection("live-marquee")}
                            className="text-amber-600 font-bold hover:underline"
                          >
                            🎯 Locate
                          </button>
                          <button
                            onClick={() => {
                              const updated = content.marquee.filter((_: any, i: number) => i !== idx);
                              setContent({ ...content, marquee: updated });
                              showToast("Removed from marquee");
                            }}
                            className="text-red-500 font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ANNOUNCEMENTS & HERO */}
            {activeTab === "announcements" && (
              <div className="space-y-4">
                {/* Top Announcement Bar */}
                <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-blue-900">1. Top Announcement Bar</span>
                    <button onClick={() => locateSection("live-topbar")} className="text-amber-600 font-bold hover:underline">
                      🎯 Locate on Site
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Banner Announcement Text</label>
                    <input
                      type="text"
                      value={content.announcement.text}
                      onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, text: e.target.value } })}
                      onFocus={() => locateSection("live-topbar")}
                      className="w-full border-2 border-slate-200 rounded-xl p-2.5 font-semibold focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={content.announcement.phone}
                        onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, phone: e.target.value } })}
                        onFocus={() => locateSection("live-topbar")}
                        className="w-full border border-slate-200 rounded-xl p-2 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">WhatsApp Target Phone</label>
                      <input
                        type="text"
                        value={content.announcement.whatsappNumber}
                        onChange={(e) => setContent({ ...content, announcement: { ...content.announcement, whatsappNumber: e.target.value } })}
                        className="w-full border border-slate-200 rounded-xl p-2 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-blue-900">2. Hero Heading & Subtitle</span>
                    <button onClick={() => locateSection("live-hero")} className="text-amber-600 font-bold hover:underline">
                      🎯 Locate Hero
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={content.hero.badge}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                      onFocus={() => locateSection("live-hero")}
                      className="w-full border border-slate-200 rounded-xl p-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Main Heading (Line 1)</label>
                    <input
                      type="text"
                      value={content.hero.titleLine1}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleLine1: e.target.value } })}
                      onFocus={() => locateSection("live-hero")}
                      className="w-full border border-slate-200 rounded-xl p-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Highlighted Words</label>
                    <input
                      type="text"
                      value={content.hero.titleHighlight}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })}
                      onFocus={() => locateSection("live-hero")}
                      className="w-full border border-slate-200 rounded-xl p-2 font-bold text-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Hero Subtitle</label>
                    <textarea
                      rows={3}
                      value={content.hero.desc}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, desc: e.target.value } })}
                      onFocus={() => locateSection("live-hero")}
                      className="w-full border border-slate-200 rounded-xl p-2 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">YouTube School Tour Video</label>
                    <input
                      type="text"
                      value={content.hero.tourVideoUrl}
                      onChange={(e) => setContent({ ...content, hero: { ...content.hero, tourVideoUrl: e.target.value } })}
                      className="w-full border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: URGENT POP-UP ALERT */}
            {activeTab === "popup" && (
              <div className="p-4 rounded-2xl border border-amber-300 space-y-4" style={{ background: "var(--bg-peach)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-amber-950">Urgent Campus Alert Pop-up</h3>
                    <p className="text-slate-600 text-[11px]">Displays an attention-grabbing modal banner to parents when visiting the website.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.popupAlert.enabled}
                      onChange={(e) => {
                        setContent({ ...content, popupAlert: { ...content.popupAlert, enabled: e.target.checked } });
                        if (e.target.checked) locateSection("live-popup");
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Alert Headline</label>
                    <input
                      type="text"
                      value={content.popupAlert.title}
                      onChange={(e) => setContent({ ...content, popupAlert: { ...content.popupAlert, title: e.target.value } })}
                      className="w-full border border-slate-300 rounded-xl p-2 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Alert Message</label>
                    <textarea
                      rows={3}
                      value={content.popupAlert.message}
                      onChange={(e) => setContent({ ...content, popupAlert: { ...content.popupAlert, message: e.target.value } })}
                      className="w-full border border-slate-300 rounded-xl p-2 font-medium bg-white"
                    />
                  </div>

                  <button
                    onClick={() => locateSection("live-popup")}
                    className="px-4 py-2 rounded-xl text-white font-extrabold shadow-sm"
                    style={{ background: "var(--orange)" }}
                  >
                    🎯 Preview Pop-up on Site
                  </button>
                </div>
              </div>
            )}

            {/* TAB: STATS & TEAM */}
            {activeTab === "stats" && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-blue-900">Key School Numbers</span>
                    <button onClick={() => locateSection("live-stats")} className="text-amber-600 font-bold hover:underline">
                      🎯 Locate Stats
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Total Students</span>
                      <input
                        type="text"
                        value={content.stats.students}
                        onChange={(e) => setContent({ ...content, stats: { ...content.stats, students: e.target.value } })}
                        onFocus={() => locateSection("live-stats")}
                        className="w-full text-xl font-black text-blue-600 border border-slate-300 rounded-lg p-1.5 mt-1 font-mono bg-white"
                      />
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Expert Teachers</span>
                      <input
                        type="text"
                        value={content.stats.teachers}
                        onChange={(e) => setContent({ ...content, stats: { ...content.stats, teachers: e.target.value } })}
                        onFocus={() => locateSection("live-stats")}
                        className="w-full text-xl font-black text-emerald-600 border border-slate-300 rounded-lg p-1.5 mt-1 font-mono bg-white"
                      />
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Student Ratio</span>
                      <input
                        type="text"
                        value={content.stats.ratio}
                        onChange={(e) => setContent({ ...content, stats: { ...content.stats, ratio: e.target.value } })}
                        onFocus={() => locateSection("live-stats")}
                        className="w-full text-xl font-black text-amber-600 border border-slate-300 rounded-lg p-1.5 mt-1 font-mono bg-white"
                      />
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">CBSE Pass Rate</span>
                      <input
                        type="text"
                        value={content.stats.passRate}
                        onChange={(e) => setContent({ ...content, stats: { ...content.stats, passRate: e.target.value } })}
                        onFocus={() => locateSection("live-stats")}
                        className="w-full text-xl font-black text-purple-600 border border-slate-300 rounded-lg p-1.5 mt-1 font-mono bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Teachers Directory */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-blue-900">
                      Teachers Directory ({content.teachers.length})
                    </span>
                    <button
                      onClick={() => {
                        const name = prompt("Teacher Name (e.g. Mrs. Priya R.):");
                        if (!name) return;
                        const qual = prompt("Qualification:", "B.Sc., B.Ed.") || "B.Ed.";
                        const role = prompt("Subject / Standard:", "Primary Teacher") || "Teacher";
                        setContent({ ...content, teachers: [...content.teachers, { name, qualification: qual, role }] });
                        showToast("Added new teacher!");
                      }}
                      className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px]"
                    >
                      + Add Teacher
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {content.teachers.map((t: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{t.name}</div>
                          <div className="text-[11px] text-slate-500">{t.qualification} • {t.role}</div>
                        </div>
                        <button
                          onClick={() => {
                            const updated = content.teachers.filter((_: any, i: number) => i !== idx);
                            setContent({ ...content, teachers: updated });
                            showToast("Deleted teacher");
                          }}
                          className="text-red-500 hover:underline font-bold text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FEES & BUS */}
            {activeTab === "fees" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-[11px] text-blue-900">Tuition Fee Slabs</span>
                    <button onClick={() => locateSection("live-fees")} className="text-amber-600 font-bold hover:underline">
                      🎯 Locate Fees
                    </button>
                  </div>

                  <div className="space-y-2">
                    {content.fees.tuition.map((slab: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <span className="font-bold text-slate-700">{slab.standard}</span>
                        <input
                          type="text"
                          value={slab.amount}
                          onChange={(e) => {
                            const updated = [...content.fees.tuition];
                            updated[idx].amount = e.target.value;
                            setContent({ ...content, fees: { ...content.fees, tuition: updated } });
                          }}
                          className="w-24 text-right font-black border border-slate-300 rounded-lg p-1 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <span className="font-extrabold uppercase text-[11px] text-amber-900">School Bus Transport Slabs</span>
                  <div className="space-y-2">
                    {content.fees.bus.map((b: any, idx: number) => (
                      <div key={idx} className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <span className="font-bold text-slate-700">{b.route}</span>
                        <input
                          type="text"
                          value={b.amount}
                          onChange={(e) => {
                            const updated = [...content.fees.bus];
                            updated[idx].amount = e.target.value;
                            setContent({ ...content, fees: { ...content.fees, bus: updated } });
                          }}
                          className="w-24 text-right font-black border border-slate-300 rounded-lg p-1 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CAMPUS INFO */}
            {activeTab === "contact" && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase text-[11px] text-blue-900">School Campus & Contact</span>
                  <button onClick={() => locateSection("live-footer")} className="text-amber-600 font-bold hover:underline">
                    🎯 Locate Footer
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Campus Full Address</label>
                  <textarea
                    rows={3}
                    value={content.contact.address}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
                    className="w-full border border-slate-200 rounded-xl p-2 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Primary Email</label>
                  <input
                    type="text"
                    value={content.contact.email}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                    className="w-full border border-slate-200 rounded-xl p-2 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Google Maps Direction URL</label>
                  <input
                    type="text"
                    value={content.contact.mapUrl}
                    onChange={(e) => setContent({ ...content, contact: { ...content.contact, mapUrl: e.target.value } })}
                    className="w-full border border-slate-200 rounded-xl p-2 font-mono text-xs"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANE: LIVE INTERACTIVE PREVIEW (58% width) */}
        <div className="flex-1 bg-slate-100 flex flex-col overflow-hidden">
          
          {/* Top Browser URL Bar */}
          <div className="bg-slate-200/80 px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs flex-shrink-0">
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="bg-white border border-slate-300 rounded-lg px-3 py-1 flex items-center justify-between text-slate-600 font-mono text-[11px] flex-1 shadow-inner">
                <span className="truncate">https://www.sinaps.in/</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-sans font-bold">
                  Live View
                </span>
              </div>
            </div>

            <div className="text-slate-500 font-semibold text-[11px]">
              Click any section to edit
            </div>
          </div>

          {/* Website Viewport Area */}
          <div ref={previewScrollRef} className="flex-1 overflow-y-auto p-3 md:p-6 custom-scrollbar">
            
            <div
              className={`bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border border-slate-200 mx-auto relative ${
                deviceMode === "mobile" ? "max-w-[390px] border-[8px] border-slate-800 rounded-[38px]" : deviceMode === "tablet" ? "max-w-[768px] border-[6px] border-slate-700" : "max-w-5xl"
              }`}
              style={{ background: "var(--bg-cream)" }}
            >

              {/* POPUP ALERT OVERLAY */}
              {content.popupAlert.enabled && (
                <div id="live-popup" className={`p-4 bg-amber-400 text-slate-900 border-b-2 border-amber-500 shadow-md ${highlightedSection === "live-popup" ? "ring-4 ring-orange-500" : ""}`}>
                  <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-sm">{content.popupAlert.title}</div>
                      <div className="text-xs text-amber-950 font-medium">{content.popupAlert.message}</div>
                    </div>
                    <a
                      href={content.popupAlert.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow whitespace-nowrap"
                    >
                      {content.popupAlert.ctaText}
                    </a>
                  </div>
                </div>
              )}

              {/* 1. LIVE TOPBAR */}
              <div
                id="live-topbar"
                onClick={() => handleTabChange("announcements")}
                className={`top-bar cursor-pointer transition-all ${
                  highlightedSection === "live-topbar" ? "ring-4 ring-amber-400 ring-offset-2" : ""
                }`}
              >
                <div className="top-bar-inner">
                  <span>{content.announcement.text}</span>
                  <span className="sep">·</span>
                  <span>{content.announcement.gradePill}</span>
                  <span className="sep">·</span>
                  <span>{content.announcement.cbsePill}</span>
                  <span className="sep">·</span>
                  <a href={`tel:${content.announcement.phone.replace(/[^0-9+]/g, "")}`}>
                    <i className="ti ti-phone-call" style={{ marginRight: 4 }}></i>
                    {content.announcement.phone}
                  </a>
                </div>
              </div>

              {/* LIVE NAVBAR */}
              <nav className="navbar" style={{ position: "relative" }}>
                <div className="navbar-inner">
                  <div className="navbar-brand">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Image
                        src="/logo.png"
                        alt="SINAPS Logo"
                        width={48}
                        height={48}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 900, color: "var(--blue-dark)" }}>
                          ST. IGNATIUS
                        </span>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", fontWeight: 600, color: "var(--text-muted)" }}>
                          Nursery & Primary School
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="navbar-links">
                    <span className="navbar-link">Home</span>
                    <span className="navbar-link">About</span>
                    <span className="navbar-link">Academics</span>
                    <span className="navbar-link">School Life</span>
                    <span className="navbar-link">Fees</span>
                    <span className="navbar-link">Admissions</span>
                  </div>

                  <div className="btn-primary navbar-cta">
                    <i className="ti ti-brand-whatsapp" style={{ marginRight: 4 }}></i>
                    Enquire on WhatsApp
                  </div>
                </div>
              </nav>

              {/* 2. LIVE HERO SECTION */}
              <section
                id="live-hero"
                onClick={() => handleTabChange("announcements")}
                className={`hero cursor-pointer transition-all ${
                  highlightedSection === "live-hero" ? "ring-4 ring-amber-400 ring-offset-4" : ""
                }`}
                style={{ padding: "40px 20px" }}
              >
                <div className="hero-inner">
                  <div className="hero-content">
                    <div className="hero-badge">
                      <span className="emoji">⭐</span>
                      {content.hero.badge}
                    </div>

                    <h1 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>
                      {content.hero.titleLine1}<br />
                      {content.hero.titleLine2}
                      <span className="highlight" style={{ color: "var(--orange)" }}>
                        {content.hero.titleHighlight}
                      </span>
                    </h1>

                    <p className="hero-desc">{content.hero.desc}</p>

                    <div className="hero-buttons">
                      <div className="btn-primary">
                        <i className="ti ti-brand-whatsapp" style={{ marginRight: 8 }}></i>
                        Enquire on WhatsApp
                      </div>
                      <div className="btn-secondary">
                        <i className="ti ti-player-play-filled"></i> Watch School Tour
                      </div>
                    </div>

                    <div className="hero-pills">
                      {content.hero.pills.map((p: string, i: number) => (
                        <span key={i} className="hero-pill">{p}</span>
                      ))}
                    </div>
                  </div>

                  {/* Hero Card */}
                  <div
                    id="live-hero-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabChange("photos");
                    }}
                    className={`hero-visual cursor-pointer transition-all ${
                      highlightedSection === "live-hero-card" ? "ring-4 ring-orange-500 scale-105" : ""
                    }`}
                  >
                    <div className="hero-card">
                      <div style={{ position: "relative", width: "100%", height: 260, borderRadius: "18px 18px 0 0", overflow: "hidden" }}>
                        <img src={content.hero.heroImage} alt="Student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div className="hero-card-footer">
                        <Image src="/logo.png" alt="Logo" width={44} height={44} className="hero-card-logo" />
                        <div className="hero-card-info">
                          <div className="hero-card-name">SINAPS Budapadi</div>
                          <div className="hero-card-loc">Erode, Tamil Nadu</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. LIVE PHOTO MARQUEE STRIP */}
              <section
                id="live-marquee"
                onClick={() => handleTabChange("photos")}
                className={`py-6 bg-slate-900 text-white cursor-pointer transition-all ${
                  highlightedSection === "live-marquee" ? "ring-4 ring-amber-400 ring-offset-4" : ""
                }`}
              >
                <div className="px-6 mb-3 flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase tracking-widest text-slate-300">
                    📸 School Life Photo Strip ({content.marquee.length} Photos)
                  </span>
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    Auto-Marquee Strip
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto px-6 py-2 custom-scrollbar">
                  {content.marquee.map((src: string, idx: number) => (
                    <div key={idx} className="h-28 w-44 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 border border-slate-700 bg-slate-800">
                      <img src={src} alt="School" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. LIVE STATS SECTION */}
              <section
                id="live-stats"
                onClick={() => handleTabChange("stats")}
                className={`p-8 text-center cursor-pointer transition-all ${
                  highlightedSection === "live-stats" ? "ring-4 ring-amber-400 ring-offset-4" : ""
                }`}
                style={{ background: "var(--blue-dark)", color: "#ffffff" }}
              >
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 900, marginBottom: "20px" }}>
                  Excellence in Numbers
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--yellow)" }}>{content.stats.students}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700 }}>Happy Students</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--green)" }}>{content.stats.teachers}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700 }}>Qualified Teachers</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--orange)" }}>{content.stats.ratio}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700 }}>Student Ratio</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--pink)" }}>{content.stats.passRate}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700 }}>CBSE Pass</div>
                  </div>
                </div>
              </section>

              {/* 5. LIVE FEES SECTION */}
              <section
                id="live-fees"
                onClick={() => handleTabChange("fees")}
                className={`p-8 cursor-pointer transition-all ${
                  highlightedSection === "live-fees" ? "ring-4 ring-amber-400 ring-offset-4" : ""
                }`}
                style={{ background: "#ffffff" }}
              >
                <h3 className="text-center font-extrabold text-xl mb-4" style={{ color: "var(--blue-dark)", fontFamily: "var(--font-heading)" }}>
                  Tuition & Bus Transport Fees
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="font-extrabold text-blue-900">Pre-Primary (Pre-KG – UKG)</div>
                    <div className="text-xl font-black text-blue-600">{content.fees.tuition[0]?.amount || "₹15,000"}</div>
                    <div className="text-slate-500">Play-based Montessori & integrated activities</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="font-extrabold text-blue-900">Primary (Classes 1 to 5)</div>
                    <div className="text-xl font-black text-blue-600">{content.fees.tuition[1]?.amount || "₹18,000"}</div>
                    <div className="text-slate-500">CBSE Integrated curriculum & smart classes</div>
                  </div>
                </div>
              </section>

              {/* 6. LIVE FOOTER */}
              <footer
                id="live-footer"
                onClick={() => handleTabChange("contact")}
                className={`p-6 text-center text-xs space-y-2 cursor-pointer transition-all ${
                  highlightedSection === "live-footer" ? "ring-4 ring-amber-400" : ""
                }`}
                style={{ background: "var(--blue-dark)", color: "rgba(255,255,255,0.7)" }}
              >
                <div style={{ color: "#ffffff", fontWeight: 800 }}>{content.contact.schoolName}</div>
                <p>{content.contact.address}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  Admissions Helpline: {content.contact.phone} • {content.contact.email}
                </p>
              </footer>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
