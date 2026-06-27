"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import { motion } from "framer-motion";

export default function FeesPage() {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 90, damping: 14 } }
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
                <h3>School Tuition Fees</h3>
                <p className="fee-desc">Includes term fees, library access, and standard curriculum materials.</p>
              <div className="fee-price">
                <span className="amount">₹18,500</span>
                <span className="period">/ term</span>
              </div>
              <ul className="fee-features">
                <li><i className="ti ti-check"></i> Core Academic Syllabus</li>
                <li><i className="ti ti-check"></i> Term Examinations</li>
                <li><i className="ti ti-check"></i> Digital Classroom Access</li>
              </ul>
              </Link>
            </motion.div>

            {/* Book Fees */}
            <motion.div className="fee-card card-orange" variants={item}>
              <Link href="/fees/book" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">📚</div>
                <h3>Book & Stationery Fees</h3>
                <p className="fee-desc">Complete set of CBSE textbooks, notebooks, and learning kits.</p>
                <div className="fee-price">
                  <span className="amount">₹1,500</span>
                  <span className="period">/ year</span>
                </div>
              <ul className="fee-features">
                <li><i className="ti ti-check"></i> All Textbooks</li>
                <li><i className="ti ti-check"></i> School Notebooks</li>
                <li><i className="ti ti-check"></i> Art & Craft Supplies</li>
              </ul>
              </Link>
            </motion.div>

            {/* Bus Fees */}
            <motion.div className="fee-card card-green" variants={item}>
              <Link href="/fees/bus" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">🚌</div>
                <h3>School Bus Transport</h3>
                <p className="fee-desc">Safe transportation across Budapadi and Erode areas. (Note: based on distance)</p>
                <div className="fee-price">
                  <span className="amount">₹1,500</span>
                  <span className="period">/ term</span>
                </div>
              <ul className="fee-features">
                <li><i className="ti ti-check"></i> Safe & Comfortable Seating</li>
                <li><i className="ti ti-check"></i> Female Attendant on Board</li>
                <li><i className="ti ti-check"></i> Experienced Drivers</li>
              </ul>
              </Link>
            </motion.div>

            {/* Activity Fees */}
            <motion.div className="fee-card card-pink" variants={item}>
              <Link href="/fees/activity" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="fee-icon">🎨</div>
                <h3>Extracurricular Activities</h3>
                <p className="fee-desc">Sports, music, arts, and special events throughout the year.</p>
                <div className="fee-price">
                  <span className="amount">₹2,000</span>
                  <span className="period">/ year</span>
                </div>
              <ul className="fee-features">
                <li><i className="ti ti-check"></i> Weekly Sports Coaching</li>
                <li><i className="ti ti-check"></i> Music & Dance Classes</li>
                <li><i className="ti ti-check"></i> Annual Day & Field Trips</li>
              </ul>
              </Link>
            </motion.div>

          </motion.div>
          
          <div className="fees-note">
            <i className="ti ti-info-circle"></i>
            <p>Note: Fees are subject to minor adjustments based on the specific grade (Pre-KG vs 5th Std). Please contact the admissions office at <strong>+91 63806 56434</strong> for a personalized fee breakdown for your child.</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
