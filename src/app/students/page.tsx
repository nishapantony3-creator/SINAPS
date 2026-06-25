"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";

export default function StudentsPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Student Details</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333' }}>
            <h2 style={{ color: 'var(--blue)', marginBottom: '15px', textAlign: 'center' }}>170 Happy Students</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px', textAlign: 'center' }}>
              Our diverse student body spans from Pre-KG to 5th Standard, learning and growing in a joyful, student-centered environment.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '10px', minWidth: '150px' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--orange)', margin: '0 0 10px 0' }}>Pre-Primary</h3>
                <p style={{ margin: 0 }}>LKG & UKG</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '10px', minWidth: '150px' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--green)', margin: '0 0 10px 0' }}>Primary</h3>
                <p style={{ margin: 0 }}>Classes I to V</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
