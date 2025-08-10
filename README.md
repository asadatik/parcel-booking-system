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


