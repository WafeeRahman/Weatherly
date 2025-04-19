# Weatherly ⛅️  
**AI-Powered Temperature Forecasting App**  

## Vision

If you've ever lived in Toronto, you know that the weather here is unique, to say the least. Weatherly is an application that allows users to get baseline average temperature predictions for different calendar days throughout the year using historical weather data. It has 7, 14, 30, and any-day prediction models available for use and prediction.

This is a practical project I made to gain experience in a plethora of technologies. I learned something new in each core element of this project, and the main purpose of making this project was to put my learning into a practical application. 

---

## Use Case 1: Get Average Temperature Predictions 7, 14, 30 Days From Today (Dashboard Cards)

<p align="center">
  <img src="https://github.com/user-attachments/assets/7e4c95b2-68b7-428d-a671-0df79ab7c02f"
       alt="Weatherly demo"
       width="800" />
</p>

## Use Case 2: Get Average Temperature Prediction for a Specific Day or 7, 14, 30 Starting from a Specific Day (Calendar Date Picker) 
![weatherly demo 2](https://github.com/user-attachments/assets/4e275b9a-86fa-49ea-99d6-7abf2312a2f9)

<p align="center">
  <img src="[https://github.com/user-attachments/assets/7e4c95b2-68b7-428d-a671-0df79ab7c02f](https://github.com/user-attachments/assets/86c54219-1494-4740-a19b-43795ae3f1e9)"
       alt="Weatherly demo use case 2"
       width="800" />
</p>



## 📊 Creating our Machine Learning Models (Jupyter Notebook)

As I was recently exploring engineering machine learning models in TensorFlow, I started by learning and applying the numpy stack to clean over 10,000 rows of temperature data provided by https://toronto.weatherstats.ca/. Afterward, I continued with implementing a baseline regression model to predict average temperature, with training and testing splits done on the cleaned data. These models are evaluated based on Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE). To continue improving accuracy, I continued adding more features to the feature set, including seasonal patterns. Eventually, I created LSTM models for 7, 14, and 30 days, and kept a regressive model for any day of the year prediction. 

Improvement from the baseline model was about 20% according to the model evaluation from our first model to our last model. 

### Jupyter Notebook Modeling
- Started with `CleanedWeatherStats.csv` (daily historical Toronto weather)
- Created lagged feature windows for temperature, precipitation, and humidity
- Modeled with **LSTM networks** using TensorFlow/Keras:
  - `lstm_7day.h5`: Predicts avg temp over 7 days
  - `lstm_14day.h5`: Predicts avg temp over 14 days
  - `lstm_30day.h5`: Predicts avg temp over 30 days
- Also trained a **seasonal model** (`seasonal_anyday_model.h5`) using day-of-year signals (sin/cos) for any-day prediction
- Scalers saved: `lstm_scaler.pkl`, `seasonal_scaler.pkl`, `target_scaler.pkl`

## 🎯 Accuracy Summary

| Model     | MAE (°C) | RMSE | Confidence |
|-----------|----------|------|------------|
| 7-Day     | 1.89     | 2.14 | High       |
| 14-Day    | 2.55     | 3.12 | Medium     |
| 30-Day    | 3.60     | 4.28 | Low        |
| Any-Day   | ~5.00    | 5.5  | Very Low   |

- Confidence score is returned with every prediction

---


## 🐍 Python Inference Script

### `predict.py`
- CLI usage: `python predict.py <YYYY-MM-DD> <7day|14day|30day|anyday>`
- Dynamically loads appropriate model + scaler
- Builds 14-day input window for LSTM models
- Handles fallback if a complete historical window isn’t available
- Returns:
  ```json
  {
    "predictedTemp": 11.71,
    "confidenceLevel": "High",
    "confidenceScore": 0.9,
    "modelUsed": "lstm_7day.h5"
  }
  ```
- Suppresses all TensorFlow logging + GPU CUDA warnings for clean logs
- Used in production by the Java backend via subprocess

---

## 🧩 Spring Boot Backend

Afterward, I opted to build a backend using Spring Boot, which I hadn't used in any of my projects prior. This backend responds to user requests by calling a Python script to predict the average temperature on any given day using the model specified by the user. In addition, I used the openAI API and Theo Kanning's Open AI Library to train an LLM to add explanations behind the predictions made by each model.

### `/forecast-api`
- REST API written in Java (Spring Boot)
- Accepts POST requests at `/predict` with JSON body:
  ```json
  {
    "date": "2025-04-19",
    "model": "7day"
  }
  ```
- Calls `predict.py` using `ProcessBuilder`
- Returns JSON prediction object
- Also includes `/predict/ping` health check

---

## 🧠 LLM Integration
- Running using Theo Kanning's OpenAI Library
- Uses OpenAI API to generate a weather forecast explanation for each prediction
- Included in `/predict` backend response
- Highlights:
  - Forecast range interpretation
  - Model accuracy note
  - Seasonal context awareness

## ⚛️ React Frontend

The backend serves static react frontend files built with vite, tailwind, and material UI. The newest technology I worked with here was to tailwind, you could see my work with MUI and ReactJS in Explore Toronto, or Clipshare. 

### `/frontend`
- Built with React + Vite
- Key components:
  - Forecast dashboard with 7/14/30 day cards
  - Custom date picker (via `react-modern-calendar-datepicker`)
  - Animated typing explanation using Framer Motion
- Makes `POST /predict` calls to backend and displays results
- Built to `/frontend/dist` and served by Spring Boot from `resources/static`

---

## ☁️ AWS Deployment (EC2)

This entire project was deployed using AWS EC2. I created a t3 medium VM that continuously publicly serves the application on port 8080. I transferred the build using SCP, reinstalled dependencies, and set up autonomous end-to-end serving with systemd in Ubuntu. The Demo is available at: http://18.217.222.97:8080/. Please be patient, the VM may take time to spin up or adhere to API requests since I'm trying to cut costs on the VM. 

### EC2 Instance
- Type: `t3.medium` (2vCPU, 4GB RAM)
- Ubuntu 22.04 LTS
- Disk size: 12GB
- Python 3.12 + venv
- Java 17
- Node.js, npm, Gradle installed

### File Transfer
- Project files uploaded via `scp`
- Permissions for `.pem` key properly configured
- SSH access tested manually and via VS Code Remote SSH
- Runs automatically on reboot

---

