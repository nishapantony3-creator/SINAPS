"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";

export default function TeachersPage() {
  const teachers = [
    { name: "Mrs. Anitha R.", qualification: "M.A., B.Ed." },
    { name: "Mr. Suresh K.", qualification: "M.Sc., B.Ed." },
    { name: "Mrs. Lakshmi V.", qualification: "B.A., B.Ed." },
    { name: "Ms. Priya M.", qualification: "M.Com, B.Ed." },
    { name: "Mr. Karthik S.", qualification: "B.Sc., B.Ed." },
    { name: "Mrs. Meena T.", qualification: "M.A., M.Ed." },
    { name: "Ms. Kavya P.", qualification: "B.E., B.Ed." },
    { name: "Mrs. Raji N.", qualification: "B.Sc., D.T.Ed." },
    { name: "Mr. Ramesh D.", qualification: "M.P.Ed." },
    { name: "Mrs. Geetha S.", qualification: "M.Sc., B.Ed." },
  ];

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Our Teachers</h1>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333' }}>
            <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '30px' }}>Meet our dedicated team of 10 qualified educators.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {teachers.map((t, i) => (
                <div key={i} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: 'var(--blue)' }}>{t.name}</h3>
                  <p style={{ margin: 0, color: '#666' }}>{t.qualification}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
