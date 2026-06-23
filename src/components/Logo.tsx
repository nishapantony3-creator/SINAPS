import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  light?: boolean;
}

export default function Logo({ size = 48, showText = true, light = false }: LogoProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Image
        src="/logo.png"
        alt="SINAPS School Logo"
        width={size}
        height={size}
        style={{ borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
        priority
      />
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.15" }}>
          <span style={{
            fontFamily: "var(--font-heading), system-ui, sans-serif",
            fontSize: `${Math.max(14, size * 0.34)}px`,
            fontWeight: 900,
            color: light ? "#fff" : "#1E3A5F",
          }}>
            ST. IGNATIUS
          </span>
          <span style={{
            fontFamily: "var(--font-body), system-ui, sans-serif",
            fontSize: `${Math.max(10, size * 0.22)}px`,
            fontWeight: 600,
            color: light ? "rgba(255,255,255,0.6)" : "#64748B",
          }}>
            Nursery & Primary School
          </span>
        </div>
      )}
    </div>
  );
}
