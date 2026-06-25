"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";

export default function BookFeesPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Book & Stationery Fees</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333' }}>
            <h2 style={{ color: 'var(--orange)', marginBottom: '15px' }}>₹1,500 / year</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Complete set of CBSE textbooks, notebooks, and learning kits.</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✅ All Textbooks</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✅ School Notebooks</li>
              <li style={{ padding: '10px 0' }}>✅ Art & Craft Supplies</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
