package com.weatherpredictor.forecast_api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "openai.api.key=dummy-test-key")
class ForecastApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
