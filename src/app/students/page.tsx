"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import siteContent from "@/data/siteContent.json";

export default function StudentsPage() {
  const students = siteContent.students || {
    totalCount: "170 Happy Students",
    desc: "Our diverse student body spans from Pre-KG to 5th Standard, learning and growing in a joyful, student-centered environment.",
    prePrimaryLabel: "Pre-Primary",
    prePrimarySub: "LKG & UKG",
    primaryLabel: "Primary",
    primarySub: "Classes I to V"
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Student Details</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ color: 'var(--blue)', marginBottom: '15px', textAlign: 'center' }}>{students.totalCount}</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px', textAlign: 'center' }}>
              {students.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '10px', minWidth: '150px' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--orange)', margin: '0 0 10px 0' }}>{students.prePrimaryLabel}</h3>
                <p style={{ margin: 0 }}>{students.prePrimarySub}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '10px', minWidth: '150px' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--green)', margin: '0 0 10px 0' }}>{students.primaryLabel}</h3>
                <p style={{ margin: 0 }}>{students.primarySub}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
