package com.weatherpredictor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@ComponentScan(basePackages = "com.weatherpredictor")  
public class ForecastApiApplication {
   
    @Value("${openai.api.key}")
    private String testApiKey;

    public static void main(String[] args) {
        SpringApplication.run(ForecastApiApplication.class, args);
    }

    @PostConstruct
    public void showKey() {
        System.out.println(">>> API KEY FROM SPRING: " + testApiKey);
    }
}
