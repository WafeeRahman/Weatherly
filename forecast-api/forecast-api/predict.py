#!/usr/bin/env python3
"""
Weatherly inference script
--------------------------
Example:
    python predict.py 2024-07-15 7day
"""

import sys, json, os, warnings
from datetime import datetime, timedelta
import numpy as np, pandas as pd
from keras.models import load_model
import joblib

# ------------------------------------------------------------------ #
# 1. CLI args
# ------------------------------------------------------------------ #
try:
    input_date_str, model_type = sys.argv[1], sys.argv[2]
except IndexError:
    sys.exit("Usage: predict.py <YYYY-MM-DD> <7day|14day|30day|anyday>")

input_date = datetime.strptime(input_date_str, "%Y-%m-%d")

# ------------------------------------------------------------------ #
# 2. Hard‑coded confidence lookup (from notebook scores)
# ------------------------------------------------------------------ #
CONFIDENCE_TABLE = {
    "lstm_7day.h5":             ("High",     0.90),
    "lstm_14day.h5":            ("Medium",   0.75),
    "lstm_30day.h5":            ("Low",      0.60),
    "seasonal_anyday_model.h5": ("Very Low", 0.50)
}

# ------------------------------------------------------------------ #
# 3. Paths & model loading
# ------------------------------------------------------------------ #
MODEL_DIR = "models"
model_files = {
    "7day":   "lstm_7day.h5",
    "14day":  "lstm_14day.h5",
    "30day":  "lstm_30day.h5",
    "anyday": "seasonal_anyday_model.h5"
}
model_file = model_files.get(model_type, model_files["anyday"])
model_path = os.path.join(MODEL_DIR, model_file)
model      = load_model(model_path, compile=False)

confidence_level, confidence_score = CONFIDENCE_TABLE.get(
    model_file, ("Unknown", 0.5)
)

# ------------------------------------------------------------------ #
# 4. Scalers & expected feature list
# ------------------------------------------------------------------ #
lstm_scaler = joblib.load(os.path.join(MODEL_DIR, "lstm_scaler.pkl"))

if hasattr(lstm_scaler, "feature_names_in_"):
    EXPECTED_LSTM_FEATURES = list(lstm_scaler.feature_names_in_)
else:  # fallback (hard‑code once)
    EXPECTED_LSTM_FEATURES = [
        "temp_lag_1","temp_lag_2","temp_lag_3","temp_lag_4","temp_lag_5","temp_lag_6","temp_lag_7",
        "precip_lag_1","precip_lag_2","precip_lag_3","precip_lag_4","precip_lag_5","precip_lag_6","precip_lag_7",
        "humid_lag_1","humid_lag_2","humid_lag_3","humid_lag_4","humid_lag_5","humid_lag_6","humid_lag_7",
        "avg_temperature","precipitation","avg_relative_humidity",
        "DayOfYear","sin_doy","cos_doy"
    ]

# ------------------------------------------------------------------ #
# 5. Helper: build last‑14‑day feature window
# ------------------------------------------------------------------ #
def build_lstm_window(target_dt: datetime, days_back: int = 14):
    df = pd.read_csv("CleanedWeatherStats.csv", parse_dates=["date"]).set_index("date")
    wanted = [target_dt - timedelta(days=i) for i in range(days_back)][::-1]

    if not all(d in df.index for d in wanted):
        for yr in sorted({d.year for d in df.index}, reverse=True):
            alt = [d.replace(year=yr) for d in wanted]
            if all(d in df.index for d in alt):
                wanted = alt
                break
        else:
            warnings.warn("Full 14‑day window missing; forward‑fill fallback.")
            return df.reindex(wanted).fillna(method="ffill")[EXPECTED_LSTM_FEATURES].values

    return df.loc[wanted, EXPECTED_LSTM_FEATURES].values

# ------------------------------------------------------------------ #
# 6. Inference
# ------------------------------------------------------------------ #
if model_type == "anyday":
    X_scaler = joblib.load(os.path.join(MODEL_DIR, "seasonal_scaler.pkl"))
    y_scaler = joblib.load(os.path.join(MODEL_DIR, "target_scaler.pkl"))

    doy   = input_date.timetuple().tm_yday
    sin_d = np.sin(2 * np.pi * doy / 365)
    cos_d = np.cos(2 * np.pi * doy / 365)

    X_scaled = X_scaler.transform([[doy, sin_d, cos_d]])
    temp     = float(y_scaler.inverse_transform(model.predict(X_scaled))[0, 0])

else:
    window   = build_lstm_window(input_date - timedelta(days=1))
    X_scaled = lstm_scaler.transform(window).reshape(1, *window.shape)
    temp     = float(model.predict(X_scaled)[0, 0])

temperature = round(temp, 2)

# ------------------------------------------------------------------ #
# 7. Emit JSON
# ------------------------------------------------------------------ #
print(json.dumps({
    "predictedTemp":   temperature,
    "confidenceLevel": confidence_level,
    "confidenceScore": confidence_score,
    "modelUsed":       model_file
}))
