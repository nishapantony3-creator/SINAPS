import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-accent" />
      <div className="section-container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo-area">
              <Image src="/logo.png" alt="SINAPS" width={48} height={48} className="footer-logo" />
              <div>
                <div className="footer-brand-name">ST. IGNATIUS</div>
                <div className="footer-brand-sub">Nursery & Primary School</div>
              </div>
            </div>
            <p className="footer-desc">St. Ignatius Nursery & Primary School</p>
            <p className="footer-meta">Budapadi · Erode · Tamil Nadu</p>
            <p className="footer-meta">CBSE & ICSE Based · Pre KG to 5th Std</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/sinaps_school_budapadi" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram"><i className="ti ti-brand-instagram"></i></a>
              <a href="https://www.youtube.com/@sinapsschool" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="YouTube"><i className="ti ti-brand-youtube"></i></a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#why">About Us</a></li>
              <li><a href="#academics">Academics</a></li>
              <li><a href="#admissions">Admissions 2026</a></li>
              <li><a href="https://www.youtube.com/@sinapsschool" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Academics</h4>
            <ul className="footer-links">
              <li><a href="#academics">Pre KG & Nursery</a></li>
              <li><a href="#academics">Lower Primary</a></li>
              <li><a href="#academics">Upper Primary (3–5)</a></li>
              <li><a href="#academics">CBSE Curriculum</a></li>
              <li><a href="#academics">ICSE Curriculum</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact">
              <li><a href="tel:+916380656434"><i className="ti ti-phone" style={{ color: "var(--orange)" }}></i> +91 63806 56434</a></li>
              <li><a href="mailto:sinapsschool@yahoo.com"><i className="ti ti-mail" style={{ color: "var(--orange)" }}></i> sinapsschool@yahoo.com</a></li>
              <li className="address"><i className="ti ti-map-pin" style={{ color: "var(--orange)" }}></i><span>Budapadi, Anthiyur Taluk,<br />Erode District - 638 311,<br />Tamil Nadu, India</span></li>
            </ul>
            <div className="footer-badge">🎒 Admissions Open: 2026–2027</div>
          </div>
        </div>

        <hr className="footer-divider" />
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} SINAPS — St. Ignatius Nursery & Primary School. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="dot">·</span>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
