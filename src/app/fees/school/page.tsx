"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";

export default function SchoolFeesPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>School Tuition Fees (2026-27)</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Class</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>2026-27 Fees (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>LKG</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>19,800</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>UKG</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>20,350</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>I</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>20,900</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>II</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>21,450</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>III</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>22,000</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px' }}>IV & V</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>23,100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
