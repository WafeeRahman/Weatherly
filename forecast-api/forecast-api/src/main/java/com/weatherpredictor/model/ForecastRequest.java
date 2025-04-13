package com.weatherpredictor.model;

public class ForecastRequest {
    private String date;
    private String model;


    public ForecastRequest() {}

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
