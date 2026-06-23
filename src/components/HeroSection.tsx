"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TiltWrapper from "@/components/TiltWrapper";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
} as const;
const item = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 14 } },
};

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="hero-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="hero-inner">
        <motion.div className="hero-content" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div className="hero-badge" variants={item}>
            <span className="emoji">⭐</span>
            Admissions Open 2026–2027
          </motion.div>

          <motion.h1 className="hero-title" variants={item}>
            Where little minds<br />grow into <span className="highlight">big dreams.</span>
          </motion.h1>

          <motion.p className="hero-desc" variants={item}>
            St. Ignatius Nursery & Primary School — A joyful, safe, and inspiring English medium school with CBSE & ICSE based education from Pre KG to 5th Standard.
          </motion.p>

          <motion.div className="hero-buttons" variants={item}>
            <a href="#admissions" className="btn-primary">Apply for Admission 2026</a>
            <a href="https://www.youtube.com/@sinapsschool" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <i className="ti ti-player-play-filled"></i> Watch School Tour
            </a>
          </motion.div>

          <motion.div className="hero-pills" variants={item}>
            <span className="hero-pill">📚 Pre KG – 5th Std</span>
            <span className="hero-pill">✅ CBSE & ICSE</span>
            <span className="hero-pill">📍 Budapadi, Erode</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" as const, stiffness: 60 }}
        >
          <TiltWrapper>
            <div className="hero-card float-slow">
              <Image src="/hero-girl.jpg" alt="Happy student at SINAPS" width={380} height={280} className="hero-card-img" priority />
              <div className="hero-card-footer">
                <Image src="/logo.png" alt="SINAPS" width={48} height={48} className="hero-card-logo" />
                <div className="hero-card-info">
                  <div className="hero-card-name">SINAPS Budapadi</div>
                  <div className="hero-card-loc">Erode, Tamil Nadu</div>
                </div>
              </div>
            </div>
          </TiltWrapper>
        </motion.div>
      </div>
    </section>
  );
}
