import { useState } from "react";
import WeatherDashboard from "./components/WeatherDashboard";
import  CustomDateForecast  from "./components/CustomDateForecast";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, BarChart3 } from "lucide-react";
import "./App.css"; // Assuming you add fonts/styles here

export default function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-900 text-white font-orbitron">
      <header className="p-6 text-center border-b border-blue-700 shadow-xl">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold tracking-wide"
        >
          Weatherly — Forecast Dashboard
        </motion.h1>
        <p className="mt-2 text-sm text-blue-300">
          📊 Predicting <span className="text-blue-100 font-semibold">average temperatures</span> for 7, 14, and 30 days using LSTM models
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setView("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${view === "dashboard" ? "bg-blue-600" : "bg-blue-800 hover:bg-blue-700"}`}
          >
            <BarChart3 size={18} /> Dashboard
          </button>
          <button
            onClick={() => setView("custom")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${view === "custom" ? "bg-blue-600" : "bg-blue-800 hover:bg-blue-700"}`}
          >
            <CalendarDays size={18} /> Pick a Date
          </button>
        </div>
      </header>

      <main className="p-6">
        <AnimatePresence mode="wait">
          {view === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <WeatherDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <CustomDateForecast />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center py-4 text-xs text-blue-400">
        Weatherly • Powered by LSTM models + OpenAI • Persona 3 Reload Inspired UI
      </footer>
    </div>
  );
}