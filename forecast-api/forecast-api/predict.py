import sys
import json
from datetime import datetime
import numpy as np
import tensorflow as tf
from keras.models import load_model
import joblib

# Load args from Java or CLI
input_date = sys.argv[1]   # e.g. "2025-07-15"
model_type = sys.argv[2]   # e.g. "7day", "anyday"

# Convert input date to day-of-year format
day_of_year = datetime.strptime(input_date, "%Y-%m-%d").timetuple().tm_yday
sin_doy = np.sin(2 * np.pi * day_of_year / 365)
cos_doy = np.cos(2 * np.pi * day_of_year / 365)

# Choose the model file path
model_map = {
    "7day": "./models/lstm_7day.h5",
    "14day": "./models/lstm_14day.h5",
    "30day": "./models/lstm_30day.h5",
    "anyday": "./models/seasonal_anyday_model.h5"
}
model_used = model_map.get(model_type, model_map["anyday"])

# Load the model
model = load_model(model_used, compile=False)

# Define confidence metadata
confidence_lookup = {
    "7day": ("High", 0.9),
    "14day": ("Medium", 0.75),
    "30day": ("Low", 0.6),
    "anyday": ("Very Low", 0.5)
}
confidence_level, confidence_score = confidence_lookup.get(model_type, ("Low", 0.6))

# Inference
if model_type == "anyday":
    # Load both input and output scalers
    input_scaler = joblib.load("./models/seasonal_scaler.pkl")          # Used on [DayOfYear, sin_doy, cos_doy]
    target_scaler = joblib.load("./models/target_scaler.pkl")           # Used on avg_temperature target

    # Prepare and scale input
    X = np.array([[day_of_year, sin_doy, cos_doy]])
    X_scaled = input_scaler.transform(X)

    # Predict and inverse-transform
    y_scaled = model.predict(X_scaled)
    y_actual = target_scaler.inverse_transform(y_scaled)

    temperature = round(float(y_actual[0][0]), 2)
else:
    # Use dummy input for 7/14/30 LSTM (until you add real past-14-day data)
    X_dummy = np.random.rand(1, 14, model.input_shape[-1])
    y_pred = model.predict(X_dummy)
    temperature = round(float(y_pred[0][0]), 2)

# Respond with JSON to Spring Boot
print(json.dumps({
    "predictedTemp": temperature,
    "confidenceLevel": confidence_level,
    "confidenceScore": confidence_score,
    "modelUsed": model_used
}))
