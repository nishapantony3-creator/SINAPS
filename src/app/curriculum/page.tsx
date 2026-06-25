"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";

export default function CurriculumPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Curriculum Boards</h1>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333' }}>
            <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '40px' }}>
              We offer a blended curriculum incorporating the best of State and CBSE patterns.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '15px', borderTop: '5px solid var(--blue)' }}>
                <h2 style={{ color: 'var(--blue)', marginBottom: '15px' }}>CBSE Integrated</h2>
                <p>
                  A robust, nationally recognized framework that emphasizes critical thinking, problem-solving, and conceptual understanding.
                </p>
              </div>
              
              <div style={{ padding: '30px', border: '1px solid #eee', borderRadius: '15px', borderTop: '5px solid var(--green)' }}>
                <h2 style={{ color: 'var(--green)', marginBottom: '15px' }}>State Board</h2>
                <p>
                  Rooted in local context and culture, providing a strong foundation in regional language and state-specific educational standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
