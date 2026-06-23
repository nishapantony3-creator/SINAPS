"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FloatingShapes() {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress (0 to 1) into vertical movement and rotation
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -350]);
  
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <div className="global-shapes-container">
      <motion.div className="shape shape-1" style={{ y: y1, rotate: rotate1 }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
      </motion.div>
      
      <motion.div className="shape shape-2" style={{ y: y2, rotate: rotate2 }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--blue)" stroke="none"><circle cx="12" cy="12" r="10"></circle></svg>
      </motion.div>
      
      <motion.div className="shape shape-3" style={{ y: y3, rotate: rotate1 }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"></rect></svg>
      </motion.div>
      
      <motion.div className="shape shape-4" style={{ y: y4, rotate: rotate2 }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="var(--yellow)" stroke="none"><path d="M2 12h20M12 2v20" stroke="var(--yellow)" strokeWidth="3" strokeLinecap="round"/></svg>
      </motion.div>
      
      <motion.div className="shape shape-5" style={{ y: y5, rotate: rotate1 }}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path></svg>
      </motion.div>
    </div>
  );
}
