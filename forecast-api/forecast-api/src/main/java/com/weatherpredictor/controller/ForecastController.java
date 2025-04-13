package  com.weatherpredictor.controller;


import com.weatherpredictor.model.ForecastRequest;
import com.weatherpredictor.model.ForecastResponse;
import com.weatherpredictor.service.ForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/predict")
public class ForecastController {

    @Autowired
    private ForecastService forecastService;

    @PostMapping
    public ForecastResponse getForecast(@RequestBody ForecastRequest request) {
        return forecastService.getForecast(request);
    }

    @GetMapping("/ping")
public String ping() {
    return "pong";
}
}
