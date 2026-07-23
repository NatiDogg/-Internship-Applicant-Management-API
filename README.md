# Internship-Applicant-Management-API

Internship Applicant Management REST API with JWT authentication, search, filtering, pagination, and dashboard analytics.

## Tech Stack

* **Framework:** NestJS (Node.js & TypeScript)
* **Database & ORM:** PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
* **Authentication:** Passport.js (`passport-jwt`), JSON Web Tokens (JWT), and `bcryptjs`
* **Validation & DTOs:** `class-validator`, `class-transformer`
* **API Documentation:** OpenAPI / Swagger (`@nestjs/swagger`)

## Features & Implemented Business Rules

* **Secure Administrator Auth:** Password hashing via `bcryptjs` and stateless JWT bearer token authentication on protected endpoints.
* **Email Uniqueness & Normalization:** All emails are automatically converted to lowercase on input and seeding to prevent case sensitivity duplicate errors.
* **Status Transition Rules:** Business rule enforcement preventing `REJECTED` applicants from jumping directly to `ACCEPTED`.
* **Notes Validation:** Internal administrative notes validation enforced to not exceed 1,000 characters.
* **Soft Delete Architecture:** Soft deletion via `deletedAt` timestamps. Soft deleted records are automatically filtered out from all active queries, searches, and dashboard metrics.
* **Dashboard Analytics:** High performance summary stats providing total, active, deleted, track, and status counts (ensuring 0 count defaults for empty categories).
* **Filtering, Searching & Pagination:** Full text search on `name` or `email`, filterable by `track` and `status`, with paginated metadata (`page`, `limit`, `totalCount`, `totalPages`).

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js:** v18.x or higher
* **npm:** v9.x or higher
* **PostgreSQL:** Running locally or hosted (e.g. Neon)

---

### 2. Installation & Setup

1. **Clone the Repository:**
   git clone <https://github.com/NatiDogg/-Internship-Applicant-Management-API>

2. **Install Dependency:**
   npm install

3. **Configure Environment Variables:**
    Copy .env.example to create your local .env file:
    cp .env.example .env
    Update DATABASE_URL and JWT_SECRET in .env if necessary.

4. **Run Database Migrations:**
    npx prisma migrate dev --name init

5. **Seed Default Admin & Sample Applicants:**
    npx prisma db seed
    Seeded Admin Credentials:
    Email: admin@infonova.com
    Password: admin123

5. **Running the Application:** 
    # Development mode (with auto-reload)
       npm run start:dev
    # Production build
       npm run build
       npm run start:prod


Once running, the server listens at: http://localhost:3000/api

Interactive OpenAPI / Swagger UI documentation is built in and accessible at:  http://localhost:3000/api/docs 



## Architecture Overview

src/
├── auth/                 # JWT strategy, guards, and Auth Controller/Service
│   ├── dto/              # Auth request validation schemas
│   ├── guards/           # JwtAuthGuard
│   └── strategies/       # Passport JWT Strategy
├── applicants/           # Applicants resource module
│   ├── dto/              # Create/Update/Status/Notes DTOs
│   ├── applicants.controller.ts
│   └── applicants.service.ts
├── dashboard/            # Admin analytics & summary statistics
├── prisma/               # Custom Prisma Service wrapper & module
└── utils/                # Bcrypt password hashing utilities


## Endpoint Summary

## 🔗 Endpoint Summary

<table>
  <thead>
    <tr>
      <th align="center">Method</th>
      <th align="left">Endpoint</th>
      <th align="left">Description</th>
      <th align="center">Auth Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><code>POST</code></td>
      <td><code>/api/auth/login</code></td>
      <td>Authenticate admin & receive JWT token</td>
      <td align="center">❌ No</td>
    </tr>
    <tr>
      <td align="center"><code>GET</code></td>
      <td><code>/api/auth/me</code></td>
      <td>Get current authenticated admin profile</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>GET</code></td>
      <td><code>/api/applicants</code></td>
      <td>List applicants (Paginated, Searchable, Filterable)</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>POST</code></td>
      <td><code>/api/applicants</code></td>
      <td>Create a new internship application</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>GET</code></td>
      <td><code>/api/applicants/:id</code></td>
      <td>Get single applicant details by ID</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>PATCH</code></td>
      <td><code>/api/applicants/:id</code></td>
      <td>Update applicant general details</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>DELETE</code></td>
      <td><code>/api/applicants/:id</code></td>
      <td>Soft-delete an applicant</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>PATCH</code></td>
      <td><code>/api/applicants/:id/status</code></td>
      <td>Update status (<code>PENDING</code>, <code>SHORTLISTED</code>, <code>ACCEPTED</code>, <code>REJECTED</code>)</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>PATCH</code></td>
      <td><code>/api/applicants/:id/notes</code></td>
      <td>Update internal administrative notes (max 1,000 chars)</td>
      <td align="center">🔒 Yes</td>
    </tr>
    <tr>
      <td align="center"><code>GET</code></td>
      <td><code>/api/dashboard/summary</code></td>
      <td>Get high-level analytics & summary statistics</td>
      <td align="center">🔒 Yes</td>
    </tr>
  </tbody>
</table>