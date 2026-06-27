import React from "react";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="section-container">
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--navy)" }}>Privacy Policy</h1>
            <p style={{ marginBottom: "2rem", color: "var(--text-light)" }}>Last updated: {new Date().toLocaleDateString()}</p>
            
            <div style={{ lineHeight: "1.8", color: "var(--text-main)" }}>
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>1. Information We Collect</h2>
              <p>Welcome to St. Ignatius Nursery & Primary School (SINAPS). We respect your privacy and are committed to protecting the personal information you share with us. When you use our website, we may collect basic information such as your name, email address, and phone number if you choose to contact us through our forms or email.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>2. How We Use Your Information</h2>
              <p>Any information collected is used solely for the purpose of communicating with you regarding admissions, school events, or responding to your inquiries. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>3. Data Security</h2>
              <p>We implement standard security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>4. Changes to This Policy</h2>
              <p>We may update our Privacy Policy from time to time. Any changes will be posted on this page. We encourage you to review this policy periodically.</p>
              
              <h2 style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem", color: "var(--navy)" }}>5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at: <strong>sinapsschool@yahoo.com</strong></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
