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

  const overview = siteContent.fees?.overview || {
    tuition: {
      title: "School Tuition Fees",
      amount: "₹18,500",
      period: "/ term",
      desc: "Includes term fees, library access, and standard curriculum materials.",
      features: ["Core Academic Syllabus", "Term Examinations", "Digital Classroom Access"]
    },
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
      period: "/ term",
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
    note: "Note: Fees are subject to minor adjustments based on the specific grade (Pre-KG vs 5th Std). Please contact the admissions office at +91 63806 56434 for a personalized fee breakdown for your child."
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
            
            {/* School Fees */}
            <motion.div className="fee-card card-blue" variants={item}>
              <Link href="/fees/school" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">🎓</div>
                <h3>{overview.tuition.title}</h3>
                <p className="fee-desc">{overview.tuition.desc}</p>
                <div className="fee-price">
                  <span className="amount">{overview.tuition.amount}</span>
                  <span className="period">{overview.tuition.period}</span>
                </div>
                <ul className="fee-features">
                  {overview.tuition.features.map((f, i) => (
                    <li key={i}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--blue)' }}>
                  Click to view Class-wise breakdown (LKG to 5th) →
                </div>
              </Link>
            </motion.div>

            {/* Book Fees */}
            <motion.div className="fee-card card-orange" variants={item}>
              <Link href="/fees/book" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">📚</div>
                <h3>{overview.book.title}</h3>
                <p className="fee-desc">{overview.book.desc}</p>
                <div className="fee-price">
                  <span className="amount">{overview.book.amount}</span>
                  <span className="period">{overview.book.period}</span>
                </div>
                <ul className="fee-features">
                  {overview.book.features.map((f, i) => (
                    <li key={i}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
              </Link>
            </motion.div>

            {/* Bus Fees */}
            <motion.div className="fee-card card-green" variants={item}>
              <Link href="/fees/bus" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">🚌</div>
                <h3>{overview.bus.title}</h3>
                <p className="fee-desc">{overview.bus.desc}</p>
                <div className="fee-price">
                  <span className="amount">{overview.bus.amount}</span>
                  <span className="period">{overview.bus.period}</span>
                </div>
                <ul className="fee-features">
                  {overview.bus.features.map((f, i) => (
                    <li key={i}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
              </Link>
            </motion.div>

            {/* Activity Fees */}
            <motion.div className="fee-card card-pink" variants={item}>
              <Link href="/fees/activity" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">🎨</div>
                <h3>{overview.activity.title}</h3>
                <p className="fee-desc">{overview.activity.desc}</p>
                <div className="fee-price">
                  <span className="amount">{overview.activity.amount}</span>
                  <span className="period">{overview.activity.period}</span>
                </div>
                <ul className="fee-features">
                  {overview.activity.features.map((f, i) => (
                    <li key={i}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
              </Link>
            </motion.div>

          </motion.div>
          
          <div className="fees-note">
            <i className="ti ti-info-circle"></i>
            <p>{overview.note}</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
