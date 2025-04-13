package com.weatherpredictor.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.weatherpredictor.model.ForecastRequest;
import com.weatherpredictor.model.ForecastResponse;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.util.stream.Collectors;

@Service
public class ForecastService {

    public ForecastResponse getForecast(ForecastRequest request) {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                "python", "predict.py",
                request.getDate(), request.getModel()
            );
    
            Process process = pb.start();
    
            InputStream stdout = process.getInputStream();
    
            // Only grab the last line (which should be the JSON string)
            String resultJson = new BufferedReader(new InputStreamReader(stdout))
                .lines()
                .reduce((first, second) -> second)
                .orElse("");
    
            System.out.println("Python JSON Output: " + resultJson);
    
            process.waitFor();
    
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(resultJson, ForecastResponse.class);
    
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
