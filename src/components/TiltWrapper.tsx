"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltWrapper({ children, className = "" }: TiltWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse coords relative to card: normalized from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map normalized coordinates to rotation angles (degrees)
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]); 
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]); 

  // Smooth springs for motion values
  const springConfig = { damping: 22, stiffness: 160, mass: 0.6 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position of cursor relative to element
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates to [-0.5, 0.5]
    const relativeX = (mouseX / width) - 0.5;
    const relativeY = (mouseY / height) - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-wrapper ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
