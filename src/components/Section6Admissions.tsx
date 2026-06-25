"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Section6Admissions() {
  const items = [
    "Student-Centered Education",
    "Safe & Nurturing Environment",
    "Passionate, Qualified Educators",
    "Modern School Facilities",
    "CBSE Integrated Syllabus",
  ];

  return (
    <section id="admissions" className="admissions-section">
      <div className="section-container">
        <div className="section-header centered">
          <div className="section-eyebrow" style={{ background: "var(--orange-light)", color: "var(--orange)" }}>
            <span>🎒</span> ADMISSIONS OPEN · 2026–2027
          </div>
          <h2>Give your child<br />the best <span style={{ color: "var(--orange)" }}>beginning</span> 🌟</h2>
          <div className="gradient-line" />
          <p className="section-desc">Limited seats for Pre KG to 5th Standard. English medium. CBSE Integrated. Budapadi, Erode.</p>
        </div>

        <div style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', aspectRatio: '16/9', maxWidth: '800px', margin: '0 auto 50px auto' }}>
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/sj_xbLOVHik?autoplay=0" 
            title="SINAPS Admission Promotion" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        <div className="admissions-layout">
          <motion.div className="admissions-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring" as const, stiffness: 90, damping: 15 }}>
            <h3 className="enroll-title">Ready to enroll? 🎓</h3>
            <p className="enroll-sub">Join the SINAPS family today</p>
            <a href="https://wa.me/916380656434?text=Hello,%20I%20would%20like%20to%20inquire%20about%20admissions%20for%202026-2027" target="_blank" rel="noopener noreferrer" className="btn-primary enroll-btn">
              <i className="ti ti-brand-whatsapp" style={{ fontSize: "1.2rem", verticalAlign: "middle", marginRight: "8px" }}></i>Enquire on WhatsApp
            </a>
            <div className="or-text">or contact us directly</div>
            <a href="tel:+916380656434" className="phone-btn">
              <i className="ti ti-phone-call"></i> +91 63806 56434
            </a>
            <div className="email-text">
              <i className="ti ti-mail" style={{ marginRight: 6, color: "var(--blue)" }}></i>
              sinapsschool@yahoo.com
            </div>
          </motion.div>

          <div className="admissions-info">
            <div className="info-block">
              <h3>What We Offer ✅</h3>
              <ul className="checklist">
                {items.map((it, i) => (
                  <li key={i}><span className="check-dot">✓</span> {it}</li>
                ))}
              </ul>
            </div>
            <div className="info-block">
              <h3><i className="ti ti-map-pin" style={{ color: "var(--orange)", marginRight: 6 }}></i>School Location</h3>
              <p className="address-text">Budapadi, Anthiyur Taluk, Erode District, Tamil Nadu - 638 311</p>
            </div>
            <div className="social-row">
              <a href="https://www.instagram.com/sinaps_school_budapadi" target="_blank" rel="noopener noreferrer" className="social-link ig">
                <i className="ti ti-brand-instagram"></i> @sinaps_school_budapadi
              </a>
              <a href="https://www.youtube.com/@sinapsschool" target="_blank" rel="noopener noreferrer" className="social-link yt">
                <i className="ti ti-brand-youtube"></i> @sinaps school
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
