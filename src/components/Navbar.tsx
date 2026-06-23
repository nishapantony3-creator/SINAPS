"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#why" },
    { name: "Academics", href: "/#academics" },
    { name: "School Life", href: "/#life" },
    { name: "Fees", href: "/fees" },
    { name: "Admissions", href: "/#admissions" },
    { name: "Contact", href: "/#footer" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <Logo size={48} showText />
        </a>

        <div className="navbar-links">
          {links.map((l) => (
            <a key={l.name} href={l.href} className="navbar-link">{l.name}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/#admissions" className="btn-primary navbar-cta">Enroll Now →</a>
          <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <i className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"}`}></i>
          </button>
        </div>
      </div>

      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-links">
          {links.map((l) => (
            <a key={l.name} href={l.href} className="mobile-drawer-link" onClick={() => setMenuOpen(false)}>{l.name}</a>
          ))}
          <a href="/#admissions" className="btn-primary mobile-drawer-cta" onClick={() => setMenuOpen(false)}>Enroll Now →</a>
        </div>
      </div>
    </nav>
  );
}
