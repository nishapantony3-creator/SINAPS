import React from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="section-container">
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--navy)" }}>Terms of Service</h1>
            <p style={{ marginBottom: "2rem", color: "var(--text-light)" }}>Last updated: {new Date().toLocaleDateString()}</p>
            
            <div style={{ lineHeight: "1.8", color: "var(--text-main)" }}>
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>1. Acceptance of Terms</h2>
              <p>By accessing and using the website of St. Ignatius Nursery & Primary School (SINAPS), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>2. Use of Website Content</h2>
              <p>All content on this website, including text, images, logos, and graphics, is the property of SINAPS unless otherwise noted. You may not reproduce, distribute, or modify any content without prior written permission from the school administration.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>3. Admissions and Information Accuracy</h2>
              <p>While we strive to keep all information on this website up to date, details regarding admissions, fees, and curriculum are subject to change without prior notice. Please contact the school office directly for the most current and official information.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>4. Links to Third-Party Sites</h2>
              <p>Our website may contain links to external sites (such as YouTube or Instagram) for your convenience. SINAPS is not responsible for the content, privacy policies, or practices of any third-party websites.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>5. Limitation of Liability</h2>
              <p>SINAPS shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
