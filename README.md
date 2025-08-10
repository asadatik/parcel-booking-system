# Parcel Management System API

A robust, scalable RESTful API for managing parcels with features like parcel creation, status tracking, cancellation, and user role-based access control.

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
│ ├── auth/ # Authentication module (login, signup)
│ ├── user/ # User management (roles, profile)
│ ├── parcel/ # Parcel features (controllers, models, services, validations)
│ ├── otp/ # OTP verification (if applicable)
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

npm install

### env file
Create .env file and add necessary environment variables (see .env.example)

📡 API Endpoints Overview
Method	Endpoint	Access Role	Description
POST	/api/parcels	Sender	Create a new parcel
GET	/api/parcels/all	Admin	Get all parcels
GET	/api/parcels/:id	Admin, Sender, Receiver	Get parcel by ID
GET	/api/parcels/my	Sender	Get parcels created by sender
GET	/api/parcels/incoming	Receiver	Get parcels destined for receiver
PATCH	/api/parcels/:id/status	Admin	Update parcel status
PATCH	/api/parcels/:id/cancel	Sender	Cancel a parcel

