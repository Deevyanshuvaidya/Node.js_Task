# User Management API

A secure and scalable **User Management REST API** built with **Node.js, Express.js, PostgreSQL, Sequelize, JWT, and bcryptjs**.

The application provides user registration and authentication, JWT-based authorization, role-based access control, user profile retrieval, and administrative user management. The project follows a modular backend architecture with separate routes, controllers, middleware, models, database configuration, migrations, and seeders.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Technology Stack](#-technology-stack)
* [Project Architecture](#-project-architecture)
* [Project Structure](#-project-structure)
* [User Roles](#-user-roles)
* [Authentication Flow](#-authentication-flow)
* [Authorization Flow](#-authorization-flow)
* [API Endpoints](#-api-endpoints)
* [Database Design](#-database-design)
* [Environment Variables](#-environment-variables)
* [Prerequisites](#-prerequisites)
* [Installation](#-installation)
* [Database Setup](#-database-setup)
* [Running the Project](#-running-the-project)
* [Creating the Super Admin](#-creating-the-super-admin)
* [API Usage](#-api-usage)
* [Response Examples](#-response-examples)
* [How the Project Works](#-how-the-project-works)
* [Security](#-security)
* [Development Notes](#-development-notes)
* [Future Improvements](#-future-improvements)
* [Contributing](#-contributing)
* [Author](#-author)
* [License](#-license)

---

# 📖 Overview

The **User Management API** is a backend application designed to demonstrate how a production-style user authentication and authorization system can be implemented using Node.js.

The application provides:

* User registration
* Secure password hashing
* User login
* JWT token generation
* JWT token verification
* Role-based access control
* Current-user profile retrieval
* Administrative user creation
* Super Admin user update
* Super Admin user deletion
* PostgreSQL database integration
* Sequelize ORM
* Database migrations
* Database seeders

The application separates responsibilities into different layers, making the codebase easier to understand, maintain, test, and extend.

---

# ✨ Features

## 🔐 Authentication

The application provides a complete authentication flow.

### User Registration

New users can register by providing:

* Name
* Email
* Password

Passwords are never stored as plain text. Before being stored in PostgreSQL, passwords are hashed using `bcryptjs`.

### User Login

Registered users can authenticate using their email and password.

During login:

1. The user provides their email and password.
2. The application searches for the user in PostgreSQL.
3. The supplied password is compared with the stored bcrypt hash.
4. If the credentials are valid, a JWT token is generated.
5. The token contains the authenticated user's ID and role.
6. The token expires after one day.

---

# 👥 User Management

The API supports multiple user-management operations.

### Regular User

A regular authenticated user can retrieve their own profile.

### Admin

An Admin can create new users.

### Super Admin

A Super Admin has the highest level of access and can:

* Create users
* Update users
* Delete users

The role system is implemented through dedicated authorization middleware.

---

# 🛡️ Role-Based Access Control

The application implements three user roles:

| Role         | Permissions                       |
| ------------ | --------------------------------- |
| `USER`       | Access own profile                |
| `ADMIN`      | Access own profile + create users |
| `SUPERADMIN` | Full user management              |

The authorization middleware checks the role stored inside the verified JWT payload before allowing access to protected administrative routes.

This prevents users from accessing operations that are outside their assigned permissions.

---

# 🛠️ Technology Stack

## Backend

* **Node.js** — JavaScript runtime
* **Express.js** — Web application framework
* **JavaScript (CommonJS)** — Application language/module system

## Database

* **PostgreSQL** — Relational database
* **Sequelize** — ORM for PostgreSQL
* **Sequelize CLI** — Database migrations and seeders

## Authentication & Security

* **JWT (`jsonwebtoken`)** — Authentication tokens
* **bcryptjs** — Password hashing and password verification
* **dotenv** — Environment variable management

## Development

* **Nodemon** — Development server auto-restart

The project's `package.json` currently includes Express 5, Sequelize 6, PostgreSQL support through `pg`, bcryptjs, jsonwebtoken, dotenv, Sequelize CLI, and Nodemon.

---

# 🏗️ Project Architecture

The application follows a modular backend architecture:

```text
Client
   │
   ▼
Express Routes
   │
   ▼
Authentication Middleware
   │
   ▼
Role Middleware
   │
   ▼
Controllers
   │
   ▼
Sequelize Models
   │
   ▼
PostgreSQL Database
```

Each layer has a specific responsibility.

### Routes

Routes define the API endpoints and connect requests to the appropriate controllers.

### Middleware

Middleware handles:

* JWT authentication
* Role-based authorization

### Controllers

Controllers contain the business logic for:

* Registration
* Login
* User retrieval
* User creation
* User update
* User deletion

### Models

Sequelize models define the database structure and provide database access.

### Migrations

Migrations create and modify database tables in a controlled and repeatable manner.

### Seeders

Seeders insert initial data into the database, such as the Super Admin account.

---

# 📂 Project Structure

```text
user-management/
│
├── config/
│   └── config.js
│
├── controllers/
│   ├── auth.controller.js
│   └── user.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── role.middleware.js
│
├── migrations/
│   └── 20251215175958-create-users.js
│
├── models/
│   ├── index.js
│   └── user.js
│
├── routes/
│   ├── auth.routes.js
│   └── user.routes.js
│
├── seeders/
│   └── 20251215182107-superadmin-seed.js
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
└── .env
```

The repository currently contains separate `config`, `controllers`, `middleware`, `migrations`, `models`, `routes`, and `seeders` directories, together with `app.js` and `server.js`.

---

# 🔑 Authentication Flow

The authentication system works as follows.

## 1. Registration

```text
POST /api/auth/register
```

The user submits:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

The password is hashed using bcrypt:

```text
Plain Password
      │
      ▼
   bcryptjs
      │
      ▼
Hashed Password
      │
      ▼
PostgreSQL
```

The authentication controller uses bcrypt hashing during registration.

---

## 2. Login

```text
POST /api/auth/login
```

The application:

1. Finds the user by email.
2. Compares the supplied password with the stored bcrypt hash.
3. Rejects invalid credentials.
4. Creates a JWT for valid credentials.

The JWT contains:

```json
{
  "id": 1,
  "role": "USER"
}
```

and is configured to expire after one day.

---

## 3. Sending the JWT

Protected endpoints require the token in the HTTP `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

The authentication middleware extracts the token, verifies it using `JWT_SECRET`, and places the decoded user information on `req.user`.

---

# 🔒 Authorization Flow

Authentication answers:

> "Who is the user?"

Authorization answers:

> "Is this user allowed to perform this operation?"

After authentication, the role middleware checks the user's role.

For example:

```text
SUPERADMIN
     │
     ├── Create User
     ├── Update User
     └── Delete User
```

while:

```text
ADMIN
  │
  └── Create User
```

and:

```text
USER
  │
  └── View Own Profile
```

The role middleware returns `403 Forbidden` when the authenticated user does not have an allowed role.

---

# 🌐 API Endpoints

The application exposes two primary API groups:

```text
/api/auth
/api/users
```

These are registered in `app.js`.

## Authentication Endpoints

| Method | Endpoint             | Authentication | Description                       |
| ------ | -------------------- | -------------- | --------------------------------- |
| `POST` | `/api/auth/register` | No             | Register a new user               |
| `POST` | `/api/auth/login`    | No             | Authenticate user and receive JWT |

The authentication routes are implemented in `routes/auth.routes.js`.

---

# 👤 User Endpoints

| Method   | Endpoint         | Required Role         | Description                |
| -------- | ---------------- | --------------------- | -------------------------- |
| `GET`    | `/api/users/me`  | Authenticated         | Get current user's profile |
| `POST`   | `/api/users`     | `ADMIN`, `SUPERADMIN` | Create a new user          |
| `PUT`    | `/api/users/:id` | `SUPERADMIN`          | Update a user              |
| `DELETE` | `/api/users/:id` | `SUPERADMIN`          | Delete a user              |

The route definitions explicitly apply authentication and role middleware to the administrative operations.

---

# 🗄️ Database Design

The project uses **PostgreSQL** with **Sequelize ORM**.

The main database table is:

```text
Users
```

## User Fields

| Field        | Type    | Description               |
| ------------ | ------- | ------------------------- |
| `id`         | INTEGER | Primary key               |
| `name`       | STRING  | User's name               |
| `email`      | STRING  | Unique user email         |
| `password`   | STRING  | Hashed password           |
| `role`       | ENUM    | USER / ADMIN / SUPERADMIN |
| `department` | STRING  | User department           |
| `salary`     | FLOAT   | User salary               |
| `createdAt`  | DATE    | Record creation timestamp |
| `updatedAt`  | DATE    | Record update timestamp   |

The Sequelize model defines the same user structure and sets `USER` as the default role.

The database migration creates the `Users` table with these fields and constraints.

---

# 🔄 Sequelize ORM

Sequelize is used as the database abstraction layer.

Instead of writing SQL queries directly, the application works with JavaScript models.

For example:

```javascript
User.findByPk(id);
```

and:

```javascript
User.create(data);
```

and:

```javascript
User.update(data, { where: { id } });
```

and:

```javascript
User.destroy({ where: { id } });
```

This keeps database operations organized and easier to maintain.

The project initializes Sequelize in `models/index.js` and loads the `User` model from there.

---

# ⚙️ Environment Variables

The application uses environment variables through `dotenv`.

Create a `.env` file inside the `user-management` directory:

```env
PORT=3000

DB_NAME=your_database_name
DB_USER=your_postgres_username
DB_PASS=your_postgres_password
DB_HOST=localhost

JWT_SECRET=your_strong_jwt_secret
```

The Sequelize configuration reads the PostgreSQL connection details from:

```text
DB_NAME
DB_USER
DB_PASS
DB_HOST
```

and uses the PostgreSQL dialect.

> **Security:** Never commit your real `.env` file, database password, or JWT secret to a public repository.

---

# 📋 Prerequisites

Before running the project, make sure you have:

* Node.js installed
* npm installed
* PostgreSQL installed and running
* Git installed
* A PostgreSQL database created for the project

You can verify Node.js and npm:

```bash
node --version
npm --version
```

Verify PostgreSQL is available:

```bash
psql --version
```

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Deevyanshuvaidya/Node.js_Task.git
```

---

## 2. Navigate to the Project

```bash
cd Node.js_Task/user-management
```

---

## 3. Install Dependencies

```bash
npm install
```

This installs all dependencies defined in `package.json`.

---

# 🗃️ Database Setup

Create a PostgreSQL database.

For example:

```sql
CREATE DATABASE usermgmt;
```

Then configure the `.env` file:

```env
DB_NAME=usermgmt
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
JWT_SECRET=your_secure_secret
PORT=3000
```

---

# 🔄 Run Database Migrations

The project includes a Sequelize migration responsible for creating the `Users` table.

Run:

```bash
npx sequelize-cli db:migrate
```

The migration creates the `Users` table with:

* ID
* Name
* Email
* Password
* Role
* Department
* Salary
* Created timestamp
* Updated timestamp

and defines the role enumeration:

```text
USER
ADMIN
SUPERADMIN
```

---

# 👑 Create the Super Admin

The project includes a Sequelize seeder for creating an initial Super Admin account.

Run:

```bash
npx sequelize-cli db:seed:all
```

The seeder creates a user with the:

```text
SUPERADMIN
```

role.

For security reasons, use your own credentials in a production environment and do not publish default credentials in documentation.

The repository currently contains a Super Admin seeder that hashes the seeded password using bcrypt before inserting the record.

---

# ▶️ Running the Project

Start the server with:

```bash
node server.js
```

The server reads the port from:

```env
PORT=3000
```

and starts the Express application.

The project separates the Express application setup into `app.js` and the HTTP server startup into `server.js`.

Once running, the API will be available at:

```text
http://localhost:3000
```

---

# 🧪 API Usage

You can test the API using tools such as:

* Postman
* Insomnia
* Thunder Client
* cURL

---

## 1. Register a User

### Request

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json
```

### Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

The password is hashed before being stored.

---

# 2. Login

### Request

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json
```

### Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

Copy the returned token for authenticated API requests.

---

# 3. Get Current User

### Request

```http
GET http://localhost:3000/api/users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

This endpoint returns the currently authenticated user's information.

The controller uses the user ID from the verified JWT to retrieve the corresponding database record.

---

# 4. Create a User

This operation is available to:

```text
ADMIN
SUPERADMIN
```

### Request

```http
POST http://localhost:3000/api/users
Authorization: Bearer ADMIN_OR_SUPERADMIN_TOKEN
Content-Type: application/json
```

### Example Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "USER",
  "department": "Engineering",
  "salary": 50000
}
```

---

# 5. Update a User

Only a:

```text
SUPERADMIN
```

can update users.

### Request

```http
PUT http://localhost:3000/api/users/USER_ID
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json
```

### Example Body

```json
{
  "department": "Engineering",
  "salary": 60000
}
```

---

# 6. Delete a User

Only a:

```text
SUPERADMIN
```

can delete users.

### Request

```http
DELETE http://localhost:3000/api/users/USER_ID
Authorization: Bearer SUPERADMIN_TOKEN
```

Successful deletion returns:

```json
{
  "message": "Deleted"
}
```

---

# 🔐 Security

Security was considered at multiple levels of the application.

## Password Hashing

Passwords are hashed using `bcryptjs` before being stored in the database.

```text
Password
   ↓
bcryptjs
   ↓
Password Hash
   ↓
PostgreSQL
```

The application also uses bcrypt to compare login passwords against stored hashes.

---

## JWT Authentication

The application uses JSON Web Tokens for stateless authentication.

The token contains:

```json
{
  "id": "user-id",
  "role": "user-role"
}
```

The JWT is signed using the application's `JWT_SECRET` and has a one-day expiration period.

---

## Authentication Middleware

Protected endpoints use authentication middleware that:

1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the token.
4. Rejects missing or invalid tokens.
5. Adds the authenticated user's information to `req.user`.

---

## Role-Based Authorization

The role middleware verifies whether the authenticated user's role is allowed to access the requested operation.

Unauthorized roles receive:

```http
403 Forbidden
```

---

# 🔁 Request Lifecycle

A protected request follows this flow:

```text
Client
  │
  │ HTTP Request + JWT
  ▼
Express
  │
  ▼
Route
  │
  ▼
Authentication Middleware
  │
  ├── Invalid Token ──► 401 Unauthorized
  │
  ▼
Role Middleware
  │
  ├── Invalid Role ───► 403 Forbidden
  │
  ▼
Controller
  │
  ▼
Sequelize
  │
  ▼
PostgreSQL
  │
  ▼
JSON Response
```

This architecture keeps authentication, authorization, business logic, and database access separated.

---

# 🧩 How the Project Was Built

The project was developed in several logical stages.

## Step 1 — Initialize Node.js

A Node.js project was initialized using npm.

```bash
npm init -y
```

---

## Step 2 — Install Backend Dependencies

The project uses:

```bash
npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv
```

Development dependencies include:

```bash
npm install --save-dev nodemon sequelize-cli
```

The final dependency configuration is available in `package.json`.

---

## Step 3 — Configure PostgreSQL

PostgreSQL was selected as the relational database.

The database connection is configured using environment variables:

```text
DB_NAME
DB_USER
DB_PASS
DB_HOST
```

Sequelize is configured to use the PostgreSQL dialect.

---

## Step 4 — Create the Sequelize Model

A `User` Sequelize model was created containing:

```text
id
name
email
password
role
department
salary
```

The role is restricted to:

```text
USER
ADMIN
SUPERADMIN
```

with `USER` as the default.

---

## Step 5 — Create Database Migration

A Sequelize migration was added to create the `Users` table.

This makes database setup repeatable and allows the database schema to be version-controlled alongside the application code.

---

## Step 6 — Implement Registration

The registration controller accepts:

```text
name
email
password
```

The password is hashed using bcrypt before the user is inserted into PostgreSQL.

---

## Step 7 — Implement Login

The login controller:

1. Finds the user by email.
2. Compares passwords using bcrypt.
3. Rejects invalid credentials.
4. Generates a JWT for valid credentials.

---

## Step 8 — Implement JWT Middleware

A reusable authentication middleware was created to protect private routes.

It verifies:

```http
Authorization: Bearer <token>
```

and attaches the decoded JWT payload to:

```javascript
req.user
```

---

## Step 9 — Implement Role Middleware

A reusable role middleware was created so routes can specify which roles are allowed.

For example:

```javascript
role("ADMIN", "SUPERADMIN")
```

or:

```javascript
role("SUPERADMIN")
```

This provides centralized role-based authorization.

---

## Step 10 — Implement User Management

The user controller implements:

```text
Get current user
Create user
Update user
Delete user
```

---

## Step 11 — Add Seeder

A Sequelize seeder was created to insert an initial Super Admin account into the database.

The seeded password is hashed before insertion.

---

# 🧪 Testing the API

Recommended testing order:

### Step 1

Start PostgreSQL.

### Step 2

Create the database.

### Step 3

Configure `.env`.

### Step 4

Run migrations:

```bash
npx sequelize-cli db:migrate
```

### Step 5

Run seeders:

```bash
npx sequelize-cli db:seed:all
```

### Step 6

Start the server:

```bash
node server.js
```

### Step 7

Test registration:

```text
POST /api/auth/register
```

### Step 8

Test login:

```text
POST /api/auth/login
```

### Step 9

Copy the JWT token.

### Step 10

Use the JWT to test:

```text
GET /api/users/me
```

### Step 11

Test role-based operations using Admin and Super Admin users.

---

# 📦 Available Sequelize Commands

Run migrations:

```bash
npx sequelize-cli db:migrate
```

Undo the latest migration:

```bash
npx sequelize-cli db:migrate:undo
```

Run all seeders:

```bash
npx sequelize-cli db:seed:all
```

Undo all seeders:

```bash
npx sequelize-cli db:seed:undo:all
```

---

# ⚠️ Important Security Recommendation

The current GitHub repository contains a committed `.env` file.

Environment files should **not** be committed to a public GitHub repository because they can contain:

* Database passwords
* JWT secrets
* API keys
* Other private configuration

The current repository's `.env` contains database configuration and a JWT secret.

### Recommended fix

Add this to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

Then create:

```text
.env.example
```

with only placeholder values:

```env
PORT=3000

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=localhost

JWT_SECRET=your_jwt_secret
```

**Also rotate any credentials and secrets that have already been committed to the public repository.**

---

# 🚧 Current Limitations

The current implementation is intentionally focused on the core authentication and user-management functionality.

Some production-level improvements that could be added include:

* Request validation
* Centralized error-handling middleware
* Password reset functionality
* Email verification
* Refresh tokens
* Rate limiting
* CORS configuration
* Helmet security headers
* API documentation with Swagger/OpenAPI
* Automated unit tests
* Integration tests
* Pagination for user management
* Search and filtering
* Audit logging
* Better API response formatting
* Production logging
* Docker support
* CI/CD pipeline

---

# 🚀 Future Improvements

Possible future versions could introduce:

## Authentication Improvements

* Refresh token authentication
* Logout/token invalidation
* Forgot password
* Reset password
* Email verification
* Account lockout
* Login attempt tracking

## User Management Improvements

* User search
* Pagination
* Filtering by role
* Filtering by department
* Sorting
* User activation/deactivation
* Profile update endpoint

## Security Improvements

* Helmet
* CORS configuration
* Rate limiting
* Strong request validation
* Security logging
* Token rotation
* Password complexity rules

## Developer Experience

* Swagger/OpenAPI documentation
* Jest testing
* Supertest API testing
* ESLint
* Prettier
* Docker
* GitHub Actions CI/CD

---

# 📈 Scalability

The current architecture is designed in a way that allows additional features to be introduced without placing all application logic inside a single file.

For example:

```text
routes/
controllers/
middleware/
models/
config/
migrations/
seeders/
```

This separation makes it easier to introduce additional modules such as:

```text
authentication
users
roles
permissions
departments
audit logs
notifications
```

as the application grows.

---

# 🤝 Contributing

Contributions are welcome.

## 1. Fork the repository

```bash
git clone https://github.com/Deevyanshuvaidya/Node.js_Task.git
```

## 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

## 3. Make your changes

Implement and test your changes locally.

## 4. Commit your changes

```bash
git add .
git commit -m "Add your feature"
```

## 5. Push your branch

```bash
git push origin feature/your-feature
```

## 6. Open a Pull Request

Create a Pull Request describing:

* What was changed
* Why it was changed
* How it was tested

---

# 👨‍💻 Author

**Deevyanshu Vaidya**

GitHub:

[Deevyanshuvaidya](https://github.com/Deevyanshuvaidya)

Repository:

[Node.js Task](https://github.com/Deevyanshuvaidya/Node.js_Task)

---

# 📄 License

This project currently uses the **ISC License** as specified in `package.json`.

---

# ⭐ Project Summary

This project demonstrates the implementation of a backend **User Management REST API** using modern Node.js technologies.

### Core Technologies

```text
Node.js
Express.js
PostgreSQL
Sequelize
JWT
bcryptjs
dotenv
Sequelize CLI
```

### Core Concepts Demonstrated

```text
REST API Development
Authentication
JWT Authorization
Password Hashing
Role-Based Access Control
CRUD Operations
ORM
PostgreSQL
Database Migrations
Database Seeders
Middleware
Modular Backend Architecture
Environment Configuration
```

The project provides a strong foundation for building larger backend systems where authentication, authorization, database management, and user administration are required.
