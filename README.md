# FixMyCity

A full-stack civic issue-reporting platform that allows citizens to report public issues and enables administrators to manage, assign, and resolve them.

**Live Demo:** [fix-my-city--koppadipranayku.replit.app](https://fix-my-city--koppadipranayku.replit.app)

---

## Overview

FixMyCity connects citizens with city administrators. Citizens can report problems like potholes, broken streetlights, garbage dumps, and water leaks. Admins can view all reports, assign them to workers, and mark them as resolved.

---

## Architecture

```
FixMyCity/
├── frontend/
│   ├── citizen-app/        # React app for citizens  (served at /)
│   └── admin-app/          # React app for admins    (served at /admin)
└── backend/
    └── fixmycity-api/      # Spring Boot REST API    (served at /api)
```

All three are served from a **single published URL** via Spring Boot's static file serving and path-based routing.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, Vite, React Router v6 |
| Styling   | CSS Modules                             |
| Backend   | Spring Boot 3, Java 19                  |
| Database  | PostgreSQL (Replit managed)             |
| ORM       | Spring Data JPA / Hibernate             |
| Auth      | JWT (JSON Web Tokens)                   |

---

## Features

### Citizen App (`/`)
- Register and log in as a citizen
- Browse and search all reported civic issues
- Report a new issue with title, description, category, location and image
- Track your own submitted reports and their status

### Admin App (`/admin`)
- Secure admin login
- Dashboard with summary stats (total, reported, in-progress, resolved)
- View and filter all issues
- Manage workers (add, view)
- Assign issues to workers
- Mark issues as resolved with resolution notes
- Analytics overview

### Backend API (`/api`)
| Endpoint              | Description                  |
|-----------------------|------------------------------|
| `POST /api/auth/**`   | Register / Login             |
| `GET/POST /api/issues`| List and create issues       |
| `GET/PUT /api/admin`  | Admin issue management       |
| `GET/POST /api/workers`| Worker management           |
| `GET/POST /api/assignments` | Issue assignments      |
| `GET /api/dashboard`  | Stats and summary data       |

---

## Local Development Setup

### Prerequisites
- Java 19+
- Node.js 18+ and npm
- PostgreSQL (local) **or** use the Replit database remotely

### 1. Clone the repo
```bash
git clone https://github.com/koppadipranayku/FixMyCity.git
cd FixMyCity
```

### 2. Set up backend environment variables

Create `backend/fixmycity-api/.env` with your database credentials:
```
PGHOST=your-db-host
PGPORT=5432
PGDATABASE=fixmycity
PGUSER=your-db-user
PGPASSWORD=your-db-password
```

> If using the Replit database, grab these values from the Secrets tab in Replit.
> **Never commit this file to git** — it is already listed in `.gitignore`.

### 3. Run the backend
```bash
cd backend/fixmycity-api

# Mac/Linux
export $(cat .env | xargs) && ./mvnw spring-boot:run

# Windows (PowerShell)
Get-Content .env | ForEach-Object { $k,$v = $_ -split '=',2; [System.Environment]::SetEnvironmentVariable($k,$v) }
./mvnw spring-boot:run
```
Backend starts at `http://localhost:8080`

### 4. Run the citizen app
```bash
cd frontend/citizen-app
npm install
npm run dev
```
Opens at `http://localhost:5173`

### 5. Run the admin app
```bash
cd frontend/admin-app
npm install
npm run dev
```
Opens at `http://localhost:5000`

> The Vite dev servers proxy all `/api` requests to `localhost:8080` automatically — no extra config needed.

---

## Deployment

The app is deployed on **Replit Autoscale**.

The deployment build command runs in order:
1. Build citizen app → outputs to `backend/.../static/`
2. Build admin app → outputs to `backend/.../static/admin/`
3. Package Spring Boot → bundles both frontends into the JAR

To redeploy after changes:
1. Push your changes to git
2. Pull into Replit (`git pull`)
3. Click **Republish** in Replit's deployment panel

---

## Project Structure

```
backend/fixmycity-api/
├── src/main/java/com/fixmycity_api/
│   ├── admin/          # Admin controllers
│   ├── auth/           # Auth (JWT login/register)
│   ├── config/         # Security, CORS, SPA routing
│   ├── dashboard/      # Stats endpoint
│   ├── issue/          # Issue entity, repo, service, controller
│   ├── user/           # User entity
│   └── worker/         # Worker + Assignment management
└── src/main/resources/
    ├── static/         # Built citizen app (auto-generated)
    │   └── admin/      # Built admin app (auto-generated)
    └── application.properties

frontend/
├── citizen-app/src/pages/
│   ├── Home/           # Landing page
│   ├── Issues/         # Browse all issues
│   ├── Login/          # Citizen login
│   ├── Register/       # Citizen registration
│   ├── ReportIssue/    # Submit a new issue
│   └── MyReports/      # View own reports
└── admin-app/src/pages/
    ├── Dashboard/       # Stats overview
    ├── Issues/          # Manage all issues
    ├── Workers/         # Manage workers
    ├── Assignments/     # Manage assignments
    ├── Analytics/       # Analytics view
    └── Login/           # Admin login
```

---

## License

This project is for educational purposes.
