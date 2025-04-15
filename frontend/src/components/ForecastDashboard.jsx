import ForecastCard from './ForecastCard';

const forecasts = [
  { label: '7-Day Forecast', model: 'lstm_7day.h5', days: 7 },
  { label: '14-Day Forecast', model: 'lstm_14day.h5', days: 14 },
  { label: '30-Day Forecast', model: 'lstm_30day.h5', days: 30 },
];

export default function ForecastDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
      {forecasts.map((f) => (
        <ForecastCard key={f.days} forecast={f} />
      ))}
    </div>
  );
}
