# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fibonacci Series Based Learning (FSBL) Todo app — a spaced-repetition reminder system. When a todo is marked as reviewed, the next revision date is scheduled using Fibonacci intervals (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233 days). Each review advances the iteration counter; the interval cycles through the array using modulo 12.

## Architecture

Two independent sub-projects:

**Backend** (`Todo/`) — Spring Boot 2.2.6 + Java 11 + MongoDB
- `domain/Todo.java` — request/input DTO (no MongoDB annotations)
- `entity/TodoEntity.java` — MongoDB document (`@Document(collection="todos")`); unique index on `title`
- `service/TodoService.java` — core business logic; holds `fibArray` and implements the spaced-repetition scheduling
- `controller/TodoController.java` — CRUD endpoints under `/api/todos`
- `controller/RevisionController.java` — `GET /api/todos/revision` returns todos due for review today (completed=true, nextRevisionDate=today)
- `repository/TodoRepository.java` — Spring Data MongoDB repository
- `DataLoader.java` — `CommandLineRunner` that seeds sample todos on first startup; skips if the collection is non-empty

**Frontend** (`todo-frontend/`) — React 18 + Vite 5 + TypeScript + Tailwind CSS + shadcn/ui
- `src/lib/api.ts` — all HTTP calls (native fetch, async/await); replaces Angular's `TodoServiceService`
- `src/types/todo.ts` — `Todo` and `NewTodo` TypeScript interfaces
- `src/hooks/useTodos.ts` — state + CRUD for the pending task list
- `src/hooks/useRevisionList.ts` — state for revision list + mark-reviewed
- `src/components/AddTodo.tsx` — form to create new todos; category toggle buttons
- `src/components/TodoList.tsx` — panel showing pending tasks
- `src/components/RevisionList.tsx` — panel showing todos due for review today
- `src/components/TodoItem.tsx` — shared todo row (used in both list panels)
- `src/components/CategoryBadge.tsx` — icon-only category badge with Radix UI tooltip
- `src/components/ui/tooltip.tsx` — thin wrapper around `@radix-ui/react-tooltip`
- Categories on a todo: `isWork`, `isPersonal`, `isFuture`, `isLearning`

The frontend hardcodes the backend URL as `http://localhost:8080`.

## Running Locally (Docker Compose)

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080/api/todos |
| MongoDB | `mongo:27017` (internal only) |

MongoDB data is persisted in the `mongo-data` Docker volume. `DataLoader` seeds 13 sample todos on the very first startup (skips on subsequent starts). To wipe all data and re-seed: `docker compose down -v && docker compose up --build`.

The frontend hardcodes `http://localhost:8080` as the backend URL, so the backend must always be exposed on host port 8080.

## Commands

### Backend (run from `Todo/`)

```bash
# Run (requires a MongoDB instance)
MONGO_DATABASENAME=todoapp MONGO_URL=mongodb://localhost:27017/todoapp ./mvnw spring-boot:run

# Run tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=TodoApplicationTests
```

### Frontend (run from `todo-frontend/`)

```bash
npm install

# Dev server at http://localhost:5173 (requires backend on :8080)
npm run dev

# Type-check + production build (output to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Environment Variables (Backend)

These are set automatically by `docker-compose.yml`. Only needed when running the backend outside Docker.

| Variable | Description |
|---|---|
| `MONGO_DATABASENAME` | MongoDB database name |
| `MONGO_URL` | MongoDB connection URI |

## Frontend Stack

| Layer | Library | Version |
|---|---|---|
| Build | Vite | 5.x |
| UI | React | 18.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Components | shadcn/ui (Radix UI primitives) | — |
| Icons | Lucide React | 0.44x |
