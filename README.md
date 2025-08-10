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



