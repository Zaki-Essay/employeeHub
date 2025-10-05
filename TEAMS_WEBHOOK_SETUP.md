# Teams Webhook Integration for Kudos Notifications

## Overview
This application now sends push notifications to a Microsoft Teams channel whenever a user sends kudos to another user.

## Setup Instructions

### 1. Create a Teams Webhook
1. Open Microsoft Teams and navigate to the channel where you want to receive notifications
2. Click on the three dots (...) next to the channel name
3. Select "Connectors" or "Workflows" (depending on your Teams version)
4. Search for "Incoming Webhook" and click "Add" or "Configure"
5. Give your webhook a name (e.g., "Kudos Notifications")
6. Optionally upload an icon
7. Click "Create" and copy the webhook URL provided

### 2. Configure the Application
Set the webhook URL as an environment variable:

#### On Windows (PowerShell):
```powershell
$env:TEAMS_WEBHOOK_URL="https://your-teams-webhook-url-here"
```

#### On Linux/Mac:
```bash
export TEAMS_WEBHOOK_URL="https://your-teams-webhook-url-here"
```

#### In Docker/Container:
Add the environment variable to your docker-compose.yml or container configuration:
```yaml
environment:
  - TEAMS_WEBHOOK_URL=https://your-teams-webhook-url-here
```

#### Alternative: application.properties
You can also directly set it in `backend/src/main/resources/application.properties`:
```properties
teams.webhook.url=https://your-teams-webhook-url-here
```

### 3. Restart the Application
After configuring the webhook URL, restart the backend application for changes to take effect.

## How It Works
- When a user sends kudos to another user, the application:
  1. Saves the kudos transaction to the database
  2. Sends a formatted notification to the configured Teams channel
  3. The notification includes:
     - Sender's name
     - Receiver's name
     - Kudos amount
     - Personal message

## Notification Format
```
🎉 **Kudos Alert!** 🎉

**John Doe** sent **5 kudos** to **Jane Smith**

Message: "Great job on the project!"
```

## Error Handling
- If the webhook URL is not configured, the application will log a warning and continue without sending notifications
- If sending the notification fails, the error is logged but does not affect the kudos transaction
- All kudos transactions are saved successfully regardless of webhook status

## Troubleshooting
1. **Notifications not appearing in Teams:**
   - Verify the webhook URL is correctly configured
   - Check that the webhook hasn't been deleted from Teams
   - Review application logs for error messages

2. **Build errors:**
   - Ensure you have the correct Java version (17 or 21 depending on your setup)
   - Run `mvn clean install` to rebuild the project

3. **Check logs:**
   - Look for messages like "Successfully sent kudos notification to Teams channel"
   - Or warnings like "Teams webhook URL is not configured"
