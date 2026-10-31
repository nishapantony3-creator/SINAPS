"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import siteContent from "@/data/siteContent.json";

export default function BusFeesPage() {
  const bus = siteContent.fees?.additional?.bus || {
    title: "School Bus Transport",
    amount: "₹1,500",
    period: "/ term (Base)",
    desc: "Safe transportation across Budapadi and Erode areas.",
    features: ["Safe & Comfortable Seating", "Female Attendant on Board", "Experienced Drivers"]
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>{bus.title}</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ color: 'var(--green)', marginBottom: '15px' }}>{bus.amount} {bus.period}</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{bus.desc}</p>
            <p style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
              Note: Bus fees are based on the distance from the school. Please contact us for exact pricing for your location.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {bus.features.map((feat, idx) => (
                <li key={idx} style={{ padding: '10px 0', borderBottom: idx === bus.features.length - 1 ? 'none' : '1px solid #eee' }}>
                  ✅ {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
