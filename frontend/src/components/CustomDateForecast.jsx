import { useState } from "react";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDateForecast() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setForecast(null);

    const formattedDate = selectedDate.toISOString().split("T")[0];

    const res = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: formattedDate, model: "anyday" }),
    });

    const json = await res.json();
    setForecast(json);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-100">🔮 Pick a Date to Forecast</h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="text-black px-4 py-2 rounded-lg w-full md:w-auto"
        />
        <button
          onClick={handleFetch}
          className="px-6 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-300"
        >
          Get Prediction
        </button>
      </div>

      {loading && <p className="text-blue-200 animate-pulse">Generating forecast...</p>}

      {forecast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 space-y-2"
        >
          <p className="text-4xl font-extrabold text-white">{forecast.predictedTemp}°C</p>
          <p className="text-blue-200 text-sm">Confidence: {forecast.confidenceLevel} ({forecast.confidenceScore})</p>
          <p className="text-xs text-gray-300">Prediction based on seasonal trends using `anyday` model</p>
        </motion.div>
      )}
    </motion.div>
  );
}
