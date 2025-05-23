package com.weatherpredictor.model;

public class ForecastResponse {
    private double predictedTemp;
    private String confidenceLevel;
    private double confidenceScore;
    private String modelUsed;
    private String explanation; // OPENAI Explanation
public ForecastResponse() {}

    public double getPredictedTemp() {
        return predictedTemp;
    }

    public void setPredictedTemp(double predictedTemp) {
        this.predictedTemp = predictedTemp;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public String getExplanation() {
        return explanation;
    }
    
    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
