# Roam — Vehicle Rental Management System

A complete local academic project with React, Python Flask, MongoDB and an Express API gateway. No paid API keys are needed.

## Architecture

Browser (React/Vite, port 5173) → Express gateway (4000) → Flask REST API (5000) → MongoDB (27017).

Flask owns authentication, database access and business rules. Express forwards /api requests, applies security headers and limits authentication attempts. Vite proxies /api to Express, so no browser CORS configuration is needed.

## Features

- Customer and owner registration, login, password hashing, expiring JWTs and role-based API authorization.
- Search vehicle name/brand/city; filter city, type, fuel, transmission, maximum daily price, and available dates; sort by price or name.
- Vehicle details, pickup/return selection, price estimate, server-calculated booking total and booking history.
- Customer cancellation before pickup day, profile name and phone updates.
- Owner vehicle create/read/update/delete, listing availability toggle, optional HTTPS photo URL, and fleet dashboard.
- Owner approve/reject requests, start and complete rentals. Dashboard shows status counts and completed rental value (not verified payment revenue).
- Overlap prevention via an atomic conditional update on the vehicle document; pending requests reserve dates too.
- Soft deletion preserves booking history; deletion is blocked while reservations remain.
- Responsive desktop/mobile design, error messages, empty states and nine sample vehicles.

## Requirements

- Python 3.10 or newer
- Node.js 20.19+ or 22+ with npm
- MongoDB Community Server running locally, or MongoDB Atlas
- Internet for initial package installation. Fonts are optional and fall back to system fonts.

MongoDB Compass is a viewer, not the database server. Install/start MongoDB Community Server separately or use an Atlas connection URI.

## Windows setup — run in 3 terminals

Extract the ZIP first. Open the extracted vehicle-rental folder in VS Code.

### Terminal 1 — Flask backend (Command Prompt)

```bat
cd backend
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit backend/.env. Replace JWT_SECRET with a random value. Generate one with:

```bat
python -c "import secrets; print(secrets.token_hex(32))"
```

Keep `MONGO_URI=mongodb://127.0.0.1:27017` if using local MongoDB. For Atlas, set your own URI, including the database user's password, and allow your client IP in Atlas. Do not commit .env.

Then:

```bat
python seed.py
python app.py
```

Flask should listen on http://127.0.0.1:5000. If seed fails with a connection timeout, start MongoDB or correct the Atlas URI/network access first.

### Terminal 2 — Express gateway

From the project root:

```bat
cd gateway
npm install
npm start
```

Express listens on http://127.0.0.1:4000. gateway/.env is optional; defaults are already correct. To change ports, copy .env.example to .env and update Vite's proxy accordingly.

### Terminal 3 — React frontend

From the project root:

```bat
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Leave all three terminals running.

### macOS / Linux

Use `python3 -m venv .venv`, `source .venv/bin/activate`, and `cp .env.example .env` instead of the Windows commands. Other commands are the same.

### PowerShell

You can avoid activation policies by invoking `backend\.venv\Scripts\python.exe` directly for pip, seed.py and app.py, while your current directory is backend.

## Demo credentials (after seeding)

| Role | Email | Password |
| --- | --- | --- |
| Customer | customer@roam.demo | DemoPass123! |
| Owner | owner@roam.demo | DemoPass123! |

Seeding adds missing demo accounts and vehicles without clearing the database. You may register new accounts too. New owners start with an empty fleet. Do not seed these public demo passwords into a real deployment.

## Demo walkthrough

1. Log in as customer. Search Chennai and choose a car.
2. Pick a future pickup date and a later return date. Request booking.
3. Log out and log in as owner. Open Rental requests and approve it.
4. Log in as customer to see confirmation or cancel before pickup day.
5. On pickup day, owner can Start rental and later Complete it.
6. Owner → My fleet → Add vehicle; edit rate, mark unavailable or delete it when it has no active reservations.
7. Click your name to edit profile.

Bookings progress `pending → confirmed → active → completed`; owner may reject pending bookings, and customers may cancel pending/confirmed bookings before pickup. Completed/rejected/cancelled bookings are retained as history and cannot be edited/deleted. Vehicle CRUD is fully supported; bookings use controlled status changes instead of unsafe arbitrary edits.

## Rental rules

- Dates are calendar days using the backend computer's date. Pickup must be today or later; maximum duration is 90 days.
- Return is exclusive: Oct 10 to Oct 12 is two charged days. Adjacent bookings may share a return/pickup date.
- Integer INR/day rates; quote contains rental cost only, with no payment gateway, tax, deposit or fuel calculation.
- Payment is offline at pickup; this app does not process or verify money.
- Pending requests reserve dates until owner rejection or customer cancellation. There is no automatic expiry.
- Owners cannot book with an owner account. Customers cannot change vehicles or approve rentals.
- Existing booking prices remain unchanged when owners edit listing rates.
- Vehicle photos use optional external HTTPS URLs; empty photos use built-in vehicle illustrations. No image upload service is included.

## Tests

```bat
cd backend
pip install -r requirements-dev.txt
python -m pytest -q
```

Tests use an isolated mongomock database, not your real MongoDB data. They cover server pricing, overlap rejection, adjacent dates, cancellation, authorization, filters and vehicle CRUD. They do not replace a real MongoDB concurrency/deployment test.

Frontend production bundle check:

```bat
cd frontend
npm run build
```

`npm run dev` is the documented local workflow. Vite preview does not provide the API proxy used in development. Production hosting needs an HTTPS reverse proxy serving the built frontend and forwarding /api to Express, with Flask behind a production WSGI server.

## API reference

All private routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Access / purpose |
| --- | --- | --- |
| GET | /api/health | MongoDB connectivity |
| POST | /api/auth/register | name, email, password, role |
| POST | /api/auth/login | email, password; returns JWT/user |
| GET / PUT | /api/profile | Authenticated; name and phone updates |
| GET | /api/vehicles | Public filtered listing, maximum 200 results |
| GET | /api/vehicles/:id | Public details |
| POST | /api/vehicles | Owner create |
| PUT / DELETE | /api/vehicles/:id | Owning owner only |
| GET | /api/owner/vehicles | Owner's fleet |
| POST | /api/bookings | Customer: vehicle_id, start, end |
| GET | /api/bookings | Current user's customer/owner bookings |
| PATCH | /api/bookings/:id | Authorized transition: status |

Collections: users, vehicles, bookings. IDs are UUID strings. Unique indexes protect emails and vehicle registration numbers. Vehicle documents embed date reservations to make competing booking acquisition atomic.

## Reliability / project scope

This is a functional academic/local project, not a commercial rental platform. Real deployment needs identity/license verification, payment integration, email delivery, operational logging, HTTPS, backups, abuse controls, and comprehensive browser testing. No email/SMS/Google-login service is simulated.

Vehicle reservation and booking records are two writes: ordinary insertion failures release reservations, but a process crash between writes can leave an orphan reservation. A crash during a terminal status update can also leave a reservation held. Before commercial use, use MongoDB replica-set transactions or a durable reconciliation job. Rentals are reserved by scheduled dates; overdue returns are not automatically extended, so staff must handle delays operationally. The project deliberately does not claim crash-safe cross-document transactions.

## Troubleshooting

- `JWT_SECRET` error: create backend/.env and set a value at least 32 characters long.
- Database timeout: MongoDB Server is not running or Atlas access/URI is incorrect.
- Server unavailable / 502: run Flask and Express, verify their ports.
- Login expired: tokens last 8 hours; log out and log in again.
- Booking unavailable: dates overlap another pending/confirmed/active reservation, or listing is disabled.
- Delete blocked: finish/reject/cancel outstanding bookings first.
- Port in use: stop the old process or update backend/.env, gateway/.env and frontend/vite.config.js consistently.
- Need different frontend port: `npm run dev -- --port 3000`.

No node_modules, Python virtual environment, passwords from real accounts, or database data are included in this ZIP.
