# LinkPulse RabbitMQ Event-Driven Architecture

## Exchange Configuration
- **Topic Exchange**: `linkpulse.events` (durable)
- **Dead-Letter Exchange (DLX)**: `linkpulse.events.dlx` (durable)

## Event Schemas & Topics

### 1. `linkpulse.click.recorded`
Published by: `redirect-service`  
Consumed by: `analytics-worker`  
Payload:
```json
{
  "eventId": "evt_98fbc12a-...",
  "eventType": "CLICK_RECORDED",
  "timestamp": "2026-08-16T11:45:00.000Z",
  "source": "redirect-service",
  "version": "1.0",
  "payload": {
    "linkId": "link_123",
    "workspaceId": "ws_main",
    "shortCode": "summer-sale",
    "destinationUrl": "https://company.com/promo",
    "ipHash": "a1b2c3d4e5f6",
    "country": "United States",
    "deviceType": "Desktop",
    "browser": "Chrome",
    "os": "macOS",
    "referrer": "Google Search",
    "utmSource": "twitter",
    "timestamp": "2026-08-16T11:45:00.000Z"
  }
}
```

### 2. `linkpulse.link.created`
Published by: `link-service`  
Payload:
```json
{
  "eventId": "evt_...",
  "eventType": "LINK_CREATED",
  "payload": {
    "linkId": "link_123",
    "workspaceId": "ws_main",
    "shortCode": "summer-sale",
    "destinationUrl": "https://company.com/promo",
    "title": "Summer Campaign"
  }
}
```

### 3. `linkpulse.notification.requested`
Published by: `auth-service`, `workspace-service`, `billing-service`  
Consumed by: `notification-worker`  
Payload:
```json
{
  "eventId": "evt_...",
  "eventType": "NOTIFICATION_REQUESTED",
  "payload": {
    "workspaceId": "ws_main",
    "title": "Team Member Invited",
    "message": "alex@company.com joined your workspace",
    "type": "info"
  }
}
```

### 4. `linkpulse.subscription.updated`
Published by: `billing-service` / `webhook-worker`  
Payload:
```json
{
  "eventId": "evt_...",
  "eventType": "SUBSCRIPTION_UPDATED",
  "payload": {
    "workspaceId": "ws_main",
    "planId": "pro",
    "planName": "Pro Growth Plan",
    "status": "active",
    "monthlyClicksLimit": 50000
  }
}
```
