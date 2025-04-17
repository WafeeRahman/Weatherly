import { motion } from "framer-motion";

/* shared */
const base =
  "absolute rounded-[40%] pointer-events-none drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]";

const clouds = [
  /*  w   h  top   left  dur  blur       op  scale  rot */
  [700, 320, "5%", "-25%", 90, "blur-[26px]", 0.35, [1, 1.04, 1], -2],
  [520, 240, "20%", "-30%", 70, "blur-[22px]", 0.4, [1, 1.05, 1],  1],
  [420, 200, "38%", "-28%", 55, "blur-[20px]", 0.45, [1, 1.06, 1], -1],
  [340, 160, "55%", "-32%", 40, "blur-[18px]", 0.5, [1, 1.07, 1],  2],
  [260, 120, "68%", "-38%", 28, "blur-[16px]", 0.55, [1, 1.08, 1], -3],
];

export default function AnimatedClouds() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {clouds.map(
        ([w, h, top, left, dur, blur, op, scale, rot], i) => (
          <motion.div
            key={i}
            className={`${base} ${blur}`}
            style={{
              width: w,
              height: h,
              top,
              left,
              opacity: op,
              background: "#FDFDFD",
              transformOrigin: "50% 50%",
              rotate: `${rot}deg`,
            }}
            animate={{
              x: ["0%", "180%"],
              scale,
            }}
            transition={{
              duration: dur,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        )
      )}

      {/* bold comic horizon line */}
      <motion.div
        className="absolute bottom-[30%] left-0 w-full h-[4px] bg-white/70 shadow-[0_0_6px_2px_rgba(0,0,0,0.8)] pointer-events-none"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
}
