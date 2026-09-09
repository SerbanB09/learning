# Restaurant Booking API

A RESTful backend API for managing restaurant reservations — accounts, venues, floor plans, and bookings, with JWT authentication and account-level data isolation.

Built as a learning project to explore TypeScript, Prisma ORM (MongoDB), and building a properly authenticated, multi-tenant REST API from scratch.

## Stack

- **Language:** TypeScript
- **Framework:** Node.js + Express
- **ORM:** Prisma (MongoDB)
- **Database:** MongoDB (local via Docker, MongoDB Atlas Local image)
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **API Testing:** Bruno (collection included in `bruno/`)

## Features

- Full CRUD for 7 resources: Accounts, Users, Venues, Areas, Table Types, Tables, Bookings
- JWT authentication on every protected route
- Account-level data isolation — every request is scoped to the authenticated user's account, at every level of the hierarchy (even resources like `areas` and `tables`, which don't store `account_id` directly, are checked through their parent `venue`)
- Ownership of related IDs (`venue_id`, `area_id`, `table_type_id`, `table_id`) is verified server-side on create — never trusted from the request body
- Booking conflict detection — prevents double-booking the same table within a 2-hour window
- Role-based fields (`admin` / `member`) carried in the JWT
- Centralized error handling (`AppError` + Express error middleware) with consistent JSON error responses
- Request validation via Zod on every write endpoint

## Data Model

```
accounts
  ├── users         (account_id)
  ├── venues        (account_id)
  │     └── areas         (venue_id)
  │           └── tables        (area_id, table_type_id)
  └── table_types   (account_id)

bookings  (user_id, venue_id, table_id)
```

## Getting Started

**Requirements:** Node.js, Docker.

```bash
# 1. Install dependencies
npm install

# 2. Copy the env file and fill in your own JWT secret
cp .env.example .env

# 3. Start MongoDB
docker compose up -d

# 4. Generate the Prisma client
npx prisma generate

# 5. Seed the database with demo data
npm run seed

# 6. Start the dev server
npm run dev
```

The seed script creates a demo account with two users:

| Role   | Email             | Password      |
|--------|-------------------|----------------|
| admin  | admin@demo.com    | password123    |
| member | member@demo.com   | password123    |

It also creates a venue, an area, a table type, a table, and one booking, so the API is immediately usable after setup.

## Authentication

Log in via `POST /users/login` to get a JWT. Send it on every subsequent request as:

```
Authorization: Bearer <token>
```

Tokens expire after 1 day.

## API Endpoints

All endpoints below except `POST /users`, `POST /users/login`, and `POST /accounts` require a valid Bearer token.

### Auth
| Method | Endpoint            | Description         |
|--------|----------------------|----------------------|
| POST   | `/users/login`       | Log in, returns JWT  |

### Accounts
| Method | Endpoint          | Description                          |
|--------|-------------------|---------------------------------------|
| POST   | `/accounts`       | Create an account (public — sign-up)  |
| GET    | `/accounts`       | Get your own account                  |
| GET    | `/accounts/:id`   | Get account by id (must be your own)  |
| PATCH  | `/accounts/:id`   | Update your account                   |
| DELETE | `/accounts/:id`   | Delete your account                   |

### Users
| Method | Endpoint        | Description                                  |
|--------|-----------------|------------------------------------------------|
| POST   | `/users`        | Create a user under an existing account        |
| GET    | `/users`        | List users in your account                     |
| GET    | `/users/:id`    | Get a user (must be in your account)            |
| PUT    | `/users/:id`    | Update a user (self, or any user if admin)      |
| DELETE | `/users/:id`    | Delete a user in your account                   |

### Venues
| Method | Endpoint         | Description                        |
|--------|------------------|--------------------------------------|
| POST   | `/venues`        | Create a venue                       |
| GET    | `/venues`        | List venues in your account          |
| GET    | `/venues/:id`    | Get a venue                          |
| PATCH  | `/venues/:id`    | Update a venue                       |
| DELETE | `/venues/:id`    | Delete a venue                       |

### Table Types
| Method | Endpoint              | Description                     |
|--------|------------------------|-----------------------------------|
| POST   | `/table_types`         | Create a table type               |
| GET    | `/table_types`         | List table types in your account  |
| GET    | `/table_types/:id`     | Get a table type                  |
| PATCH  | `/table_types/:id`     | Update a table type               |
| DELETE | `/table_types/:id`     | Delete a table type               |

### Areas
| Method | Endpoint        | Description                                     |
|--------|-----------------|----------------------------------------------------|
| POST   | `/areas`        | Create an area under a venue you own                |
| GET    | `/areas`        | List areas across all your venues                   |
| GET    | `/areas/:id`    | Get an area                                          |
| PATCH  | `/areas/:id`    | Update an area                                       |
| DELETE | `/areas/:id`    | Delete an area                                       |

### Tables
| Method | Endpoint         | Description                                              |
|--------|------------------|--------------------------------------------------------------|
| POST   | `/tables`        | Create a table under an area/table type you own                |
| GET    | `/tables`        | List tables across all your areas                              |
| GET    | `/tables/:id`    | Get a table                                                     |
| PATCH  | `/tables/:id`    | Update a table                                                  |
| DELETE | `/tables/:id`    | Delete a table                                                  |

### Bookings
| Method | Endpoint            | Description                                              |
|--------|---------------------|--------------------------------------------------------------|
| POST   | `/bookings`         | Create a booking (rejects overlapping bookings on the same table) |
| GET    | `/bookings`         | List your own bookings                                         |
| GET    | `/bookings/:id`     | Get a booking                                                   |
| PATCH  | `/bookings/:id`     | Update a booking (re-checks conflicts if table/date changes)    |
| DELETE | `/bookings/:id`     | Delete a booking                                                |

## Testing

A Bruno collection is included under `bruno/Learning` with requests for every endpoint, including a login flow that auto-captures the JWT.

Automated tests:
```bash
npm test
```

## Project Structure

```
src/
  controllers/   — request handlers, one file per resource
  routes/        — Express routers, one file per resource
  schemas/       — Zod validation schemas
  middlewares/   — auth, validation, centralized error handling
  errors/        — AppError class
  manager/       — Prisma client instance
prisma/
  schema.prisma  — data model
  seed.ts        — demo data seed script
```
