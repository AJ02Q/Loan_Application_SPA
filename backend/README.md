# Loan App Backend (Express + SQLite)

Implements the API described in the project PDF: authentication, loans listing/filtering, creation, and status updates with role protection.

## Tech
- Node.js (Express)
- SQLite (file DB)
- JWT auth, bcrypt password hashing
- CORS + Helmet

## Quick start

```bash
cd backend
cp .env.example .env
# edit JWT_SECRET in .env to a long random string

npm install
npm run dev   # or: npm start
```

- Server listens on `http://localhost:4000`
- Health check: `GET /health`

## Endpoints
- `POST /auth/login` — returns a JWT (8h expiry) for valid credentials  
  Request JSON: `{ "username": "manager@branch.local", "password": "Passw0rd!" }`
- `GET /loans?status=Pending|Approved|Rejected` — list, filtered by optional `status`
- `GET /loans/:id` — get single loan
- `POST /loans` — create: `{ application_number, applicant_name, loan_amount, status? }`
- `PUT /loans/:id/status` — update status from **Pending** → `Approved`/`Rejected`

> All `/loans` routes require `Authorization: Bearer <token>` and the `branch_manager` role.

## Seed & Credentials
On first run, the DB is initialized with:
- **User:** `manager@branch.local` / **Password:** `Passw0rd!`
- A few demo loans

## Project commands
- `npm run dev` — start with nodemon
- `npm start` — start once

## Notes
- DB file path is configurable via `DB_FILE` in `.env`.
- Passwords are stored hashed with bcrypt.
- JWT secret must be set; keep it private.
