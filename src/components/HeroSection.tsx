"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TiltWrapper from "@/components/TiltWrapper";
import siteContent from "@/data/siteContent.json";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
} as const;
const item = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 14 } },
};

export default function HeroSection() {
  const { hero, announcement } = siteContent;
  const whatsappUrl = `https://wa.me/${announcement.whatsappNumber}?text=${encodeURIComponent(announcement.whatsappMessage)}`;

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
            {hero.badge}
          </motion.div>

          <motion.h1 className="hero-title" variants={item}>
            {hero.titleLine1}<br />
            {hero.titleLine2}<span className="highlight">{hero.titleHighlight}</span>
          </motion.h1>

          <motion.p className="hero-desc" variants={item}>
            {hero.desc}
          </motion.p>

          <motion.div className="hero-buttons" variants={item}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <i className="ti ti-brand-whatsapp" style={{ fontSize: "1.2rem", verticalAlign: "middle", marginRight: "8px" }}></i>Enquire on WhatsApp
            </a>
            <a href={hero.tourVideoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <i className="ti ti-player-play-filled"></i> Watch School Tour
            </a>
          </motion.div>

          <motion.div className="hero-pills" variants={item}>
            {hero.pills.map((p, idx) => (
              <span key={idx} className="hero-pill">{p}</span>
            ))}
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
              <Image src={hero.heroImage} alt="Happy student at SINAPS" width={380} height={280} className="hero-card-img" priority />
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
