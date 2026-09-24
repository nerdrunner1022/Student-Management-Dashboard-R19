# Student Management Dashboard

## Project Overview

Student Management Dashboard is a full-stack application for viewing and managing student records. It combines a React frontend with a NestJS REST API backed by a hosted PostgreSQL (Neon) database.

Users can search students by name or course, narrow results with course, status, and GPA filters, expand a record to view its email address, toggle a student's active or suspended status, add a new student, and delete an existing record. Every mutation is confirmed with a toast notification, and all changes are saved to a hosted Postgres database so they survive page refreshes, server restarts, and redeploys.

## Features

- Search students by name or course (case-insensitive, server-side)
- Filter by course, status (Active/Suspended), and GPA range (3.5+, 3.0–3.49, below 3.0)
- Expandable student cards showing email, status controls, and delete action
- Dashboard stat cards (total, active, suspended, course count)
- Add new students with client- and server-side validation
- Success/error toast notifications for every mutation
- Persistent storage in a hosted PostgreSQL (Neon) database with automatic seeding on first boot

## Architecture

The project is split into three areas:

| Directory | Purpose |
| --- | --- |
| `./` (root) | React 19 + Vite 8 frontend |
| `./backend/` | NestJS 12 REST API + TypeORM/PostgreSQL persistence (Neon) |
| `./api-tests/` | Bruno API testing collection (`.bru` files) |

The frontend calls the API through relative `/api/...` URLs. In development, Vite proxies those to the backend at `http://localhost:3000`.

## Technologies Used

**Frontend**
- React 19 for the user interface and component-based structure
- Vite 8 for development, bundling, and the production build
- JavaScript with JSX
- Tailwind CSS 4 for styling and responsive layout
- Font Awesome for interface icons
- react-toastify for toast notifications (custom-themed to match the UI)
- PropTypes for component prop validation
- ESLint for code-quality checks

**Backend**
- NestJS 12 for the API and module structure
- TypeORM with the `pg` driver for persistence
- PostgreSQL as the database, hosted on Neon (free serverless tier)
- class-validator / class-transformer for request validation
- oxlint for code-quality checks
- Vitest + supertest for unit and end-to-end tests
- `@usebruno/cli` for headless Bruno API runs

## Prerequisites

- Node.js 20 or newer (developed and tested on Node 24)
- npm 10+
- A Neon account (free tier) — https://neon.tech

### Neon database setup

The backend connects to a hosted PostgreSQL database on Neon. After signing up and creating a project, link the CLI from the repository root — this writes `.env.local` (gitignored) with `DATABASE_URL`:

```bash
npm i -g neon@latest
neon login
neon link --project-id <your-project-id> --branch production -y
```

Create a separate database for end-to-end tests, then add its connection URL to `.env.local` as `DATABASE_URL_TEST` (same host and credentials as `DATABASE_URL`, with the database name `student-dashboard-test`):

```bash
neon databases create --branch production --name student-dashboard-test
```

The backend reads `DATABASE_URL` from `.env.local` automatically (see `app.module.ts`).

## Running the Project

You need two terminals. Install dependencies first, then start the backend before the frontend.

### 1. Start the API server

```bash
cd backend
npm install
npm run start:dev
```

The server starts on **http://localhost:3000**. It reads `DATABASE_URL` from the repo-root `.env.local` file created by `neon link`. On its first boot it creates the schema and seeds the 14 original records — look for:

```
[Nest] ... [SeedService] Seeded database with 14 students.
```

Seeding only happens when the table is empty, so your changes are never wiped by a restart.

### 2. Start the frontend

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. Vite proxies requests to `/api/*` to the backend, so no CORS configuration or absolute URLs are needed.

You can verify the API bridge directly by visiting http://localhost:5173/api/students — it should return a JSON array of students.

## API Reference

All endpoints live under the `/api` prefix on port 3000.

| Method | Route | Query params | Description | Responses |
| --- | --- | --- | --- | --- |
| GET | `/api/students` | `q`, `course`, `status`, `minGpa`, `maxGpa` | List students with optional filters (combinable) | 200 |
| GET | `/api/students/:id` | — | Fetch one student | 200, 404 |
| POST | `/api/students` | — | Create a student | 201, 400 |
| PATCH | `/api/students/:id/status` | — | Set status to `Active` or `Suspended` | 200, 400, 404 |
| DELETE | `/api/students/:id` | — | Remove a student | 204, 404 |

### Filtering

All filters are optional and combine together. Filtering runs server-side in `StudentsService`.

- `q` — case-insensitive match on name or course
- `course` — exact match
- `status` — exact match (`Active` or `Suspended`)
- `minGpa` — inclusive lower bound (e.g. `3.5`)
- `maxGpa` — exclusive upper bound (e.g. `3.0`)

The GPA buckets in the UI map as follows: "3.5 and above" → `minGpa=3.5`; "3.0 – 3.49" → `minGpa=3.0&maxGpa=3.5`; "Below 3.0" → `maxGpa=3.0`.

### Example requests

```bash
# All students
curl http://localhost:3000/api/students

# Search by keyword
curl "http://localhost:3000/api/students?q=marine"

# Combine filters
curl "http://localhost:3000/api/students?course=Marine%20Biology&status=Active&minGpa=3.5"

# Create a student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Sandy Cheeks","email":"sandy@science.org","course":"Marine Biology","gpa":4.0}'

# Suspend a student
curl -X PATCH http://localhost:3000/api/students/2/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Suspended"}'

# Delete a student
curl -X DELETE http://localhost:3000/api/students/2
```

### Validation

Requests are validated by a global `ValidationPipe` using `class-validator` DTOs: required fields, a valid email, and a GPA between 0.0 and 4.0. Invalid requests return `400` with a message array. The add form repeats these rules on the client for immediate feedback; the server is authoritative.

## Scripts

### Frontend (root)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on :5173 |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint over the frontend source |
| `npm run preview` | Preview the production build |

### Backend (`backend/`)

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start the API with watch mode on :3000 |
| `npm run start:prod` | Run the compiled `dist/main` |
| `npm run build` | Compile the NestJS app (`nest build`) |
| `npm run lint` | oxlint type-aware lint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Vitest + supertest end-to-end tests (Neon test DB, `DATABASE_URL_TEST`) |
| `npm run test:api` | Headless Bruno run against a running server |

## Testing

Three tiers of automated testing are included:

1. **Unit** — `npm test` (in `backend/`): validates the seed data shape.
2. **End-to-end** — `npm run test:e2e` (in `backend/`): boots the Nest app against a dedicated Neon test database (`student-dashboard-test`), resets the table before seeding (`RESET_DB=true`), and exercises all endpoints with supertest (CRUD, filtering, validation errors, 404s). 11 tests.
3. **API** — `npm run test:api` (in `backend/`, server must be running): runs the Bruno collection headlessly, 7 requests, all asserting on status codes and response bodies.

Frontend lint (`npm run lint`) and build (`npm run build`) run from the repository root.

## API Testing with Bruno

The `api-tests/` folder is a version-controlled Bruno collection that works in both the Bruno desktop app and the CLI.

### Graphical (Bruno app)

1. Open **Bruno** and choose **Open Collection** — select the `api-tests/` folder.
2. Start the backend (see Running the Project).
3. Select the environment **`student-dashboard-local`** from the dropdown next to the URL bar. This defines `baseUrl = http://localhost:3000`. Without it, requests send the literal text `{{baseUrl}}` and fail with an `ENOTFOUND` error.
4. Run requests under `Students/` in order (GETs → POST → PATCH → DELETE). The POST stores the new student's id in `newStudentId`, which the PATCH and DELETE requests reuse.

You can also open any `.bru` request file to see its URL, body, and the `tests {}` block with its assertions.

### Headless (CLI)

```bash
cd backend
npm run test:api
```

Expected summary: `Status: ✓ PASS` with `Requests: 7 (7 Passed)`.

## Persistence

All records live in a hosted PostgreSQL database on Neon. The `DATABASE_URL` in the repo-root `.env.local` (pulled by `neon link`) points at it. Because the database is remote, data survives local restarts, redeploys, and moving machines. On first boot against an empty database the app creates the schema (`synchronize: true`) and seeds the 14 original records.

To reset to the original 14 records, empty the `students` table (or point `DATABASE_URL` at a fresh database) and restart — the app recreates and reseeds the database.

## Deployment

The app is deployed as two services plus a hosted database:

| Service | Host | What runs |
| --- | --- | --- |
| Frontend | Netlify | Static `dist/` from `npm run build` |
| Backend | Vercel | NestJS API on Vercel Functions (zero config) |
| Database | Neon | PostgreSQL (free serverless tier) |

The frontend calls the API through relative `/api/...` URLs. `netlify.toml` rewrites `/api/*` to the backend's Vercel URL (status-200 proxy, so no CORS is needed) and falls back every other route to `index.html` for the SPA.

You can deploy the backend to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnerdrunner1022%2FStudent-Management-Dashboard-R19&project-name=student-dashboard-api&root-directory=backend&branch=full-stack&env=DATABASE_URL&env=RESET_DB)

### Backend (Vercel)

1. Create a new project on Vercel and import the repository (pick the `full-stack` branch).
2. Set **Root Directory** to `backend`.
3. Vercel auto-detects NestJS with **zero configuration** — no build command or output directory to set.
4. Add environment variables: `DATABASE_URL=<your Neon pooled URL>` and `RESET_DB=false`.
5. Deploy. The app runs as a single Vercel Function (Fluid compute); on its first invocation the empty database is auto-created and seeded with the 14 records.
6. Pushes to the linked branch trigger preview and production deploys; the dashboard adds preview URLs and instant rollback.

> The backend is a single stateless function — keep all state in Neon (don't rely on in-memory data between requests). By default functions run in `iad1` (Washington, D.C.); to run closer to the Neon cluster (ap-southeast-1), set `"regions": ["sin1"]` in a `backend/vercel.json`.

### Frontend (Netlify)

1. Create (or reconnect) a site from the repository.
2. Netlify reads `netlify.toml` — build `npm ci && npm run build`, publish `dist/`.
3. In `netlify.toml`, set the `to` value of the `/api/*` redirect to your backend's Vercel URL.
4. Keep the `/api/*` proxy redirect **before** the SPA fallback (`/*`).
5. Deploy from `main` (merge `full-stack` into `main` via a pull request once the backend is live).

### Notes

- The Vercel Hobby plan is free but has monthly usage caps (1M function invocations, 4 CPU-hours Active CPU, 360 GB-hours provisioned memory); the project pauses if you exceed them and resumes the next cycle.
- Keep the e2e tests pointed at `student-dashboard-test` so they never touch production data.

## Project Structure

```
student-dashboard/
├── src/                      # React frontend
│   ├── App.jsx               # page state, data loading, mutation handlers
│   ├── api/studentApi.js     # fetch wrapper for the REST API
│   ├── components/           # Header, SearchBar, AddStudentForm, StudentCard, ToastNotification
│   └── styles/toast.css      # toast theming (design-language overrides)
├── backend/                  # NestJS API
│   └── src/
│       ├── database/         # seed-data.ts + seed.service.ts (RESET_DB-aware)
│       ├── students/         # entity, DTOs, controller, service, module
│       └── main.ts           # prefix /api, ValidationPipe, CORS
├── api-tests/                # Bruno collection (.bru files + environment)
├── .env.local                # Neon connection URLs (gitignored, from `neon link`)
├── neon.ts                   # Neon policy config
├── vite.config.js            # dev proxy /api -> localhost:3000
└── README.md
```

## Requirements Audit

### Task Overview

| Requirement | Status | Evidence |
| --- | --- | --- |
| Build a student management dashboard seeded with data | Satisfied | The backend seeds 14 records from `backend/src/database/seed-data.ts` on first boot and serves them over the API. |
| Provide a clear way to view and manage student records | Satisfied | Student records render as responsive cards with expandable details, status controls, and delete actions backed by the API. |
| Include functionality for finding or narrowing down records | Satisfied | `SearchBar` sends `q` to the API; course, status, and GPA filters map to query params handled server-side. |
| Allow users to add new student information | Satisfied | `AddStudentForm` opens from the add button and POSTs a new active record; success is confirmed by toast. |
| Allow users to remove existing records | Satisfied | Each expanded `StudentCard` deletes the record through the API with confirmation feedback. |
| Handle input and common application states appropriately | Satisfied | Client + server validation, loading/empty/error states, toast feedback, modal open/close, and expandable cards are handled. |

### Development Expectations

| Expectation | Status | Evidence |
| --- | --- | --- |
| Organize the app into reusable React components | Satisfied | UI is separated into `Header`, `SearchBar`, `AddStudentForm`, `StudentCard`, and a custom `ToastNotification` container. |
| Use appropriate React concepts for data and interactions | Satisfied | `useState`, `useEffect`, `useCallback`, controlled inputs, props, callbacks, and conditional rendering are used appropriately. |
| Keep the code readable and logically structured | Satisfied | Frontend concerns live in focused components plus an `api/` client; backend follows NestJS module/service/controller structure with DTOs. |
| Provide basic validation and clear feedback | Satisfied | The add form and the API both validate required fields, email format, and GPA range; errors surface in toasts and a banner. |

### Assessment Areas

| Area | Status | Audit |
| --- | --- | --- |
| React fundamentals | Satisfied | Demonstrates components, JSX, state, props, event handlers, hooks, effects, and conditional rendering. |
| Component design and reusability | Satisfied | `StudentCard` renders every record; search, form, header, and toast behavior are isolated components. |
| State and data handling | Satisfied | `App.jsx` coordinates state with the `studentApi` client; the server is the source of truth and updates come from API responses. |
| User interactions and event handling | Satisfied | Search, filter, add, delete, expand/collapse, status toggling, and modal close actions work through event handlers. |
| Forms and basic validation | Satisfied | The add form validates required values, email format, and GPA range client-side; the API enforces the same rules server-side. |
| Search and filtering logic | Satisfied | Server-side filtering is case-insensitive for name/course and supports course, status, and GPA-range filters, all combinable. |
| Conditional rendering and user feedback | Satisfied | Loading, empty-results, error banner, and success/error toasts give clear feedback alongside expanded details and modals. |
| Code organization, readability, and problem-solving | Satisfied | Small focused components, a dedicated API client, a modular NestJS backend, and three tiers of automated tests. |
| Backend API and persistence | Satisfied | REST CRUD endpoints, server-side filtering, request validation, SQLite persistence with automatic seeding. |

## Known Limitations

- There is no authentication or authorization — an administrator account is assumed.
- No pagination: the API returns complete result sets. Fine for tutorial data, not for large datasets.
- Search uses a simple case-insensitive `ILIKE` match, not full-text or fuzzy matching.
- `maxGpa` is an exclusive bound (deliberate, to keep the "3.0 – 3.49" bucket non-overlapping).
- TypeORM runs with `synchronize: true`, which auto-creates the schema in development; a migration workflow should replace it for production.
- There are no automated frontend (component) tests yet.