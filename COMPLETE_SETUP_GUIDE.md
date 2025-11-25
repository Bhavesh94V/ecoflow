# EcoSmart - Complete Setup Guide (100% Working)

A comprehensive guide to set up and run the EcoSmart Smart Waste Management System locally with PostgreSQL.

---

## Quick Start Summary

\`\`\`bash
# Backend Setup
cd backend
npm install
cp .env.example .env    # Edit DATABASE_URL
npm run db:generate
npm run db:push
npm run db:seed         # Optional: sample data
npm run dev

# Frontend Setup (new terminal)
npm install
npm run dev
\`\`\`

**Access Points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api
- API Docs: http://localhost:5000/api/docs

---

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@ecosmart.com | EcoSmart@Admin#2025!Secure |
| Citizen (sample) | john.doe@example.com | password123 |

---

## PostgreSQL Setup (Local)

### Step 1: Install PostgreSQL
- **Windows:** https://www.postgresql.org/download/windows/
- **Mac:** `brew install postgresql@14 && brew services start postgresql@14`
- **Linux:** `sudo apt install postgresql postgresql-contrib`

### Step 2: Create Database

\`\`\`bash
psql -U postgres
\`\`\`

\`\`\`sql
CREATE DATABASE ecosmart_db;
CREATE USER ecosmart_user WITH ENCRYPTED PASSWORD 'EcoSmart@2025';
GRANT ALL PRIVILEGES ON DATABASE ecosmart_db TO ecosmart_user;
\c ecosmart_db
GRANT ALL ON SCHEMA public TO ecosmart_user;
\q
\`\`\`

### Step 3: Update backend/.env

\`\`\`env
DATABASE_URL="postgresql://ecosmart_user:EcoSmart@2025@localhost:5432/ecosmart_db"
\`\`\`

---

## Environment Variables

### Backend (.env)

\`\`\`env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://ecosmart_user:EcoSmart@2025@localhost:5432/ecosmart_db"
JWT_SECRET=ecosmart_super_secret_jwt_key_2025_xk9m2n3b4v5c6z7a8s9d0f
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure
CORS_ORIGIN=http://localhost:5173
\`\`\`

### Frontend (.env)

\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
\`\`\`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/citizen/register | Register citizen |
| POST | /api/auth/citizen/login | Citizen login |
| POST | /api/auth/admin/login | Admin login |
| GET | /api/auth/me | Get profile |

### Admin (Requires Admin Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/admin/bins | Manage bins |
| GET/POST | /api/admin/collectors | Manage collectors |
| GET | /api/admin/complaints | View complaints |
| GET/POST | /api/admin/routes | Manage routes |

### Citizen (Requires Citizen Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/citizen/bins | Nearby bins |
| POST | /api/citizen/pickup | Request pickup |
| POST | /api/citizen/complaint | File complaint |
| GET | /api/citizen/rewards | Get rewards |

### IoT
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/iot/update | Submit sensor data |
| GET | /api/iot/history/:bin_id | Get IoT logs |

---

## Thunder Client Testing

### 1. Admin Login
\`\`\`
POST http://localhost:5000/api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@ecosmart.com",
  "password": "EcoSmart@Admin#2025!Secure"
}
\`\`\`

### 2. Citizen Register
\`\`\`
POST http://localhost:5000/api/auth/citizen/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123456",
  "phone": "+1234567890",
  "address": "123 Test Street"
}
\`\`\`

### 3. Get Bins (with token)
\`\`\`
GET http://localhost:5000/api/admin/bins
Authorization: Bearer <your_token>
\`\`\`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection failed | Check PostgreSQL is running and DATABASE_URL is correct |
| CORS error | Verify CORS_ORIGIN matches frontend URL |
| Invalid credentials | Check .env has correct ADMIN_EMAIL/ADMIN_PASSWORD |
| Module not found | Run `npm run db:generate` |
| Tables missing | Run `npm run db:push` |

---

## Prisma Commands

\`\`\`bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Create tables
npm run db:seed      # Add sample data
npm run db:studio    # Open database GUI
