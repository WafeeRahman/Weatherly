import { FaSun, FaCloudSun, FaSnowflake } from "react-icons/fa";

 function getCardTheme(temp = 0) {
  if (temp >= 20)
    return {
      icon: <FaSun className="text-yellow-200 drop-shadow-sm" />,
      gradient: "from-[#FF512F] via-[#F09819] to-[#FF512F]",
      ring: "ring-[#F9A825]/40",
    };

  if (temp >= 10)
    return {
      icon: <FaCloudSun className="text-orange-200 drop-shadow-sm" />,
      gradient: "from-[#F6D365] via-[#FDA085] to-[#F6D365]",
      ring: "ring-[#FFB74D]/40",
    };

  return {
    icon: <FaSnowflake className="text-blue-200 drop-shadow-sm" />,
    gradient: "from-[#2193b0] via-[#6dd5ed] to-[#2193b0]",
    ring: "ring-[#64B5F6]/40",
  };
}

import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";


export default function ForecastCard({ days, forecast = {}, loading, description }) {
  const { icon, gradient, ring } = getCardTheme(forecast.predictedTemp);

  /* ---------- skeleton while loading ---------- */
  if (loading) {
    return (
      <motion.div
        className="relative w-72 h-72 rounded-3xl overflow-hidden
                   bg-[#1f2937]/60 backdrop-blur
                   before:absolute before:inset-0 before:bg-gradient-to-r
                   before:from-transparent before:via-white/10 before:to-transparent
                   before:animate-[shimmer_2s_linear_infinite]"
      >
        <div className="flex h-full w-full items-center justify-center">
          <CircularProgress size={42} />
        </div>
      </motion.div>
    );
  }

  /* ---------- final card ---------- */
  return (
    <motion.div
      whileHover={{ scale: 1.03, rotateX: 4, rotateY: -4 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        "relative w-72 h-72 p-6 rounded-3xl text-center select-none",
        "bg-[#1f2937]/60 backdrop-blur ring-2 shadow-xl",
        ring
      )}
    >
      {/* Animated glowing border */}
      <motion.div
        className={clsx(
          "absolute -inset-[2px] rounded-[inherit] z-[-1] animate-pulse-slow",
          `bg-gradient-to-br ${gradient}`
        )}
        style={{ filter: "blur(10px) opacity(0.55)" }}
      />

      {/* Title */}
      <h2 className="text-lg font-bold tracking-wide">{days}-Day Forecast</h2>

      {/* Centered icon + temp + caption */}
      <div className="flex flex-col items-center justify-center flex-1 gap-2">
        {/* Bigger icon */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="text-7xl sm:text-8xl"
        >
          {icon}
        </motion.div>

        {/* Temperature */}
        <p className="text-5xl font-extrabold text-[#62BFED] drop-shadow-md">
          {forecast.predictedTemp}°C
        </p>

        {/* Model caption */}
        <p className="text-xs italic text-gray-300 leading-snug px-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
}