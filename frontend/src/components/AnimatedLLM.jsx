import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/outline';

const AnimatedLLM = ({ forecast }) => {
  console.log("🔍 Forecast received in AnimatedLLM:", forecast);

  if (!forecast) {
    return (
      <div className="text-red-500 text-center mt-10 text-xl">
        ❌ No forecast data available.
      </div>
    );
  }

  return (
    <div className="text-white text-lg p-10">
      <h2 className="text-2xl font-bold mb-4">Forecast Details</h2>
      <p><strong>Temperature:</strong> {forecast.predictedTemp}°C</p>
      <p><strong>Model Used:</strong> {forecast.modelUsed}</p>
      <p><strong>LLM Explanation:</strong></p>
      <p className="italic mt-2">{forecast.explanation || 'No explanation yet.'}</p>
    </div>
  );
};

export default AnimatedLLM;
