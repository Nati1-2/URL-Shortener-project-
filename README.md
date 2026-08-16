# LinkPulse — Enterprise URL Shortener & Real-Time Analytics SaaS Platform

LinkPulse is a distributed URL shortening and click telemetry platform engineered with microservices, asynchronous message brokering, multi-tenant workspace isolation, edge caching, and a responsive frontend.

## Architecture

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, Zustand, Recharts.
- **Backend Microservices**:
  - **API Gateway** (`:8000`): Dynamic reverse proxy, JWT guard, rate limiting, request correlation IDs.
  - **Auth Service** (`:8001`): Registration, Argon2/Bcrypt password hashing, token rotation, sessions (`auth_db`).
  - **Link Service** (`:8002`): Collision-safe cryptographic shortcodes, custom slugs, tags, QR studio (`link_db`).
  - **Redirect Service** (`:8003`): Sub-millisecond 301/302 redirects, Redis caching, non-blocking telemetry publishing.
  - **Analytics Service** (`:8004`): Timeline velocity, geographic distribution, device hardware breakdown (`analytics_db`).
  - **Workspace Service** (`:8005`): Multi-tenant isolation, invitations, RBAC roles (`workspace_db`).
  - **Domain Service** (`:8006`): Custom branded domains, DNS CNAME verification (`domain_db`).
  - **Billing Service** (`:8007`): Stripe subscriptions, plans catalog, portal (`billing_db`).
  - **Notification Service** (`:8008`): In-app notification vault and email dispatch queues (`notification_db`).
- **Asynchronous Event Workers**:
  - **Analytics Worker**: Consumes `ClickRecorded` events, aggregates metrics, and broadcasts to Redis Pub/Sub.
  - **Notification Worker**: Consumes `NotificationRequested` events and writes in-app notifications.
  - **Webhook Worker**: Consumes `WebhookReceived` events with idempotency deduplication.
- **Data & Message Infrastructure**:
  - **PostgreSQL 16**: 7 dedicated databases (`auth_db`, `link_db`, `analytics_db`, `workspace_db`, `domain_db`, `billing_db`, `notification_db`).
  - **Redis 7**: Sub-millisecond cache, Pub/Sub live feed, distributed rate limiting.
  - **RabbitMQ 3.13**: Topic exchanges, durable queues, dead-letter exchange (DLQ).

## Getting Started

### 1. Launch with Docker Compose
```bash
docker compose up --build
```

### 2. Access the Platform
- Web App UI: `http://localhost:3000`
- API Gateway: `http://localhost:8000/api/v1`
- Fast Edge Redirect: `http://localhost:8003/:shortCode`
- RabbitMQ Console: `http://localhost:15672` (guest / guest)

## Documentation
- [Architecture Guide](docs/architecture.md)
- [Microservices Catalog](docs/services.md)
- [Event-Driven Architecture](docs/events.md)
- [Local Development Guide](docs/local-development.md)
