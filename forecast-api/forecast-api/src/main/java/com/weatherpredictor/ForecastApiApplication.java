package com.weatherpredictor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.weatherpredictor")  // 👈 This line is the fix
public class ForecastApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ForecastApiApplication.class, args);
    }
}
