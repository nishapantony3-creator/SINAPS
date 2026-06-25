"use client";

import React from "react";
import { motion } from "framer-motion";

const classes = [
  { title: "Pre KG & Nursery", icon: "ti-plant-2", tag: "Ages 2.5–4", tagClass: "tag-orange", iconBg: "icon-orange", body: "Play-based learning that develops language, social skills, and a genuine joy of discovery." },
  { title: "Lower Primary (KG–2)", icon: "ti-abc", tag: "Ages 4–8", tagClass: "tag-blue", iconBg: "icon-blue", body: "Core literacy, numeracy, and communication skills built through interactive activities." },
  { title: "Upper Primary (3–5)", icon: "ti-school", tag: "Ages 8–12", tagClass: "tag-orange", iconBg: "icon-green", body: "CBSE integrated curriculum preparing students for middle school excellence." },
];

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } } as const;
const cardV = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 90, damping: 14 } } };

export default function Section3Academics() {
  return (
    <section id="academics" className="academics-section">
      <div className="section-container">
        <div className="section-header centered">
          <div className="section-eyebrow" style={{ background: "var(--green-light)", color: "var(--green)" }}>
            <span>📖</span> ACADEMICS
          </div>
          <h2>CBSE Integrated<br/>excellence, <span style={{ color: "var(--blue)" }}>every grade</span> 🎓</h2>
          <div className="gradient-line" />
          <p className="section-desc">From the first day of Pre KG through 5th Standard, our curriculum builds strong foundations in language, numeracy, science, and values.</p>
        </div>

        <motion.div className="academics-grid" variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          {classes.map((c, i) => (
            <motion.div key={i} className="academic-card" variants={cardV} whileHover={{ y: -6, transition: { duration: 0.2 } }}>
              <div className="academic-card-head">
                <div className={`academic-icon why-icon ${c.iconBg}`}>
                  <i className={`ti ${c.icon}`}></i>
                </div>
                <span className={`academic-tag ${c.tagClass}`}>{c.tag}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="syllabus-row">
          <div className="syllabus-badge badge-blue">✅ CBSE Based Syllabus</div>
          <div className="syllabus-badge badge-orange">✅ State Board Syllabus</div>
        </div>
      </div>
    </section>
  );
}
