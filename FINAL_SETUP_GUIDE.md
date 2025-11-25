# EcoSmart - Complete Working Setup Guide

This guide will help you set up the entire project from scratch and test it completely.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon, Supabase, or local)
- Thunder Client or Postman for API testing

---

## Part 1: Environment Setup

### Step 1: Configure Backend Environment

1. Open `/backend/.env`
2. Update with your database details:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (PostgreSQL) - Replace with your actual database URL
DATABASE_URL="postgresql://your_user:your_password@your_host:5432/your_database"

# JWT Configuration
JWT_SECRET=ecosmart_super_secret_jwt_key_2025_xk9m2n3b4v5c6z7a8s9d0f
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=info
\`\`\`

### Step 2: Configure Frontend Environment

Open `/.env`:

\`\`\`env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# WebSocket URL (for real-time updates)
VITE_WS_URL=ws://localhost:5000
\`\`\`

---

## Part 2: Database Setup

### Step 1: Install Backend Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### Step 2: Generate Prisma Client

\`\`\`bash
npm run db:generate
\`\`\`

### Step 3: Push Database Schema

\`\`\`bash
npm run db:push
\`\`\`

This creates all tables in your database:
- users (for citizens)
- bins
- collectors
- routes
- pickups
- complaints
- iot_logs
- etc.

### Step 4: Seed Database (Optional)

\`\`\`bash
npm run db:seed
\`\`\`

---

## Part 3: Backend Setup

### Step 1: Start Backend Server

\`\`\`bash
cd backend
npm run dev
\`\`\`

You should see:
\`\`\`
✅ Database connected successfully
🚀 EcoSmart Server running on port 5000
📚 API Documentation: http://localhost:5000/api/docs
🔗 Health Check: http://localhost:5000/api/health
\`\`\`

### Step 2: Verify Backend is Running

Open in browser: `http://localhost:5000/api/health`

You should see:
\`\`\`json
{
  "status": "ok",
  "timestamp": "2025-01-01T10:00:00Z",
  "version": "1.0.0"
}
\`\`\`

---

## Part 4: Frontend Setup

### Step 1: Install Dependencies

\`\`\`bash
cd ..
npm install
\`\`\`

### Step 2: Start Frontend

\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
Local:        http://localhost:5173/
\`\`\`

Open `http://localhost:5173` in your browser.

---

## Part 5: Testing Authentication

### Test 1: Citizen Registration

**URL**: `http://localhost:5173/citizen-register`

1. Fill the registration form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Phone: +1234567890
   - Address: 123 Main St

2. Click "Register"

**Expected**: Success message and redirect to dashboard

---

### Test 2: Citizen Login

**URL**: `http://localhost:5173/citizen-login`

1. Enter credentials:
   - Email: john@example.com
   - Password: password123

2. Click "Sign In"

**Expected**: Success message and redirect to citizen dashboard

---

### Test 3: Admin Login

**URL**: `http://localhost:5173/admin-login`

1. Enter credentials:
   - Email: admin@ecosmart.com
   - Password: EcoSmart@Admin#2025!Secure

2. Click "Sign In"

**Expected**: Success message and redirect to admin dashboard

---

## Part 6: API Testing with Thunder Client

### Import Collection

1. Open Thunder Client extension in VS Code
2. Click "Collections" → "Import"
3. Copy and paste the Thunder Client collection below
4. Save and use

### Thunder Client Collection

\`\`\`json
{
  "info": {
    "name": "EcoSmart API",
    "description": "Complete API collection for testing",
    "version": "1.0.0"
  },
  "items": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "Citizen Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/citizen/register",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "Test User",
          "email": "testuser@example.com",
          "password": "Password123",
          "phone": "+1234567890",
          "address": "Test Address"
        }
      }
    },
    {
      "name": "Citizen Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/citizen/login",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "email": "testuser@example.com",
          "password": "Password123"
        }
      },
      "tests": [
        {
          "type": "assert",
          "expression": "response.body.success === true"
        }
      ]
    },
    {
      "name": "Admin Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/admin/login",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "email": "admin@ecosmart.com",
          "password": "EcoSmart@Admin#2025!Secure"
        }
      }
    },
    {
      "name": "Get My Profile",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/auth/me",
        "headers": {
          "Authorization": "Bearer YOUR_TOKEN_HERE"
        }
      }
    },
    {
      "name": "Get All Bins",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/admin/bins",
        "headers": {
          "Authorization": "Bearer YOUR_TOKEN_HERE"
        }
      }
    }
  ]
}
\`\`\`

### How to Use Thunder Client

1. **Set Token Variable**:
   - After login, copy the token from response
   - Click "Set Variable" in Thunder Client
   - Name: `token`
   - Value: Your JWT token

2. **Update Headers**:
   - Use `{{token}}` in Authorization header: `Bearer {{token}}`

3. **Run Tests**:
   - Each endpoint will show ✓ or ✗
   - Check response body and status code

---

## Part 7: Testing Flow

### Complete Test Workflow

1. **Health Check**
   - Call: GET `/api/health`
   - Expected: 200 OK

2. **Citizen Registration**
   - Call: POST `/api/auth/citizen/register`
   - Send: name, email, password, phone, address
   - Expected: 201, includes token and user

3. **Citizen Login**
   - Call: POST `/api/auth/citizen/login`
   - Send: email, password
   - Expected: 200, includes token and user

4. **Get Profile**
   - Call: GET `/api/auth/me`
   - Header: Authorization: Bearer {token}
   - Expected: 200, user profile

5. **Admin Login**
   - Call: POST `/api/auth/admin/login`
   - Send: admin@ecosmart.com, password
   - Expected: 200, admin token

---

## Troubleshooting

### Error: "Database connection failed"

**Solution**:
1. Check DATABASE_URL in `/backend/.env`
2. Verify PostgreSQL is running
3. Test connection: `psql your_connection_string`

### Error: "Invalid credentials"

**Solution**:
1. Check ADMIN_EMAIL and ADMIN_PASSWORD in `/backend/.env`
2. Use exact credentials: 
   - Email: admin@ecosmart.com
   - Password: EcoSmart@Admin#2025!Secure
3. For citizen, check registration email and password

### Error: "CORS error"

**Solution**:
1. Check CORS_ORIGIN in `/backend/.env`
2. Update to include frontend URL:
   \`\`\`env
   CORS_ORIGIN=http://localhost:5173,http://localhost:3000
   \`\`\`
3. Restart backend

### Error: "Token expired"

**Solution**:
1. Login again to get new token
2. Check JWT_EXPIRES_IN in `/backend/.env`
3. Default is 7d (7 days)

### Error: "Registration failed - email already exists"

**Solution**:
1. Use different email address
2. Or clear data: `npm run db:seed` (⚠️ clears all data)

---

## Common Commands

### Backend

\`\`\`bash
# Start development
npm run dev

# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed database
npm run db:seed

# View database
npm run db:studio
\`\`\`

### Frontend

\`\`\`bash
# Start development
npm run dev

# Build for production
npm build

# Preview build
npm preview
\`\`\`

---

## Project Structure

\`\`\`
ecoflowmain/
├── backend/
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── services/           # Business logic
│   ├── routes/             # API endpoints
│   ├── middlewares/        # Express middlewares
│   ├── validators/         # Input validation
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Seed data
│   ├── .env                # Environment variables
│   └── server.js           # Main server file
│
├── src/
│   ├── pages/              # React pages
│   ├── components/         # React components
│   ├── context/            # Context (Auth)
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   └── utils.ts        # Utilities
│   ├── App.tsx             # Main app
│   └── main.tsx            # Entry point
│
├── .env                    # Frontend env
└── package.json
\`\`\`

---

## API Endpoints

### Authentication
- `POST /api/auth/citizen/register` - Register new citizen
- `POST /api/auth/citizen/login` - Citizen login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user (requires token)

### Admin Routes (protected)
- `GET /api/admin/bins` - Get all bins
- `GET /api/admin/collectors` - Get all collectors
- `GET /api/admin/complaints` - Get all complaints

---

## Support & Debugging

### Enable Debug Logging

Backend: Update `/backend/.env`:
\`\`\`env
LOG_LEVEL=debug
\`\`\`

Frontend: Open Browser DevTools (F12) and check Console

### Verify Setup

1. Backend running: `http://localhost:5000/api/health`
2. Frontend running: `http://localhost:5173`
3. Database connected: Check backend console logs
4. CORS enabled: Check browser Network tab

### Real-time Testing

1. Open 2 terminals
2. Terminal 1: `cd backend && npm run dev`
3. Terminal 2: `npm run dev`
4. Open browser: `http://localhost:5173`
5. Use Thunder Client in VS Code for API testing

---

## Next Steps

1. ✅ Setup complete
2. ✅ Test authentication
3. ✅ Verify API endpoints
4. Build additional features:
   - Bins management
   - Route optimization
   - Complaints system
   - Real-time updates via WebSocket

---

**Last Updated**: January 2025
**Status**: ✅ Working & Tested
