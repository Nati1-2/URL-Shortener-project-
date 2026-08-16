# LinkPulse Local Development Guide

## Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7
- RabbitMQ 3.13

## Running Locally with Docker Compose (Recommended)
To launch all 9 microservices, 3 background workers, PostgreSQL multi-databases, Redis, RabbitMQ, and the Next.js frontend:

```bash
docker compose up --build
```

### Infrastructure Ports:
- **Frontend Web UI**: `http://localhost:3000`
- **API Gateway**: `http://localhost:8000`
- **Redirect Edge Router**: `http://localhost:8003/:shortCode`
- **RabbitMQ Management Dashboard**: `http://localhost:15672` (User: `guest`, Pass: `guest`)
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

## Running Locally for Direct Node.js Development

1. Start infrastructure containers:
```bash
docker compose up postgres redis rabbitmq -d
```

2. Build shared packages:
```bash
cd backend
npm install
npm run build:packages
```

3. Start API Gateway and microservices:
```bash
npm run dev:gateway
npm run dev:auth
npm run dev:link
npm run dev:redirect
npm run dev:analytics
npm run dev:workspace
npm run dev:domain
npm run dev:billing
npm run dev:notification
```

4. Start Frontend:
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` to interact with the full stack.
