import React, { useState, useEffect, useRef } from 'react';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MenuItem, Select, Button, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import AnimatedSun from './AnimatedSun';
import AnimatedClouds from './AnimatedClouds';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#62BFED' },
    background: { default: '#121212', paper: '#1A1F2E' },
    text: { primary: '#ffffff', secondary: '#B0BEC5' }
  },
});

export default function CustomDatePicker({ onBack }) {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [model, setModel] = useState('anyday');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [typedExplanation, setTypedExplanation] = useState('');
  const typingTimeoutRef = useRef(null);

  const handlePredict = () => {
    if (!selectedDate) return;
    setLoading(true);
    setTypedExplanation('');
    const isoDate = selectedDate.format('YYYY-MM-DD');

    fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: isoDate, model }),
    })
      .then(res => res.json())
      .then(data => {
        setForecast({ ...data, date: isoDate });
      })
      .catch(err => {
        alert('Prediction failed.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!forecast?.explanation || loading) return;
  
    setTypedExplanation('');
    let index = 0;
    const fullText = forecast.explanation;
    let currentText = '';
    let cancelled = false;
  
    const typeNext = async () => {
      while (index < fullText.length && !cancelled) {
        currentText += fullText[index];
        setTypedExplanation(currentText);
        index++;
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
    };
  
    typeNext();
  
    return () => {
      cancelled = true;
    };
  }, [forecast, loading]);

  return (
    <motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  className="flex flex-col md:flex-row justify-center items-start min-h-screen px-4 py-12 gap-8 transition-colors duration-300">

    <ThemeProvider theme={darkTheme}>
    <AnimatedSun />
      <AnimatedClouds />

      <div className="flex flex-col md:flex-row justify-center items-start min-h-screen px-4 py-12 gap-8 transition-colors duration-300">
        {/* 📅 Date Card */}
        <div className="bg-[#121212] text-white p-6 rounded-3xl shadow-[0_0_30px_rgba(98,191,237,0.4)] flex flex-col items-center w-full md:max-w-md">
          <h2 className="text-2xl font-bold mb-4">Select a Date</h2>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={newValue => setSelectedDate(newValue)}
              sx={{
                bgcolor: '#1E1E1E',
                borderRadius: '16px',
                boxShadow: '0 0 15px rgba(98,191,237,0.3)',
                '& .MuiPickersDay-root': {
                  color: '#fff',
                  '&.Mui-selected': {
                    backgroundColor: '#62BFED',
                    color: '#000',
                  },
                },
              }}
              slotProps={{
                textField: { variant: 'standard', sx: { display: 'none' } },
              }}
            />
          </LocalizationProvider>

          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            fullWidth
            className="mt-4 bg-[#1e1e1e] text-white border border-[#62BFED] rounded-lg"
            sx={{
              '& .MuiSelect-icon': { color: 'white' },
              '& fieldset': { borderColor: '#62BFED' },
            }}
          >
            <MenuItem value="lstm_7day">7-Day LSTM</MenuItem>
            <MenuItem value="lstm_14day">14-Day LSTM</MenuItem>
            <MenuItem value="lstm_30day">30-Day LSTM</MenuItem>
            <MenuItem value="anyday">Anyday Model</MenuItem>
          </Select>

          <div className="flex gap-4 mt-6">
            <Button onClick={onBack} variant="outlined" className="text-white border-[#62BFED]">
              Back
            </Button>
            <Button
              onClick={handlePredict}
              variant="contained"
              disabled={loading}
              className="bg-[#62BFED] text-black hover:bg-[#4BA8D8] hover:scale-105"
            >
              {loading ? 'Loading...' : 'Predict'}
            </Button>
          </div>
        </div>

        {/* 🔍 Forecast Panel */}
        {forecast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#181818] text-white rounded-3xl shadow-[0_0_25px_rgba(98,191,237,0.4)] p-6 w-full md:max-w-md"
          >
            <h3 className="text-xl font-bold text-[#62BFED] mb-4">Forecast Details</h3>
            <p><strong>Temperature:</strong> {forecast.predictedTemp}°C</p>
            <p><strong>Model:</strong> {forecast.modelUsed}</p>
            <p><strong>Confidence:</strong> {forecast.confidenceLevel} ({forecast.confidenceScore})</p>

            <h4 className="mt-4 mb-2 font-semibold">LLM Explanation:</h4>
            {loading ? (
              <div className="flex justify-center mt-4">
                <CircularProgress size={28} style={{ color: '#62BFED' }} />
              </div>
            ) : (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="whitespace-pre-wrap font-mono text-sm text-[#62BFED] bg-black/20 rounded-md p-3 border border-[#62BFED]"
              >
                {typedExplanation}
              </motion.pre>
            )}
          </motion.div>
        )}
      </div>
    </ThemeProvider>
    </motion.div>
  );
}
