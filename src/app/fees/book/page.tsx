"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import FloatingShapes from "@/components/FloatingShapes";
import siteContent from "@/data/siteContent.json";

export default function BookFeesPage() {
  const book = siteContent.fees?.overview?.book || {
    title: "Book & Stationery Fees",
    amount: "₹1,500",
    period: "/ year",
    desc: "Complete set of CBSE textbooks, notebooks, and learning kits.",
    features: ["All Textbooks", "School Notebooks", "Art & Craft Supplies"]
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <FloatingShapes />
      
      <main className="fees-page" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="section-container">
          <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>{book.title}</h1>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '15px', padding: '30px', color: '#333', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ color: 'var(--orange)', marginBottom: '15px' }}>{book.amount} {book.period}</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{book.desc}</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {book.features.map((feat, idx) => (
                <li key={idx} style={{ padding: '10px 0', borderBottom: idx === book.features.length - 1 ? 'none' : '1px solid #eee' }}>
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
