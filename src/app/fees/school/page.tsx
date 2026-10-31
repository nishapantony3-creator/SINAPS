"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import siteContent from "@/data/siteContent.json";

export default function SchoolFeesPage() {
  const classList = siteContent.fees?.classList || [
    { standard: "LKG", amount: "19,800" },
    { standard: "UKG", amount: "20,350" },
    { standard: "I", amount: "20,900" },
    { standard: "II", amount: "21,450" },
    { standard: "III", amount: "22,000" },
    { standard: "IV", amount: "23,100" },
    { standard: "V", amount: "23,100" }
  ];

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>School Tuition Fees (2026-27)</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333', boxShadow: 'var(--shadow-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 800 }}>Class</th>
                  <th style={{ padding: '15px', textAlign: 'right', fontWeight: 800 }}>2026-27 Fees (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {classList.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: idx === classList.length - 1 ? 'none' : '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 600 }}>{item.standard}</td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 700, color: 'var(--blue-dark)' }}>
                      {item.amount.startsWith('₹') ? item.amount : `₹${item.amount}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
