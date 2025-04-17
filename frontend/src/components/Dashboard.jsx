import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ForecastCard from "./ForecastCard";
import { Button, CircularProgress } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AnimatedSun from "./AnimatedSun";
import AnimatedClouds from "./AnimatedClouds";

/* ----- convenience: nicely‑formatted “today” ----- */
const todayStr = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const Dashboard = ({ forecasts, loadingStatus, onSelect, onCustomDate }) => {
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [typedExplanation, setTypedExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef(null);

  const lstmDescriptions = {
    7: "LSTM Model: Predicts average temperature over the next 7 days.",
    14: "LSTM Model: Predicts average temperature over the next 14 days.",
    30: "LSTM Model: Predicts average temperature over the next 30 days.",
  };

  /* ---------- handlers ---------- */
  const handleSelect = (days) => {
    const forecast = forecasts[days];
    setSelectedForecast({ ...forecast, days });
    setTypedExplanation("");
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleBack = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setSelectedForecast(null);
    setTypedExplanation("");
  };

  /* ---------- typewriter effect ---------- */
useEffect(() => {
  if (!selectedForecast?.explanation || loading) return;

  setTypedExplanation("");              // reset
  const full = selectedForecast.explanation;
  let i = 0;

  const tick = () => {
    i += 1;
    setTypedExplanation(full.slice(0, i));   // ⚡ build by slice
    if (i < full.length) typingTimeoutRef.current = setTimeout(tick, 20);
  };

  typingTimeoutRef.current = setTimeout(tick, 20);
  return () => clearTimeout(typingTimeoutRef.current);
}, [selectedForecast, loading]);

  /* ---------- component ---------- */
  return (
    <div className="relative min-h-screen w-full px-4 py-16 overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white font-sans">
      <AnimatedSun />       {/* z‑0 (behind everything) */}
      <AnimatedClouds />

      <AnimatePresence mode="wait">
        {/* ================= DASHBOARD ================= */}
        {!selectedForecast ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center w-full"
          >
            {/* header */}
            <div className="max-w-4xl w-full text-center space-y-4 z-10">
              <h1 className="text-5xl font-extrabold tracking-tight">
                Weatherly&nbsp;&mdash; Your Machine Learning Meteorologist
              </h1>
              <p className="text-md text-gray-400">{todayStr}</p>
              <p className="text-lg text-gray-300">
                Click a card for more details.
              </p>
            </div>

            {/* forecast cards */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 max-w-6xl w-full z-10">
              {[7, 14, 30].map((d) => (
                <motion.button
                  key={d}
                  onClick={() => handleSelect(d)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-shrink-0 focus:outline-none"
                >
                  <ForecastCard
                    days={d}
                    forecast={forecasts[d]}
                    description={lstmDescriptions[d]}
                    loading={loadingStatus[d]}
                  />
                </motion.button>
              ))}
            </div>

            {/* custom‑date button */}
            <motion.button
              layoutId="custom-button"
              onClick={onCustomDate}
              whileTap={{ scale: 1.15 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="mt-12 px-8 py-3 bg-[#62BFED] text-black font-semibold rounded-xl shadow-md hover:bg-[#4BA8D8] transition-all z-10"
            >
              🎯 Pick a Custom Date
            </motion.button>
          </motion.div>
        ) : (
          /* ================= DETAILS VIEW ================= */
          /* A fixed, full‑viewport flexbox so the card is ALWAYS centred */
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-20 flex flex-col md:flex-row
                       items-center justify-center gap-12 p-4"
          >
            {/* selected card */}
            <motion.div
              layout
              className="bg-[#121212] p-6 rounded-3xl shadow-[0_0_30px_rgba(98,191,237,0.4)]
                         text-white w-full md:max-w-md flex flex-col items-center"
            >
              <h3 className="text-xl font-bold mb-2">
                {selectedForecast.days}-Day Forecast
              </h3>
              <WbSunnyIcon style={{ fontSize: 56, color: "#FDB813" }} />
              <p className="text-4xl font-extrabold text-[#62BFED] mt-4">
                {selectedForecast.predictedTemp}°C
              </p>
              <p className="text-sm italic text-gray-400 mt-1">
                {lstmDescriptions[selectedForecast.days]}
              </p>
              <Button
                onClick={handleBack}
                className="mt-6 text-white border border-[#62BFED]"
                variant="outlined"
              >
                ← Back to Dashboard
              </Button>
            </motion.div>

            {/* explanation panel */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-[#181818] text-white rounded-3xl shadow-[0_0_25px_rgba(98,191,237,0.4)]
                         p-6 w-full md:max-w-lg"
            >
              <h3 className="text-xl font-bold text-[#62BFED] mb-4">
                Forecast Details
              </h3>
              <p>
                <strong>Model:</strong> {selectedForecast.modelUsed}
              </p>
              <p>
                <strong>Confidence:</strong> {selectedForecast.confidenceLevel} (
                {selectedForecast.confidenceScore})
              </p>

              <h4 className="mt-4 mb-2 font-semibold">LLM Explanation:</h4>
              {loading ? (
                <div className="flex justify-center mt-4">
                  <CircularProgress size={32} style={{ color: "#62BFED" }} />
                </div>
              ) : (
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="whitespace-pre-wrap font-mono text-sm text-[#62BFED]
                             bg-black/20 rounded-md p-3 border border-[#62BFED] mt-2"
                >
                  {typedExplanation}
                </motion.pre>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
