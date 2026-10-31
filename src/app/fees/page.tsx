"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import { motion } from "framer-motion";
import siteContent from "@/data/siteContent.json";

export default function FeesPage() {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 90, damping: 14 } }
  };

  const classList = siteContent.fees?.classList || [];
  const lowestFee = classList.length > 0 ? classList[0].amount : "19,800";
  const highestFee = classList.length > 0 ? classList[classList.length - 1].amount : "23,100";

  const additional = siteContent.fees?.additional || {
    book: {
      title: "Book & Stationery Fees",
      amount: "₹1,500",
      period: "/ year",
      desc: "Complete set of CBSE textbooks, notebooks, and learning kits.",
      features: ["All Textbooks", "School Notebooks", "Art & Craft Supplies"]
    },
    bus: {
      title: "School Bus Transport",
      amount: "₹1,500",
      period: "/ term (Base)",
      desc: "Safe transportation across Budapadi and Erode areas. (Note: based on distance)",
      features: ["Safe & Comfortable Seating", "Female Attendant on Board", "Experienced Drivers"]
    },
    activity: {
      title: "Extracurricular Activities",
      amount: "₹2,000",
      period: "/ year",
      desc: "Sports, music, arts, and special events throughout the year.",
      features: ["Weekly Sports Coaching", "Music & Dance Classes", "Annual Day & Field Trips"]
    },
    note: "Note: Tuition fees are grade-specific (LKG to 5th Std). Bus fees vary by distance. Contact admissions office at +91 63806 56434 for exact breakdown."
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page">
        <section className="fees-hero">
          <div className="fees-hero-inner">
            <h1 className="fees-title">Transparent & Premium Education</h1>
            <p className="fees-subtitle">Fee Structure for Academic Year 2026-2027</p>
          </div>
        </section>

        <section className="fees-content">
          <motion.div className="fees-grid" variants={container} initial="hidden" animate="visible">
            
            {/* 1. School Tuition Fees (Synced with Class Table) */}
            <motion.div className="fee-card card-blue" variants={item}>
              <Link href="/fees/school" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 800, color: 'var(--blue)' }}>
                  View Class-by-Class Table (LKG to 5th) →
                </div>
              </Link>
            </motion.div>

            {/* 2. Book Fees */}
            <motion.div className="fee-card card-orange" variants={item}>
              <Link href="/fees/book" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">📚</div>
                <h3>{additional.book.title}</h3>
                <p className="fee-desc">{additional.book.desc}</p>
                <div className="fee-price">
                  <span className="amount">{additional.book.amount}</span>
                  <span className="period">{additional.book.period}</span>
                </div>
                <ul className="fee-features">
                  {additional.book.features.map((f, i) => (
                    <li key={i}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
              </Link>
            </motion.div>

            {/* 3. Bus Fees */}
            <motion.div className="fee-card card-green" variants={item}>
              <Link href="/fees/bus" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">🚌</div>
                <h3>{additional.bus.title}</h3>
                <p className="fee-desc">{additional.bus.desc}</p>
                <div className="fee-price">
                  <span className="amount">{additional.bus.amount}</span>
                  <span className="period">{additional.bus.period}</span>
                </div>
                <ul className="fee-features">
                  {additional.bus.features.map((f, i) => (
                    <li key={i}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
              </Link>
            </motion.div>

            {/* 4. Activity Fees */}
            <motion.div className="fee-card card-pink" variants={item}>
              <Link href="/fees/activity" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">🎨</div>
                <h3>{additional.activity.title}</h3>
                <p className="fee-desc">{additional.activity.desc}</p>
                <div className="fee-price">
                  <span className="amount">{additional.activity.amount}</span>
                  <span className="period">{additional.activity.period}</span>
                </div>
                <ul className="fee-features">
                  {additional.activity.features.map((f, i) => (
                    <li key={i}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
              </Link>
            </motion.div>

          </motion.div>
          
          <div className="fees-note">
            <i className="ti ti-info-circle"></i>
            <p>{additional.note}</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
