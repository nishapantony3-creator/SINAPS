"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function PhotoMarquee() {
  const images = [
    "/marquee/DSC00059.JPG",
    "/marquee/DSC00097.JPG",
    "/marquee/DSC00108.JPG",
    "/marquee/DSC00120.JPG",
    "/marquee/DSC09202.JPG",
    "/marquee/DSC09214.JPG",
    "/marquee/DSC09558.JPG",
    "/marquee/DSC09928.JPG",
    "/marquee/IMG-20260221-WA0029.jpg",
    "/marquee/IMG-20260221-WA0040.jpg",
    "/marquee/IMG-20260221-WA0046.jpg",
    "/marquee/IMG-20260221-WA0048.jpg",
    "/marquee/IMG-20260221-WA0071.jpg",
    "/marquee/IMG-20260221-WA0100.jpg",
    "/marquee/IMG-20260221-WA0110.jpg",
    "/marquee/IMG-20260221-WA0120.jpg",
    "/marquee/IMG-20260221-WA0121.jpg",
    "/marquee/IMG-20260221-WA0122.jpg",
    "/marquee/IMG-20260221-WA0124.jpg",
    "/marquee/IMG-20260221-WA0133.jpg",
    "/marquee/IMG-20260222-WA0030.jpg",
    "/marquee/IMG-20260222-WA0051.jpg",
    "/marquee/IMG-20260224-WA0024.jpg",
  ];

  // Double the images to create a seamless infinite scroll loop
  const marqueeImages = [...images, ...images, ...images];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const scrollContainer = scrollRef.current;

    const scroll = () => {
      if (scrollContainer && !isHovered) {
        scrollContainer.scrollLeft += 1; // Adjust speed by changing this value
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section className="photo-strip" style={{ overflowX: 'hidden' }}>
      <div 
        className="photo-strip-inner" 
        ref={scrollRef}
        style={{ 
          animation: 'none', 
          overflowX: 'auto', 
          width: '100%', 
          scrollbarWidth: 'none', 
          WebkitOverflowScrolling: 'touch' 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {marqueeImages.map((src, i) => (
          <Image 
            key={i} 
            src={src} 
            alt="School life" 
            width={260} 
            height={180} 
            className="photo-strip-img" 
            style={{ pointerEvents: 'none' }} // Prevents image dragging
          />
        ))}
      </div>
    </section>
  );
}
