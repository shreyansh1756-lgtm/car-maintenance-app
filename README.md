# Car Maintenance App

A full-stack web application for tracking vehicles and their maintenance history — add vehicles, log service records, and view maintenance history per vehicle.

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (cloud-hosted)
- **Logging:** Morgan (HTTP request logging)
- **Containerization:** Docker

## Features

- Add and view vehicles (brand, model, year, mileage)
- Log maintenance records per vehicle (service type, date, cost)
- Request logging via Morgan middleware
- `/health` endpoint for uptime/monitoring checks
- Dockerized backend for consistent, portable deployment

## Getting Started

### Prerequisites
- Node.js and npm installed
- A MongoDB Atlas cluster (or any MongoDB connection string)

### Backend Setup
cd backend
npm install
**
Create a `.env` file inside `backend/` with:**
MONGO_URI=your-mongodb-connection-string
PORT=5000

Run the backend:
npm start

### Frontend Setup
npm install
npm start
Opens on [http://localhost:3000](http://localhost:3000)

### Running with Docker
cd backend
docker build -t car-maintenance-backend .
docker run -p 5000:5000 --env-file .env car-maintenance-backend

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/health` | Health check / uptime status |
| GET | `/vehicles` | List all vehicles |
| POST | `/addVehicle` | Add a new vehicle |
| GET | `/maintenance/:vehicleId` | Get maintenance records for a vehicle |
| POST | `/addMaintenance` | Add a maintenance record |
