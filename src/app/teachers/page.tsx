"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import siteContent from "@/data/siteContent.json";

interface Teacher {
  name: string;
  qualification: string;
  role?: string;
}

export default function TeachersPage() {
  const teachers: Teacher[] = siteContent.teachers || [];

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Our Teachers</h1>
          <div style={{ maxWidth: '850px', margin: '0 auto', background: '#fff', borderRadius: '20px', padding: '35px', color: '#333', boxShadow: 'var(--shadow-card)' }}>
            <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '30px', fontWeight: 600 }}>
              Meet our dedicated team of educators shaping young minds.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {teachers.map((t: Teacher, i: number) => (
                <div key={i} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '14px', textAlign: 'center', background: 'var(--bg-cream)' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: 'var(--blue-dark)', fontSize: '1.1rem' }}>{t.name}</h3>
                  <p style={{ margin: '0 0 6px 0', color: 'var(--blue)', fontWeight: 700, fontSize: '0.9rem' }}>{t.qualification}</p>
                  {t.role && <span style={{ display: 'inline-block', background: 'var(--orange-light)', color: 'var(--orange)', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '100px' }}>{t.role}</span>}
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
