import React from "react";
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

  return (
    <section className="photo-strip">
      <div className="photo-strip-inner">
        {marqueeImages.map((src, i) => (
          <Image 
            key={i} 
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
