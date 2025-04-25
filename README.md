# books-server

A powerful and modular **NestJS** API for managing books, users, roles, and reviews, built with **Fastify**, **TypeORM**, and **PostgreSQL**.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Endpoints](#endpoints)
  - [Authentication](#authentication)
  - [Role Management](#role-management)
  - [Users](#users)
  - [Reviews](#reviews)
- [Testing](#testing)
- [License](#license)

---

## Features

- **JWT Authentication** with access token verification
- **Role-Based Access Control** (Promote users to `Admin`)
- **User Management** (Create, read, update, delete; pagination)
- **Review Management** (CRUD operations with pagination)
- **Fastify** adapter for high performance
- **TypeORM** integration with **PostgreSQL**
- **Swagger** (OpenAPI 3) documentation
- **i18n** support via `nestjs-i18n`
- **Throttling** to protect against brute-force attacks

---

## Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x or pnpm ≥ 7.x or Yarn ≥ 1.x
- PostgreSQL ≥ 12.x

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/l0cass/books-server.git
   cd books-server
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```ini
NODE_ENV=development


# Application
PORT=3000


# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_DATABASE=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=books_db


# JWT (JSON Web Token)
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600s


# Throttler
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

---

## Running the Application

- **Development:**
  ```bash
  pnpm run start:dev
  ```

- **Production Build + Start:**
  ```bash
  pnpm run build
  pnpm run start:prod
  ```

- **Debug Mode:**
  ```bash
  pnpm run start:debug
  ```

---

## Available Scripts

```bash
pnpm run build          # Builds the application
pnpm run format         # Formats code with Prettier
pnpm run lint           # Lints & fixes code with ESLint
pnpm run start          # Runs the app in production (dist)
pnpm run start:dev      # Runs the app in watch mode
pnpm run start:debug    # Runs the app in debug mode
pnpm run test           # Runs unit tests with Jest
pnpm run test:cov       # Runs tests with coverage report
pnpm run test:e2e       # Runs end-to-end tests
```

---

## API Documentation

After starting the application, access the **Swagger UI** at:

```
http://localhost:${process.env.PORT || 3000}/docs
```

Use it to explore all endpoints, request/response schemas, and try out the API interactively.

---

## Endpoints

### Authentication

- **POST** `/api/auth/log-in`
  Authenticate user and receive an access token.

  Example request:
  ```bash
  curl -X POST "http://localhost:3000/api/auth/log-in" \
  -H "Content-Type: application/json" \
  -d '{"email": "john@exemple.com", "password": "passW@rd1"}'
  ```

- **GET** `/api/auth/verify`
  Verify if the access token is valid.

  Example request:
  ```bash
  curl -X GET "http://localhost:3000/api/auth/verify" -H "Authorization: Bearer <your-access-token>"
  ```

### Role Management

- **POST** `/api/role/promote/admin/{id}`
  Promote a user to Admin (**Admin only**).

  Example request:
  ```bash
  curl -X POST "http://localhost:3000/api/role/promote/admin/{id}" \
  -H "Authorization: Bearer <your-access-token>"
  ```

### Users

- **GET** `/api/user`
  Get all users (paginated). Requires auth.

  Example request:
  ```bash
  curl -X GET "http://localhost:3000/api/user?page=1&limit=10" \
  -H "Authorization: Bearer <your-access-token>"
  ```

- **GET** `/api/user/{id}`
  Get user by ID (Admin only).

  Example request:
  ```bash
  curl -X GET "http://localhost:3000/api/user/{id}" \
  -H "Authorization: Bearer <your-access-token>"
  ```

- **POST** `/api/user/create`
  Create a new user.

  Example request:
  ```bash
  curl -X POST "http://localhost:3000/api/user/create" \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@exemple.com", "displayName": "New User", "password": "newPassword123"}'
  ```

- **PATCH** `/api/user/update`
  Update current authenticated user.

  Example request:
  ```bash
  curl -X PATCH "http://localhost:3000/api/user/update" \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "Updated Name", "password": "newPassword123"}'
  ```

- **DELETE** `/api/user/delete`
  Delete current authenticated user.

  Example request:
  ```bash
  curl -X DELETE "http://localhost:3000/api/user/delete" \
  -H "Authorization: Bearer <your-access-token>"
  ```

### Reviews

- **GET** `/api/review`
  Get all reviews (paginated). Requires auth.

  Example request:
  ```bash
  curl -X GET "http://localhost:3000/api/review?page=1&limit=10" \
  -H "Authorization: Bearer <your-access-token>"
  ```

- **GET** `/api/review/{id}`
  Get a single review by ID.

  Example request:
  ```bash
  curl -X GET "http://localhost:3000/api/review/{id}" \
  -H "Authorization: Bearer <your-access-token>"
  ```

- **POST** `/api/review/create`
  Create a new book review.

  Example request:
  ```bash
  curl -X POST "http://localhost:3000/api/review/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-access-token>" \
  -d '{"title": "Amazing Book", "content": "This book was amazing because...", "authors": ["Author 1"], "rating": "5"}'
  ```

- **PATCH** `/api/review/update/{id}`
  Update a review by ID.

  Example request:
  ```bash
  curl -X PATCH "http://localhost:3000/api/review/update/{id}" \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Review Title", "content": "Updated content."}'
  ```

- **DELETE** `/api/review/delete/{id}`
  Delete a review by ID.

  Example request:
  ```bash
  curl -X DELETE "http://localhost:3000/api/review/delete/{id}" \
  -H "Authorization: Bearer <your-access-token>"
  ```

---

## Testing

- **Unit tests:**
  ```bash
  pnpm run test
  ```
- **Coverage report:**
  ```bash
  pnpm run test:cov
  ```
- **End-to-end tests:**
  ```bash
  pnpm run test:e2e
  ```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
# nestjs-books-server
