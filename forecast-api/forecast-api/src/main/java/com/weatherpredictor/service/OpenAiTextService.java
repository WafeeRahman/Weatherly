package com.weatherpredictor.service;

import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpenAiTextService {

    private final OpenAiService openAiService;

    public OpenAiTextService(@Value("${openai.api.key}") String apiKey) {
        this.openAiService = new OpenAiService(apiKey);
        System.out.println("✅ API KEY from Spring: " + apiKey);
    }

    public String generateExplanation(String forecastSummary, String modelUsed) {
        // Choose model type label
        String modelDescription;
        if (modelUsed.contains("anyday")) {
            modelDescription = "a seasonal model that predicts for a specific date (1-day forecast)";
        } else if (modelUsed.contains("7day")) {
            modelDescription = "a 7-day LSTM model that predicts the average temperature over the next 7 days";
        } else if (modelUsed.contains("14day")) {
            modelDescription = "a 14-day LSTM model that predicts the average temperature over the next 14 days";
        } else if (modelUsed.contains("30day")) {
            modelDescription = "a 30-day LSTM model that predicts the average temperature over the next 30 days";
        } else {
            modelDescription = "an unspecified weather prediction model";
        }
    
        // Prompt for the LLM
        List<ChatMessage> messages = List.of(
            new ChatMessage("system", "You are a helpful assistant that explains weather forecasts."),
            new ChatMessage("user", String.format("""
                Provide a weather forecast explanation based on the following summary. Include why this weather is likely,
                how confident we should be in this forecast based on the date and the last row of data made available when training the data model (April 4th 2024), and give a short model evaluation based on the type of model used.
    
                Forecast Summary:
                %s
    
                Model Used: %s
    
                Be concise (2–4 sentences). Mention if confidence should be low because the model predicts over a longer time range. Start every sentence with The forecast predicts a temperature...
            """, forecastSummary, modelDescription))
        );
    
        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo")
            .messages(messages)
            .temperature(0.7)
            .maxTokens(180)
            .build();
    
        return openAiService.createChatCompletion(request)
            .getChoices().get(0).getMessage().getContent().trim();
    }
    
}
