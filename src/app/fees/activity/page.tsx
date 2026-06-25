"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";

export default function ActivityFeesPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Extracurricular Activities</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333' }}>
            <h2 style={{ color: 'var(--pink)', marginBottom: '15px' }}>₹2,000 / year</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Sports, music, arts, and special events throughout the year.</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✅ Weekly Sports Coaching</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✅ Music & Dance Classes</li>
              <li style={{ padding: '10px 0' }}>✅ Annual Day & Field Trips</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
