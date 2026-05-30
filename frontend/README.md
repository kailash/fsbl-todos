# FSBL Todo — Frontend

React 18 + Vite 5 + TypeScript frontend for the Fibonacci Spaced-Based Learning todo app.

## Stack

- **Vite 5** — build tool & dev server
- **React 18** — UI framework
- **TypeScript 5** — type safety
- **Tailwind CSS 3** — utility-first styling
- **shadcn/ui** (Radix UI primitives) — accessible components
- **Lucide React** — icons

## Development

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # preview production build locally
```

Requires the backend running at `http://localhost:8080`. See the root `docker-compose.yml` to run everything together.

## Docker

The full stack (frontend + backend + MongoDB) is managed from the repo root:

```bash
docker compose up --build
```

Frontend is served via Nginx on port 4200.
