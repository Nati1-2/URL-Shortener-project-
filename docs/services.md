# LinkPulse Microservices Catalog

| Service | Port | Database / Storage | Responsibilities |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `8000` | Redis (Rate Limiter) | Route routing, JWT verification, rate limiting, request correlation IDs, error normalization |
| **Auth Service** | `8001` | `auth_db` (PostgreSQL) | Registration, Argon2/Bcrypt hashing, JWT access/refresh token rotation, sessions |
| **Link Service** | `8002` | `link_db` (PostgreSQL) | Short link CRUD, collision-safe cryptographic shortcodes, custom slugs, tags, QR options |
| **Redirect Service** | `8003` | Redis + `link_db` | Sub-millisecond 301/302 redirects, telemetry parsing, asynchronous RabbitMQ publishing |
| **Analytics Service**| `8004` | `analytics_db` (PostgreSQL) | Multi-timeframe aggregations (7d/30d/90d/YTD), geography, devices, browsers, referrers, live feed |
| **Workspace Service**| `8005` | `workspace_db` (PostgreSQL)| Multi-tenancy, team invitations, RBAC permissions (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`) |
| **Domain Service** | `8006` | `domain_db` (PostgreSQL) | Custom branded domains, CNAME DNS verification simulation, SSL provisioning status |
| **Billing Service** | `8007` | `billing_db` (PostgreSQL)| Stripe customer subscriptions, checkout sessions, billing portal, usage enforcement |
| **Notification Service**| `8008`| `notification_db` (PostgreSQL)| In-app alerts, milestone achievements, asynchronous email queues |
| **Analytics Worker** | Background | RabbitMQ + `analytics_db` | Consumes `ClickRecorded` events, updates aggregate tables, broadcasts to Redis Pub/Sub |
| **Notification Worker**| Background | RabbitMQ + `notification_db`| Consumes `NotificationRequested` events and writes in-app notifications |
| **Webhook Worker** | Background | RabbitMQ + `billing_db` | Consumes `WebhookReceived` events with idempotency deduplication |
