"use client";

import React from "react";
import { motion } from "framer-motion";

const cards = [
  { title: "Student-Centered Learning", icon: "ti-heart-handshake", body: "Every lesson is designed around how children learn best — with curiosity, play, and genuine care.", color: "orange", cardColor: "card-orange" },
  { title: "Safe & Nurturing Campus", icon: "ti-shield-heart", body: "A warm, secure environment where every child feels valued, respected, and excited to come to school.", color: "blue", cardColor: "card-blue" },
  { title: "Passionate Educators", icon: "ti-star", body: "Dedicated, qualified teachers who inspire children to discover their talents and reach their potential.", color: "green", cardColor: "card-green" },
  { title: "Modern Facilities", icon: "ti-building-castle", body: "Well-equipped classrooms and play areas that spark creativity and make learning an adventure.", color: "pink", cardColor: "card-pink" },
  { title: "CBSE Integrated Syllabus", icon: "ti-certificate", body: "A balanced, rigorous curriculum that builds strong academic foundations for every student.", color: "purple", cardColor: "card-purple" },
];

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } } as const;
const cardV = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 90, damping: 14 } } };

export default function Section2WhyUs() {
  return (
    <section id="why" className="why-section">
      <div className="section-container">
        <div className="section-header centered">
          <div className="section-eyebrow" style={{ background: "var(--blue-light)", color: "var(--blue)" }}>
            <span>💡</span> WHY CHOOSE US
          </div>
          <h2>Five reasons families<br />love <span style={{ color: "var(--orange)" }}>SINAPS</span> 🧡</h2>
          <div className="gradient-line" />
          <p className="section-desc">At St. Ignatius, every child gets the safe, inspiring, and high-quality start they deserve.</p>
        </div>

        <motion.div className="why-grid" variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          {cards.map((c, i) => (
            <motion.div key={i} className={`why-card ${c.cardColor}`} variants={cardV} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
              <div className={`why-icon icon-${c.color}`}>
                <i className={`ti ${c.icon}`}></i>
              </div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
