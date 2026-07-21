# Task Management Microservice

[![Backend CI](https://github.com/Krishna2217/Task_Management_Microservice/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Krishna2217/Task_Management_Microservice/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/Krishna2217/Task_Management_Microservice/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Krishna2217/Task_Management_Microservice/actions/workflows/frontend-ci.yml)
[![Docker Publish](https://github.com/Krishna2217/Task_Management_Microservice/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/Krishna2217/Task_Management_Microservice/actions/workflows/docker-publish.yml)

A task management system built as Spring Boot microservices behind a Spring Cloud
Gateway, with service discovery via Netflix Eureka, JWT-based auth, and a React/Vite
frontend. Users sign up, get assigned tasks, submit work via a GitHub link, and admins
manage tasks, submissions, and user roles.

## Container images

Every push to `main` publishes each service to GHCR, tagged with both the commit SHA
and `latest`; pushing a `vX.Y.Z` tag additionally publishes that version tag:

| Image | Pull |
|---|---|
| `eureka-server` | `docker pull ghcr.io/krishna2217/taskmgmt-eureka-server:latest` |
| `api-gateway` | `docker pull ghcr.io/krishna2217/taskmgmt-api-gateway:latest` |
| `task-user-service` | `docker pull ghcr.io/krishna2217/taskmgmt-task-user-service:latest` |
| `task-service` | `docker pull ghcr.io/krishna2217/taskmgmt-task-service:latest` |
| `task-submission-service` | `docker pull ghcr.io/krishna2217/taskmgmt-task-submission-service:latest` |
| `frontend` | `docker pull ghcr.io/krishna2217/taskmgmt-frontend:latest` |

All images are listed under the repo's [Packages](https://github.com/Krishna2217?tab=packages&repo_name=Task_Management_Microservice)
tab. Each is scanned with Trivy on every publish (and on every PR, against a local
build) — the build fails if a HIGH or CRITICAL vulnerability is found.

## Quick start (from published images)

The fastest way to try the whole stack without building anything locally — copy
`.env.example` to `.env` first (see [Configuration](#configuration)), then:

```bash
docker compose pull
docker compose up -d
```

This pulls `latest` for every service per `docker-compose.yml` and starts the
full stack (MySQL, Redis, Eureka, the gateway, all three backend services, and the
frontend on http://localhost).

## Architecture

| Service | Port | Role |
|---|---|---|
| `eureka-server` | 8070 | Service registry |
| `api-gateway` | 8000 | Single entry point, routes to the services below |
| `task-user-service` | 8081 | Auth, user profiles, roles |
| `task-service` | 8082 | Task CRUD, assignment |
| `task-submission-service` | 8083 | Task submissions (GitHub links), accept/decline |
| `frontend` | 80 | React app, served by nginx, proxies `/api` and `/auth` to the gateway |
| `mysql` | — | One shared MySQL 8.4 container, three databases (one per backend service) |

## Features

- **Auth** — sign up / sign in, JWT-based sessions.
- **Roles** — every new account starts as a plain `USER`. Only an admin can promote
  someone to `ADMIN`, `TEACHER`, `STUDENT`, `PROJECT_HEAD`, or `DEVELOPER` — either
  directly, or by approving a role-change request the user submits themselves from
  their profile page.
- **Tasks** — admins create tasks and assign them to users; users see their own
  assigned tasks (or, if admin, every task) on the dashboard, plus dedicated
  Assigned / Done / Not Assigned views.
- **Submissions** — a user submits a GitHub link against their assigned task; an
  admin accepts or declines it. Accepting a submission automatically marks the task
  complete.
- **Profile** — view/edit your name, delete your account, request a role change.
- **Admin dashboards** — a full task overview (every task + who it's assigned to)
  and a user management page (promote users directly, review pending role requests).

## Prerequisites

- Docker Desktop (or another Docker Compose v2-compatible engine)

That's it for the Docker path below — no local JDK, Maven, or Node install needed.

## Quick start

From a fresh clone:

```bash
cp .env.example .env
docker compose up --build
```

This builds and starts all seven containers. Give it a minute the first time — each
backend service has a healthcheck, and dependent services wait for MySQL and Eureka
to report healthy before starting.

Check everything came up:

```bash
docker compose ps
```

All seven should show `Up`/`healthy`. Then open http://localhost:8070 — you should
see four registered services: `GATEWAY-SERVICE`, `USER-SERVICE`, `TASK-SERVICE`,
`SUBMISSION-SERVICE`.

## Using the app

Open **http://localhost**.

### 1. Sign up

Click **Sign Up**, create an account. Every new account is a plain `USER` — there is
no way to sign up as an admin (by design; see below).

### 2. Bootstrap your first admin

Since nobody can self-register as an admin, and only an admin can promote other
users, a brand-new deployment has **zero** admins. You need to promote the very
first one by hand, directly in the database:

```bash
docker compose exec -T mysql mysql -uroot -proot -e \
  "UPDATE task_user_service.user SET role='ROLE_ADMIN' WHERE email='you@example.com';"
```

Log out and back in (or just refresh) so the frontend picks up the new role. From
here on, that admin can promote everyone else through the UI — no more manual SQL
needed.

### 3. As an admin

- **Create New Task** (sidebar button) — title, description, image URL, and tags.
- **Admin Overview** (sidebar, admin-only) — every task in the system, who it's
  assigned to, and quick actions (assign / view submissions / edit / delete).
- **Manage Users** (sidebar, admin-only) — promote/demote any user directly, and
  approve or reject pending role-change requests submitted by users.
- From a task's `⋮` menu: assign it to a user, view/manage its submissions, edit,
  or delete it.

### 4. As a regular user

- **Home** shows your assigned tasks (admins see every task here instead).
- **Assigned** / **Done** / **Not Assigned** — filtered task views.
- Open a task's submissions page to submit a GitHub link for review.
- **Profile** — edit your name, or request a role change (an admin will need to
  approve it before it takes effect).

## Stopping / resetting

```bash
docker compose down       # stop everything, keep data
docker compose down -v    # stop everything and wipe the database volume
```

## Configuration

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Purpose |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Root password for the shared MySQL container |
| `JWT_SECRET` | HS256 signing secret for auth tokens — must be at least 32 bytes |
| `DB_USER` / `DB_PASSWORD` | Credentials each backend service uses to connect to MySQL |
| `SPRING_PROFILES_ACTIVE` | Should stay `docker` — activates each service's container-specific config |

## Rebuilding after code changes

```bash
docker compose build <service-name>   # e.g. frontend, task-service, task-user-service
docker compose up -d <service-name>
```

## Observability (optional)

Metrics, distributed tracing, and structured logging are built into all five backend
services (Actuator + Micrometer + OpenTelemetry + logstash-logback-encoder), but the
Prometheus/Grafana/Loki/Tempo stack that visualizes them is opt-in — it lives in a
separate compose file and only starts if you ask for it:

```bash
docker compose -f docker-compose.yml -f docker-compose.observability.yml --profile monitoring up -d
```

This adds five more containers on top of the main stack:

| Service | Port | Purpose |
|---|---|---|
| `prometheus` | 9090 | Scrapes `/actuator/prometheus` on all 5 services every 15s |
| `grafana` | 3000 | Dashboards — login `admin` / `$GRAFANA_ADMIN_PASSWORD` (default `admin`) |
| `loki` | 3100 | Log aggregation |
| `promtail` | — | Tails every container's Docker logs and ships them to Loki |
| `tempo` | 3200, 4317, 4318 | Trace storage; receives OTLP traces on 4318 (HTTP) / 4317 (gRPC) |

Open **http://localhost:3000** — Prometheus, Loki, and Tempo are pre-provisioned as
datasources, and a starter "Task Management - Spring Boot Overview" dashboard (CPU,
JVM memory, HTTP request rate, and the custom `tasks.*`/`submissions.*` business
counters) is auto-loaded. For a deeper out-of-the-box dashboard, import
[grafana.com dashboard ID 4701](https://grafana.com/grafana/dashboards/4701) ("JVM
(Micrometer)") against the provisioned Prometheus datasource.

Every request through the gateway is traced end-to-end — e.g. a call to
`GET /api/task/user` produces a single trace spanning `api-gateway` → `task-service`
→ `task-user-service` (the last hop via the Feign call), viewable in Tempo or via
Grafana's Explore view. Logs are JSON (with `service`, `traceId`, `spanId` fields) when
`SPRING_PROFILES_ACTIVE=docker`, so Loki can filter/correlate by either.

To stop just the monitoring stack:

```bash
docker compose -f docker-compose.yml -f docker-compose.observability.yml --profile monitoring down
```
