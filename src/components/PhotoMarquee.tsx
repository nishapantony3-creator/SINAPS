"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import siteContent from "@/data/siteContent.json";

export default function PhotoMarquee() {
  const images = siteContent.marquee || [];
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="photo-strip" style={{ overflowX: "hidden" }}>
      <div 
        ref={marqueeRef}
        className="photo-strip-inner"
        style={{
          animation: isMobile ? "none" : undefined,
          overflowX: isMobile ? "auto" : undefined,
          width: isMobile ? "100%" : undefined,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Render twice for seamless continuous scroll on desktop */}
        {images.map((src, i) => (
          <Image
            key={`img-1-${i}`}
            src={src}
            alt="School life"
            width={260}
            height={180}
            className="photo-strip-img"
            style={{ pointerEvents: isMobile ? "none" : "auto" }}
          />
        ))}
        {!isMobile && images.map((src, i) => (
          <Image
            key={`img-2-${i}`}
            src={src}
            alt="School life"
            width={260}
            height={180}
            className="photo-strip-img"
          />
        ))}
      </div>
    </section>
  );
}
