import logo from './logo.svg';
import './App.css';
import React from 'react';
import {useState} from "react";



function App() {

  const [forecast, setForecast] = useState(null);
  const [date, setDate] = useState("")
  const [model, setModel] = useState("anyday")


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {date: date, model: model}


    try {
      const response = await fetch("/predict", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload) });
      
          const data = await response.json()
          setForecast(data);

    } catch (err) {
      console.error("Error During Fetch", err)
    }
  };

  return (
    <div className="App">
      <h1>Toronto Weather Forecast</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Choose a date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <label>
          Choose model:
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="7day">7-day LSTM</option>
            <option value="14day">14-day LSTM</option>
            <option value="30day">30-day LSTM</option>
            <option value="anyday">Any Day</option>
          </select>
          </label>
        </label>
        <button type="submit">Get Forecast</button>
      </form>

      

      {forecast && (
        <div className="result">
          <h3>Predicted Temp: {forecast.predictedTemp}°C</h3>
          <p><strong>Confidence:</strong> {forecast.confidenceLevel} ({forecast.confidenceScore})</p>
          <p><strong>Explanation:</strong> {forecast.explanation}</p>
        </div>
      )}
    </div>
  );
}


export default App;
