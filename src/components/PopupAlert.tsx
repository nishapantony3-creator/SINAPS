"use client";

import React, { useState } from "react";
import siteContent from "@/data/siteContent.json";

export default function PopupAlert() {
  const { popupAlert } = siteContent;
  const [isOpen, setIsOpen] = useState(popupAlert?.enabled || false);

  if (!isOpen || !popupAlert?.enabled) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.7)",
      backdropFilter: "blur(6px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "24px",
        maxWidth: "480px",
        width: "100%",
        padding: "30px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        border: "3px solid var(--yellow)",
        position: "relative",
      }}>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            fontWeight: 800,
            color: "#64748b",
          }}
        >
          ✕
        </button>

        <span style={{
          display: "inline-block",
          background: "var(--orange-light)",
          color: "var(--orange)",
          fontSize: "12px",
          fontWeight: 800,
          padding: "4px 12px",
          borderRadius: "100px",
          marginBottom: "12px",
        }}>
          Campus Announcement
        </span>

        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "20px",
          fontWeight: 900,
          color: "var(--blue-dark)",
          marginBottom: "10px",
        }}>
          {popupAlert.title}
        </h3>

        <p style={{
          fontSize: "14px",
          color: "#475569",
          lineHeight: 1.6,
          marginBottom: "20px",
        }}>
          {popupAlert.message}
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <a
            href={popupAlert.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: "none", padding: "10px 20px", fontSize: "13px" }}
          >
            {popupAlert.ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}
