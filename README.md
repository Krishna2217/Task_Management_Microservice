# Task Management Microservice

A task management system built as Spring Boot microservices behind a Spring Cloud
Gateway, with service discovery via Netflix Eureka and a React/Vite frontend.

## Running locally with Docker

Requires Docker (with Compose v2) installed. From a fresh clone:

```bash
cp .env.example .env
docker compose up --build
```

This brings up:

- **mysql** — one shared MySQL 8.4 container with three databases (`task_user_service`,
  `task_service`, `task_submission_service`)
- **eureka-server** — service registry at http://localhost:8070
- **api-gateway** — single entry point at http://localhost:8000
- **task-user-service**, **task-service**, **task-submission-service** — backend services
- **frontend** — the React app at http://localhost

Once everything is healthy, open http://localhost:8070 to confirm all four Spring
services (gateway, user, task, submission) are registered, then open http://localhost
to use the app.

To stop everything:

```bash
docker compose down
```

To wipe the database volume and start fresh:

```bash
docker compose down -v
```
