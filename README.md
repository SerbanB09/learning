# Restaurant Booking API *(in progress)*

A RESTful backend API for managing restaurant reservations, built to explore TypeScript, Prisma ORM, MongoDB, and JWT authentication in a real-world project structure.

## Stack

- **Language:** TypeScript
- **Framework:** Node.js + Express
- **ORM:** Prisma
- **Database:** MongoDB (Docker — MongoDB Atlas Local)
- **Auth:** JWT + bcrypt
- **API Testing:** Bruno

## Features

- Full CRUD for 7 resources: Accounts, Users, Venues, Areas, Table Types, Tables, Bookings
- JWT authentication middleware applied per route
- Ownership-based authorization — queries scoped to the authenticated user's `id` or `account_id` from the JWT payload, never trusted from the request body
- Password hashing with bcrypt on user creation

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
