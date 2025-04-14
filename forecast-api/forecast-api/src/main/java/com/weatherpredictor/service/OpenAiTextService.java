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
    }

    public String generateExplanation(String forecastSummary) {
        List<ChatMessage> messages = List.of(
            new ChatMessage("system", "You are a helpful assistant that explains weather forecasts."),
            new ChatMessage("user", String.format("""
                Generate a short weather explanation based on this forecast:

                Forecast Summary:
                %s

                Explain why this weather is likely based on seasonality and confidence level.
            """, forecastSummary))
        );

        ChatCompletionRequest request = ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo")
            .messages(messages)
            .temperature(0.7)
            .maxTokens(150)
            .build();

        return openAiService.createChatCompletion(request)
            .getChoices().get(0).getMessage().getContent().trim();
    }
}
