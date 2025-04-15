// src/components/ForecastDashboard.jsx
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

const fadeVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -40, transition: { duration: 0.3 } },
};


const endpoints = {
  "7 Day": "lstm_7day.h5",
  "14 Day": "lstm_14day.h5",
  "30 Day": "lstm_30day.h5",
};


export default function WeatherDashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchForecasts = async () => {
      const today = new Date().toISOString().split("T")[0];
      const results = {};

      for (const [label, model] of Object.entries(endpoints)) {
        const res = await fetch("/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: today, model }),
        });
        const json = await res.json();
        results[label] = json;
      }

      setData(results);
    };

    fetchForecasts();
  }, []);

  return (
    <motion.div
  variants={fadeVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  className="p-6 max-w-5xl mx-auto space-y-6"
>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(data).map(([label, forecast]) => (
        <div
          key={label}
          className="bg-gradient-to-br from-indigo-800 to-purple-800 rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold mb-2">{label} Forecast</h2>
          <p className="text-5xl font-extrabold">{forecast.predictedTemp}°C</p>
          <p className="text-sm mt-2 text-gray-200">
            Avg. temperature over the next {label.replace(" Day", "")} days
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Confidence: {forecast.confidenceLevel} ({forecast.confidenceScore})
          </p>
        </div>
      ))}
    </div>

      {/* Your content here */}
</motion.div>

  );
}
