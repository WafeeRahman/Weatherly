import { ThermometerIcon } from "lucide-react";

export default function TemperatureCard({ label, value, model }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-full max-w-xs">
      <h3 className="text-xl font-bold text-blue-200">{label}</h3>
      <div className="flex items-center justify-between mt-4">
        <ThermometerIcon className="text-blue-300 w-6 h-6" />
        <span className="text-4xl text-white font-extrabold">{value}°C</span>
      </div>
      <p className="text-sm text-blue-100 mt-2">{model} model predicts average temperature.</p>
    </div>
  );
}
