package me.gaga.employeehubapi.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class TeamsWebhookService {

    @Value("${teams.webhook.url}")
    private String webhookUrl;

    private final RestTemplate restTemplate;

    public TeamsWebhookService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendKudosNotification(String senderName, String receiverName, int amount, String message) {
        if (webhookUrl == null || webhookUrl.isEmpty()) {
            log.warn("Teams webhook URL is not configured. Skipping notification.");
            return;
        }

        try {
            String messageText = String.format("🎉 **Kudos Alert!** 🎉\n\n" +
                    "**%s** sent **%d kudos** to **%s**\n\n" +
                    "Message: \"%s\"", 
                    senderName, amount, receiverName, message);

            Map<String, Object> payload = new HashMap<>();
            payload.put("text", messageText);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(webhookUrl, request, String.class);
            log.info("Successfully sent kudos notification to Teams channel");
        } catch (Exception e) {
            log.error("Failed to send notification to Teams webhook: {}", e.getMessage(), e);
        }
    }
}
