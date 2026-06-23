"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen({ progress }: { progress: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className="loading-bar" style={{ width: `${progress}%` }} />
          <Image src="/logo.png" alt="SINAPS" width={100} height={100} className="loading-logo" priority />
          <h1 className="loading-title">SINAPS</h1>
          <p className="loading-sub">St. Ignatius Nursery & Primary School</p>
          <div className="loading-pct">{Math.round(progress)}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
