import React from "react";
import Image from "next/image";

export default function PhotoMarquee() {
  const images = [
    "/scroll-img-1.png",
    "/scroll-img-2.png",
    "/scroll-img-3.png",
    "/scroll-img-4.png",
    "/scroll-img-5.png",
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
