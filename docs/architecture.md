# LinkPulse Distributed Microservices Architecture

## Overview
LinkPulse is an enterprise-grade URL shortener, redirect router, and real-time analytics SaaS platform architected around domain-driven microservices, database-per-service isolation, asynchronous messaging, and edge caching.

```text
                                     INTERNET
                                        │
                                        ▼
                                ┌───────────────┐
                                │   Cloudflare  │
                                │ CDN / WAF     │
                                └───────┬───────┘
                                        │
                                        ▼
                                ┌───────────────┐
                                │   Next.js     │
                                │   Frontend    │
                                └───────┬───────┘
                                        │
                                        ▼
                                ┌───────────────┐
                                │  API Gateway  │ (Port 8000)
                                └───────┬───────┘
                                        │
       ┌─────────────────┬──────────────┼──────────────┬────────────────┐
       ▼                 ▼              ▼              ▼                ▼
 ┌───────────┐    ┌────────────┐  ┌───────────┐  ┌───────────┐    ┌───────────┐
 │   Auth    │    │    Link    │  │ Workspace │  │  Domain   │    │  Billing  │
 │  Service  │    │  Service   │  │  Service  │  │  Service  │    │  Service  │
 └─────┬─────┘    └─────┬──────┘  └─────┬─────┘  └─────┬─────┘    └─────┬─────┘
       │                │               │              │                │
       ▼                ▼               ▼              ▼                ▼
    auth_db          link_db       workspace_db    domain_db        billing_db

                                 ┌──────────────┐
                                 │   Redirect   │ (Port 8003)
                                 │   Service    │
                                 └──────┬───────┘
                                        │
                                        ▼
                                      Redis (Sub-ms Cache)
                                        │
                                        ▼
                                    RabbitMQ (Topic Exchange)
                                        │
                      ┌─────────────────┼─────────────────┐
                      │                 │                 │
                      ▼                 ▼                 ▼
               Analytics Worker    Notification      Webhook Worker
                      │               Worker              │
                      ▼                 │                 ▼
                 analytics_db           ▼             billing_db
                                 notification_db
```

## Key Architectural Highlights
1. **Sub-Millisecond Redirects**: Handled directly by `redirect-service` querying Redis cache first before falling back to PostgreSQL.
2. **Asynchronous Non-Blocking Telemetry**: When a link is clicked, a `ClickRecorded` event is pushed to RabbitMQ in microseconds, allowing the HTTP 302 redirect to complete immediately without waiting for analytics aggregation.
3. **Database-Per-Service**: Strict schema isolation preventing cross-database coupling.
4. **Resilient Message Queues**: Durable exchanges with Dead-Letter Queues (DLQ) ensuring zero data loss during traffic spikes.
5. **Real-time Live Stream**: Redis Pub/Sub pushes live click telemetry to connected dashboards without database polling.
