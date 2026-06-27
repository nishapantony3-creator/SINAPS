"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";

export default function BusFeesPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>School Bus Transport</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333' }}>
            <h2 style={{ color: 'var(--green)', marginBottom: '15px' }}>₹1,500 / term (Base)</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Safe transportation across Budapadi and Erode areas.</p>
            <p style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
              Note: Bus fees are based on the distance from the school. Please contact us for exact pricing for your location.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✅ Safe & Comfortable Seating</li>
              <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>✅ Female Attendant on Board</li>
              <li style={{ padding: '10px 0' }}>✅ Experienced Drivers</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
