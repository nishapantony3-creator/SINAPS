"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function StatCard({ numStr, label }: { numStr: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);
  const numVal = parseInt(numStr.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = numStr.replace(/[0-9]/g, "");

  useEffect(() => {
    if (!isInView || numVal === 0) return;
    const dur = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = p * (2 - p);
      setCount(Math.floor(ease * numVal));
      if (p < 1) requestAnimationFrame(tick); else setCount(numVal);
    };
    requestAnimationFrame(tick);
  }, [isInView, numVal]);

  return (
    <motion.div ref={ref} className="stat-card" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

export default function Section5Stats() {
  const stats = [
    { numStr: "500+", label: "Happy Students" },
    { numStr: "15+", label: "Qualified Teachers" },
    { numStr: "2", label: "Curriculum Boards" },
    { numStr: "100%", label: "Dedicated to Excellence" },
  ];

  return (
    <section className="stats-section">
      <div className="section-container">
        <div className="section-header centered">
          <h2 style={{ color: "#fff" }}>Numbers that<br /><span style={{ color: "var(--yellow)" }}>speak for themselves</span> ✨</h2>
          <div className="gradient-line" style={{ background: "var(--yellow)" }} />
        </div>
        <div className="stats-grid">
          {stats.map((s, i) => <StatCard key={i} numStr={s.numStr} label={s.label} />)}
        </div>
      </div>
    </section>
  );
}
