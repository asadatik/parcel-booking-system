# Parcel Management System API

A robust, scalable RESTful API for managing parcels with features like parcel creation, status tracking, cancellation, and user role-based access control.

---

## 🌐 Live Demo
[Live Site Link](888)

---
## 🚀 Project Overview  
This project implements a Parcel Management API to allow users (senders and receivers) and admins to create, track, update, cancel, and manage parcel deliveries. It includes:

- Parcel status lifecycle management  
- Role-based access control  
- JWT-based authentication  
- Validation using Zod schemas  
- Detailed parcel status logs with timestamps
---

## ✨ Features

- **User Roles:** Admin, Sender, Receiver  
- **Parcel Tracking:** Unique tracking IDs, multiple status updates  
- **Parcel Lifecycle:** Requested → Approved → Dispatched → In Transit → Delivered → Cancelled/Returned  
- **Parcel Cancellation:** Only senders can cancel parcels before dispatch  
- **Authentication:** Secure JWT tokens with role validation  
- **Validation:** Input validated with Zod schemas  
- **Error Handling:** Centralized error handling with clear messages  
- **API Response:** Consistent response structure for all endpoints  

---

## 🛠️ Tech Stack

- Node.js with Express.js  
- MongoDB with Mongoose  
- TypeScript  
- JWT for Authentication  
- Zod for Validation  
- http-status-codes  
- dotenv for environment variables  

---

## 📂 Folder Structure

src/
├── modules/
│ ├── auth/ # Authentication module 
│ ├── user/ # User management (roles, profile)
│ ├── parcel/ # Parcel features (controllers, models, services, validations , routes)
├── middlewares/ # Auth, error handling, validation middlewares
├── config/ # Environment configs and constants
├── utils/ # Utility functions (JWT, error helper, response sender)
├── app.ts # Express app setup
├── server.ts # Server bootstrap file

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)  
- MongoDB instance (local or cloud)  
- Git  

### Installation

1. Clone the repo  
```bash
git clone https://github.com/asadatik/parcel-booking-system
cd parcel-booking-system

```
2. Install dependencies

```bash
npm install
```
3.   Create .env file and add necessary environment variables (see .env.example)

---
##  📡 API Endpoints Overview

### Auth Routes

| Method | Endpoint                  | Description                 | Access        | Validation                     |
|--------|---------------------------|-----------------------------|---------------|-------------------------------|
| POST   | `/api/v1/auth/login`       | User login                  | Public        | None                          |
| POST   | `/api/v1/auth/refresh-token` | Get new access token       | Public        | None                          |
| POST   | `/api/v1/auth/logout`      | User logout                 | Authenticated | None                          |
| POST   | `/api/v1/auth/change-password` | Change user password     | Authenticated | `checkAuth(all roles)`         |

### user routes

 ### User Routes

| Method | Endpoint                  | Description                  | Access        | Validation                  |
|--------|---------------------------|------------------------------|---------------|-----------------------------|
| POST   | `/api/v1/user/register`   | Register a new user           | Public        | `createUserZodSchema`       |
| GET    | `/api/v1/user/all-user`   | Get all users                 | Admin only    | `checkAuth(Role.ADMIN)`     |
| GET    | `/api/v1/user/me`         | Get current logged-in user    | Authenticated | `checkAuth(all roles)`      |
| GET    | `/api/v1/user/:id`        | Get a single user by ID       | Admin only    | `checkAuth(Role.ADMIN)`     |
| PATCH  | `/api/v1/user/:id`        | Update user by ID             | Authenticated | `updateUserZodSchema` & `checkAuth(all roles)` |

### parcel routes

| Method | Endpoint                  | Access Role             | Description                       |
| ------ | ------------------------- | ----------------------- | --------------------------------- |
| POST   | `/api/v1/parcel`            | Sender                  | Create a new parcel               |
| GET    | `/api/v1/parcel/all`        | Admin                   | Get all parcels                   |
| GET    | `/api/v1/parcel/:id`        | Admin, Sender, Receiver | Get parcel by ID                  |
| GET    | `/api/v1/parcel/my`         | Sender                  | Get parcels created by sender     |
| GET    | `/api/v1/parcel/incoming`   | Receiver                | Get parcels destined for receiver |
| PATCH  | `/api/v1/parcel/:id/status` | Admin                   | Update parcel status              |
| PATCH  | `/api/v1/parcel/:id/cancel` | Sender                  | Cancel a parcel                   |
---

--- 
### 🔐 Validation & Authorization

- **Authentication:**  
  User authentication is implemented using JWT tokens. All protected routes require a valid token sent in the `Authorization` header.

- **Role-based Access Control (RBAC):**  
  Access to routes is controlled based on user roles:  
  - `ADMIN` — Full access including user management and parcel status updates  
  - `SENDER` — Can create parcels, view their own parcel, and cancel parcels they sent  
  - `RECEIVER` — Can view parcels addressed to them
- **Validation:**  
  Request data is validated using `zod` schemas before processing. This ensures:  
  - Required fields are present and correctly formatted  
  - Phone numbers match Bangladeshi format  
  - Parcel status updates follow allowed transitions (e.g., you cannot skip statuses)  
  - Only authorized roles can perform specific actions (e.g., only senders can cancel their parcels)

- **Token Verification:**  
  Tokens are verified on every protected route using a middleware that checks token validity, user existence, and user account status (active, blocked, deleted).

- **Security:**  
  - Users who are `BLOCKED` or `INACTIVE` cannot access protected endpoints.  
  - Deleted users are prevented from any access.  
  - Unauthorized access attempts return proper HTTP status codes with clear error messages.

---
---

🏃 How to Run Locally :
```bash
npm run dev
```
Runs the server with hot-reloading using ts-node-dev.
Server listens on the port specified in .env (default: 5000).

---

Thank you for checking out this project!
