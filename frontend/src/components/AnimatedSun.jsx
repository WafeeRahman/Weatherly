import React from "react";
import { motion } from "framer-motion";

// Convenience: Tailwind blur sizes are tiny; custom util class is cleaner ↓
const glow = "blur-[100px]";

/**
 * AnimatedSun
 * Stick it anywhere with position‑relative parent OR keep absolute as you had.
 */
export default function AnimatedSun() {
  return (
    <motion.div
      className="absolute -top-[260px] left-1/2 -translate-x-1/2 pointer-events-none z-0"
      animate={{
        y: [0, 15, 0],                  // ☁ gentle bob
      }}
      transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
    >
      {/* 1️⃣ Radiating gradient core */}
      <motion.div
        className={`relative w-[420px] h-[420px] rounded-full ${glow}`}
        style={{
          background: "radial-gradient(circle at 50% 50%, #FFE959 0%, #FDB813 40%, #FF9A00 75%)",
        }}
        animate={{
          scale: [1, 1.06, 1],
          rotate: [0, 15, 0],           // tiny wobble
          filter: [
            "hue-rotate(0deg)",         // colour pulse
            "hue-rotate(-10deg)",
            "hue-rotate(0deg)",
          ],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* 2️⃣ Outer slow‑spin corona */}
      <motion.div
        className="absolute inset-0 rounded-full ring-2 ring-yellow-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, ease: "linear", repeat: Infinity }}
      />

      {/* 3️⃣ Inner faster counter‑spin corona */}
      <motion.div
        className="absolute inset-[40px] rounded-full ring-[1px] ring-yellow-200/25"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      />

      {/* 4️⃣ Conic‑gradient rays */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "conic-gradient(from 0deg, transparent 0deg 10deg, rgba(255,255,255,0.25) 10deg 12deg, transparent 12deg 22deg)",
        }}
        animate={{ rotate: 360, opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 50, ease: "linear", repeat: Infinity }}
      />

      {/* 5️⃣ Solar flare arcs */}
      {[
        { size: 520, dur: 24, delay: 0 },
        { size: 580, dur: 30, delay: 6 },
        { size: 640, dur: 36, delay: 12 },
      ].map(({ size, dur, delay }, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-[50%] border-t-2 border-yellow-300/30"
          style={{
            width: size,
            height: size,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ rotate: -10 }}
          animate={{ rotate: 350 }}
          transition={{
            duration: dur,
            ease: "linear",
            repeat: Infinity,
            delay,
          }}
        />
      ))}
    </motion.div>
  );
}
