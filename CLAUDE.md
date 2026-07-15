# CLAUDE.md

Guidance for working in this repository.

## Overview

A task management system built as Spring Boot microservices behind a Spring Cloud
Gateway, with service discovery via Netflix Eureka and a React/Vite frontend.
All backend services use Java 17, Maven, and the `com.krishna` base package.

## Architecture

Services register with Eureka and are reached through the gateway by their
registered application name (`lb://…`). Inter-service calls use OpenFeign clients
that resolve service names through Eureka.

| Service | Dir | Port | Eureka name | Role |
|---|---|---|---|---|
| Eureka Server | `eureka-server` | 8070 | (registry) | Service discovery |
| API Gateway | `api-gateway` | 8000 | GATEWAY-SERVICE | Single entry point, routing, CORS |
| User Service | `task-user-service` | 8081 | USER-SERVICE | Auth (JWT), user profiles, Spring Security |
| Task Service | `task-service` | 8082 | TASK-SERVICE | Task CRUD, assignment |
| Submission Service | `task-submission-service` | 8083 | SUBMISSION-SERVICE | Task submissions, accept/decline |
| Frontend | `frontendService/vite-project` | 5173 (Vite default) | — | React 19 + TypeScript + Tailwind v4 SPA |

Gateway routing (`api-gateway/src/main/resources/application.yaml`):
- `/auth/**`, `/user/**`, `/api/user/**` → USER-SERVICE
- `/api/task/**`, `/tasks/**` → TASK-SERVICE
- `/api/submission/**`, `/submission/**` → SUBMISSION-SERVICE

## Authentication flow

- Only USER-SERVICE has Spring Security + JWT. Task/Submission services do **not**
  validate JWTs locally; they forward the raw `Authorization` header to
  USER-SERVICE via a Feign `UserService` client calling `GET /api/users/profile`
  to resolve the caller's identity/role.
- JWTs are HS256, signed with the hardcoded `JwtConstant.SECRET_KEY`, 24h expiry.
  `JwtProvider` generates tokens; `jwtTokenValidator` (a `OncePerRequestFilter`)
  parses them on inbound USER-SERVICE requests.
- In USER-SERVICE security config, `/api/**` requires authentication; everything
  else (e.g. `/auth/**`) is public.
- Controllers expect the header as `@RequestHeader("Authorization") String jwt`
  and the token includes the `Bearer ` prefix (stripped via `substring(7)`).

## Data & persistence

- Each stateful service has its own MySQL database (database-per-service):
  `task_user_service`, `task_service`, `task_submission_service`, all on
  `localhost:3306`, user/pass `root`/`root`.
- JPA with `ddl-auto: update` (schema auto-managed). MySQL8 dialect.
- Cross-service data is passed as DTOs (`UserDto`, `TaskDto`) rather than shared
  entities.

## Conventions

- Base package is `com.krishna`. Note the package `modal` (misspelled "model")
  holds entities/DTOs — keep it consistent when adding files.
- Service layer uses an interface + `…Implementation` class pattern
  (e.g. `TaskService` / `TaskServiceImplementation`).
- Lombok (`@Data`, `@AllArgsConstructor`, `@NoArgsConstructor`) on entities/DTOs.
- Controllers return `ResponseEntity<>`; field injection via `@Autowired`.
- comment every changes and push the changes to git after every feature make sure to not include claude as co-auther
## Build & run

Prereqs: Java 17, a running MySQL on 3306 with the three databases (or let
`ddl-auto: update` create tables in pre-existing schemas), Node for the frontend.

Each backend service is an independent Maven module with its own wrapper.
**Start order matters:** Eureka first, then the other services, gateway last.

```bash
# From each service directory:
./mvnw spring-boot:run        # run
./mvnw clean package          # build jar
./mvnw test                   # tests

# Frontend
cd frontendService/vite-project
npm install
npm run dev                   # dev server
npm run build                 # tsc -b && vite build
npm run lint
```

There is no root aggregator POM; build/run each service separately.

## Key API endpoints (service-relative paths)

- USER-SERVICE: `POST /auth/signup`, `POST /auth/signin`, `GET /api/users/profile`,
  `GET /api/users`, `PUT /api/users/profile`, `DELETE /api/users/profile`
- TASK-SERVICE: `POST /api/task`, `GET /api/task`, `GET /api/task/{id}`,
  `GET /api/task/user`, `PUT /api/task/{id}`, `PUT /api/task/{id}/user/{userId}/assigned`,
  `PUT /api/task/{id}/complete`, `DELETE /api/task/{id}`
- SUBMISSION-SERVICE: `POST /api/submission`, `GET /api/submission`,
  `GET /api/submission/{id}`, `GET /api/submission/task/{task_id}`,
  `PUT /api/submission/{id}?status=…`