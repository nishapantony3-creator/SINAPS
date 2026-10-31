"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import siteContent from "@/data/siteContent.json";

export default function BusFeesPage() {
  const busStops = siteContent.fees?.busStops || [
    { stopName: "Budapadi Local (0 – 3 KM)", amount: "1,500" },
    { stopName: "Anthiyur / Ammapettai (3 – 8 KM)", amount: "2,500" },
    { stopName: "Bhavani / Athani (8 – 15 KM)", amount: "3,500" }
  ];

  const bus = siteContent.fees?.additional?.bus || {
    title: "School Bus Transport",
    desc: "Safe, comfortable, and punctual transportation across Budapadi and nearby areas.",
    features: ["Safe & Comfortable Seating", "Female Attendant on Board", "Experienced & Verified Drivers", "Daily Sanitized Vehicles"]
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>{bus.title}</h1>
          
          <div style={{ maxWidth: '650px', margin: '0 auto', background: '#fff', borderRadius: '20px', padding: '32px', color: '#333', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: '1.05rem', color: '#64748B', marginBottom: '20px', textAlign: 'center' }}>
              {bus.desc}
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px', textAlign: 'left', fontWeight: 800 }}>Bus Stop / Route</th>
                  <th style={{ padding: '14px', textAlign: 'right', fontWeight: 800 }}>Term Fees (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {busStops.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: idx === busStops.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: 600 }}>{item.stopName}</td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 800, color: 'var(--green)' }}>
                      {item.amount.startsWith('₹') ? item.amount : `₹${item.amount}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '0.95rem', fontWeight: 800 }}>
                🚌 Safety & Facilities on Every Bus:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', color: '#15803d' }}>
                {bus.features.map((feat, idx) => (
                  <li key={idx}>✅ {feat}</li>
                ))}
              </ul>
            </div>

            <p style={{ background: '#fff3cd', color: '#856404', padding: '12px 16px', borderRadius: '10px', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>
              Note: Bus fees are distance-based. Contact the school transport incharge at <strong>+91 63806 56434</strong> to register your stop.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
