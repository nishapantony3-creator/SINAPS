"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import siteContent from "@/data/siteContent.json";

export default function ActivityFeesPage() {
  const activityList = siteContent.fees?.activityList || [
    { activityName: "Sports & Athletic Coaching", amount: "1,500" },
    { activityName: "Music, Dance & Fine Arts", amount: "1,200" },
    { activityName: "Karate, Yoga & Physical Fitness", amount: "1,000" },
    { activityName: "Annual Day & Educational Field Trips", amount: "800" }
  ];

  const activity = siteContent.fees?.additional?.activity || {
    title: "Extracurricular Activities",
    desc: "Holistic development programs fostering physical, creative, and intellectual talents.",
    features: ["Weekly Professional Coaching", "Competitions & Tournaments", "Stage Performance Training", "Certificates & Medals"]
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>{activity.title}</h1>
          
          <div style={{ maxWidth: '650px', margin: '0 auto', background: '#fff', borderRadius: '20px', padding: '32px', color: '#333', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: '1.05rem', color: '#64748B', marginBottom: '20px', textAlign: 'center' }}>
              {activity.desc}
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#fdf2f8', borderBottom: '2px solid #fbcfe8' }}>
                  <th style={{ padding: '14px', textAlign: 'left', fontWeight: 800 }}>Activity Program</th>
                  <th style={{ padding: '14px', textAlign: 'right', fontWeight: 800 }}>Annual Fees (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {activityList.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: idx === activityList.length - 1 ? 'none' : '1px solid #fdf2f8' }}>
                    <td style={{ padding: '14px', fontWeight: 600 }}>{item.activityName}</td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 800, color: 'var(--pink)' }}>
                      {item.amount.startsWith('₹') ? item.amount : `₹${item.amount}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#9d174d', fontSize: '0.95rem', fontWeight: 800 }}>
                🎨 Key Program Highlights:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', color: '#be185d' }}>
                {activity.features.map((feat, idx) => (
                  <li key={idx}>⭐ {feat}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
