import React from "react";

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-inner">
        <span>🌟 Admissions Open for Vijayadhasami</span>
        <span className="sep">·</span>
        <span>Pre KG to 5th Std</span>
        <span className="sep">·</span>
        <span>CBSE Integrated</span>
        <span className="sep">·</span>
        <a href="tel:+916380656434">
          <i className="ti ti-phone-call" style={{ marginRight: 4 }}></i>
          +91 63806 56434
        </a>
      </div>
    </div>
  );
}
