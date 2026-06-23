"use client";

import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import Section2WhyUs from "@/components/Section2WhyUs";
import Section3Academics from "@/components/Section3Academics";
import Section4SchoolLife from "@/components/Section4SchoolLife";
import Section5Stats from "@/components/Section5Stats";
import Section6Admissions from "@/components/Section6Admissions";
import Footer from "@/components/Footer";
import PhotoMarquee from "@/components/PhotoMarquee";
import FloatingShapes from "@/components/FloatingShapes";

export default function Home() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 12;
      });
    }, 50);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <LoadingScreen progress={progress} />
      <TopBar />
      <Navbar />
      <FloatingShapes />
      <main>
        <HeroSection />
        <PhotoMarquee />
        <Section2WhyUs />
        <Section3Academics />
        <Section4SchoolLife />
        <Section5Stats />
        <Section6Admissions />
        <Footer />
      </main>
    </>
  );
}
