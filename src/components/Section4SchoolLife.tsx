"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const items = [
  { title: "Cultural Events & Celebrations 🎉", body: "Annual days, sports days, festivals and special events that build community spirit.", img: "/kids-jumping.png" },
  { title: "Active Play & Friendships 🤝", body: "Running, playing, and growing together — building bonds that last a lifetime.", img: "/kids-running.png" },
  { title: "Family & Community 👨‍👩‍👧‍👦", body: "Parents are partners in education. We welcome families into the SINAPS community.", img: "/parent-kids.jpg" },
  { title: "Our Beautiful Campus 🏫", body: "A clean, modern, and welcoming school environment designed for young learners.", img: "/school-building.png" },
];

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } } as const;
const cardV = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 85, damping: 13 } } };

export default function Section4SchoolLife() {
  return (
    <section id="life" className="life-section">
      <div className="section-container">
        <div className="section-header centered">
          <div className="section-eyebrow" style={{ background: "var(--pink-light)", color: "var(--pink)" }}>
            <span>🎈</span> SCHOOL LIFE
          </div>
          <h2>More than lessons —<br />a whole <span style={{ color: "var(--orange)" }}>childhood</span> 🌈</h2>
          <div className="gradient-line" />
          <p className="section-desc">Every day at SINAPS brings new experiences that shape character, build friendships, and create memories that last forever.</p>
        </div>

        <motion.div className="life-grid" variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          {items.map((it, i) => (
            <motion.div key={i} className="life-card" variants={cardV} whileHover={{ y: -6, transition: { duration: 0.2 } }}>
              <Image src={it.img} alt={it.title} width={600} height={220} className="life-card-img" style={{ objectFit: "cover" }} />
              <div className="life-card-body">
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
