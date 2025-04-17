import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CustomDatePicker from './components/CustomDatePicker';
import AnimatedLLM from './components/AnimatedLLM';
import './index.css';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  const [dashboardForecasts, setDashboardForecasts] = useState({});
  const [dashboardLoading, setDashboardLoading] = useState({ 7: true, 14: true, 30: true });

  const handleCardClick = (days) => {
    const forecast = dashboardForecasts[days];
    if (forecast) {
      setSelectedForecast(forecast);
    }
  };

  const handleBackFromCustom = () => {
    setShowTransition(true);
    setTimeout(() => {
      setView('dashboard');
      setShowTransition(false);
    }, 800);
  };

  const handleCustomDateClick = () => {
    setShowTransition(true);
    setTimeout(() => {
      setView('custom');
      setShowTransition(false);
    }, 800);
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    [7, 14, 30].reduce((chain, day) => {
      return chain.then(() =>
        fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: `${day}day`, date: today }),
        })
          .then(res => res.json())
          .then(data => {
            setDashboardForecasts(prev => ({ ...prev, [day]: { ...data, days: day } }));
            setDashboardLoading(prev => ({ ...prev, [day]: false }));
          })
          .catch(err => {
            console.error(`Error fetching ${day}-day forecast`, err);
            setDashboardLoading(prev => ({ ...prev, [day]: false }));
          })
      );
    }, Promise.resolve());
  }, []);

  return (
    <div className="min-h-screen font-inter relative overflow-hidden">
     <AnimatePresence>
  {showTransition && (
    <>
      {/* Fullscreen color overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-[#62BFED]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Morphing expanding circle effect */}
      <motion.div
        layoutId="custom-button" // 👈 Syncs with button
        className="fixed top-[calc(50%-28px)] left-1/2 transform -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-[#62BFED]"
        initial={{ scale: 1 }}
        animate={{ scale: 50 }}
        exit={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </>
  )}
</AnimatePresence>


      {view === 'dashboard' && (
        <>
          {!selectedForecast ? (
            <Dashboard
              forecasts={dashboardForecasts}
              loadingStatus={dashboardLoading}
              onSelect={handleCardClick}
              onCustomDate={handleCustomDateClick}
            />
          ) : (
            <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="mb-6 md:mb-0 md:mr-8"
              >
                <Dashboard.ForecastCard
                  days={selectedForecast.days}
                  forecast={selectedForecast}
                  description={`LSTM Model: Predicts average temperature over the next ${selectedForecast.days} days.`}
                  big
                />
              </motion.div>
              <AnimatedLLM
                forecast={selectedForecast}
                onBack={() => setSelectedForecast(null)}
              />
            </div>
          )}
        </>
      )}

      {view === 'custom' && (
        <CustomDatePicker
          onBack={handleBackFromCustom}
          onForecast={(forecast) => {
            setSelectedForecast(forecast);
            setView('result');
          }}
        />
      )}

      {view === 'result' && selectedForecast && view !== 'dashboard' && (
        <AnimatedLLM
          forecast={selectedForecast}
          onBack={() => setView('dashboard')}
        />
      )}
    </div>
  );
}
