# Step-by-Step Debugging Guide - EcoSmart Backend

Since you're getting errors, follow this guide step-by-step to identify and fix issues.

## Step 1: Verify Backend Environment Setup

### Check .env File

Navigate to `backend/.env` and verify EXACTLY these values:

\`\`\`
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://neondb_owner:npg_T9ekjgCZyV5D@ep-green-poetry-a1tx5me0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET=ecosmart_super_secret_jwt_key_2025_xk9m2n3b4v5c6z7a8s9d0f
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
\`\`\`

### If Any Variable is Missing or Wrong:

1. Open `backend/.env` in your editor
2. Copy the values above
3. Replace the file content completely
4. Save the file
5. Restart backend server

---

## Step 2: Clear and Reinstall Backend

\`\`\`bash
cd backend

# Remove old installations
rm -rf node_modules package-lock.json

# Clean Prisma cache
rm -rf node_modules/.prisma

# Reinstall everything fresh
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
\`\`\`

If `npx prisma db push` fails:
1. Make sure database URL is correct
2. Check if Neon database is running
3. Try: `npx prisma db execute --stdin < /dev/null`

---

## Step 3: Verify Environment Variables Load Correctly

### Create a Debug File

Create `backend/test-env.js`:

\`\`\`javascript
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('=== Environment Variables ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Loaded' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Loaded' : '✗ Missing');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('=============================');
\`\`\`

### Run Debug File

\`\`\`bash
cd backend
node test-env.js
\`\`\`

**Expected Output:**
\`\`\`
=== Environment Variables ===
PORT: 5000
NODE_ENV: development
DATABASE_URL: ✓ Loaded
JWT_SECRET: ✓ Loaded
ADMIN_EMAIL: admin@ecosmart.com
ADMIN_PASSWORD: EcoSmart@Admin#2025!Secure
CORS_ORIGIN: http://localhost:5173
=============================
\`\`\`

If any variable shows as "✗ Missing", check:
1. The variable name spelling in .env
2. No extra spaces or quotes
3. File is saved

---

## Step 4: Test Database Connection

### Create Database Test File

Create `backend/test-db.js`:

\`\`\`javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    const result = await prisma.$executeRaw`SELECT 1`;
    console.log('✓ Database connection successful!');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`✓ Found ${userCount} users in database`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('✗ Database connection failed:');
    console.error(error.message);
    process.exit(1);
  }
}

test();
\`\`\`

### Run Database Test

\`\`\`bash
cd backend
node test-db.js
\`\`\`

**Expected Output:**
\`\`\`
Testing database connection...
✓ Database connection successful!
✓ Found 2 users in database
\`\`\`

---

## Step 5: Test Backend Server Startup

\`\`\`bash
cd backend
npm run dev
\`\`\`

**Watch for these in terminal:**

✓ Good output:
\`\`\`
[nodemon] starting `node server.js`
🚀 EcoSmart Server running on port 5000
📚 API Documentation: http://localhost:5000/api/docs
🔗 Health Check: http://localhost:5000/api/health
✅ Database connected successfully
\`\`\`

✗ Bad output:
\`\`\`
Error: Cannot find module 'express'
Error: DATABASE_URL is not defined
TypeError: Cannot read property 'PORT' of undefined
\`\`\`

If you see errors, go back to Step 2.

---

## Step 6: Test Health Endpoint

### Using curl (Terminal)

\`\`\`bash
curl http://localhost:5000/api/health
\`\`\`

**Expected Response:**
\`\`\`json
{
  "status": "ok",
  "timestamp": "2025-11-25T...",
  "version": "1.0.0"
}
\`\`\`

### Using Thunder Client (VS Code)

1. Open Thunder Client extension
2. Click "+" to create new request
3. Method: GET
4. URL: `http://localhost:5000/api/health`
5. Click "Send"

---

## Step 7: Test Citizen Registration

### Using Thunder Client

1. Create new request
2. Method: POST
3. URL: `http://localhost:5000/api/auth/citizen/register`
4. Go to "Body" tab
5. Select "JSON"
6. Paste:

\`\`\`json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "Test@12345",
  "phone": "9876543210",
  "address": "123 Test St"
}
\`\`\`

7. Click "Send"

**Expected Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Test User",
      "email": "testuser@example.com",
      "role": "citizen"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

---

## Step 8: Test Citizen Login

### Using Thunder Client

1. Create new request
2. Method: POST
3. URL: `http://localhost:5000/api/auth/citizen/login`
4. Body (JSON):

\`\`\`json
{
  "email": "testuser@example.com",
  "password": "Test@12345"
}
\`\`\`

5. Click "Send"

**Expected Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "testuser@example.com",
      "role": "citizen"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Save this token** - you'll need it for next steps!

---

## Step 9: Test Admin Login (The Problem Case)

### Using Thunder Client

1. Create new request
2. Method: POST
3. URL: `http://localhost:5000/api/auth/admin/login`
4. Body (JSON):

\`\`\`json
{
  "email": "admin@ecosmart.com",
  "password": "EcoSmart@Admin#2025!Secure"
}
\`\`\`

5. Click "Send"

**Expected Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 0,
      "name": "System Admin",
      "email": "admin@ecosmart.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

### If You Get "Invalid admin credentials":

Check these steps:

1. **Verify ADMIN_PASSWORD in backend/.env:**
   \`\`\`
   ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure
   \`\`\`
   Make sure it's EXACTLY this with no extra spaces

2. **Restart backend server:**
   - Press Ctrl+C in terminal
   - Run `npm run dev` again
   - Wait for "Database connected successfully"

3. **Check server logs for debug messages:**
   Look for:
   \`\`\`
   [v0] Admin login attempt - Email: admin@ecosmart.com
   \`\`\`
   
   If you see:
   \`\`\`
   [v0] Admin login failed - Password mismatch
   \`\`\`
   
   The issue is the ADMIN_PASSWORD env variable

4. **Fix: Update backend/.env**
   - Open `backend/.env`
   - Find the line: `ADMIN_PASSWORD=...`
   - Replace with: `ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure`
   - Save file
   - Restart server

---

## Step 10: Test Nearby Bins Endpoint

### Using Thunder Client (Requires Token)

1. Create new request
2. Method: GET
3. URL: `http://localhost:5000/api/bins?limit=5`
4. Go to "Headers" tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer PASTE_YOUR_CITIZEN_TOKEN_HERE`
   (Replace with token from Step 8)
6. Click "Send"

**Expected Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Nearby bins retrieved",
  "data": [
    {
      "id": "...",
      "bin_id": "BIN001",
      "location": "Main Street",
      "currentFillLevel": 75
    }
  ]
}
\`\`\`

---

## Step 11: Test Dashboard Endpoint

### Using Thunder Client (Requires Token)

1. Create new request
2. Method: GET
3. URL: `http://localhost:5000/api/dashboard/citizen-stats`
4. Headers:
   - `Authorization: Bearer PASTE_CITIZEN_TOKEN`
5. Click "Send"

**Expected Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Citizen statistics retrieved",
  "data": {
    "rewardPoints": 0,
    "pickupsCompleted": 0,
    "recyclingRate": 0,
    "activeComplaints": 0
  }
}
\`\`\`

---

## Troubleshooting Checklist

### Backend Won't Start
- [ ] Check `backend/.env` exists
- [ ] All env variables are set
- [ ] Run `npm install` again
- [ ] Check port 5000 is not in use
- [ ] Check database URL is correct

### Admin Login Fails
- [ ] Verify `ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure` in .env
- [ ] Restart backend server
- [ ] Check server logs for password mismatch error
- [ ] Try exact password from .env file

### Dashboard Data Fails
- [ ] Check token is valid (from login response)
- [ ] Token is pasted in Authorization header
- [ ] Database has some test data
- [ ] Check server logs for any errors

### CORS Errors in Browser
- [ ] Check `CORS_ORIGIN=http://localhost:5173` in backend/.env
- [ ] If frontend on different port, add to CORS_ORIGIN
- [ ] Restart backend after changing CORS_ORIGIN

---

## Quick Summary

**To get everything working:**

1. ✓ Set correct .env in backend
2. ✓ Run `npm install` and `npx prisma db push`
3. ✓ Start backend with `npm run dev`
4. ✓ Test health endpoint
5. ✓ Register citizen
6. ✓ Login citizen
7. ✓ Test admin login
8. ✓ Get token from login
9. ✓ Test bins endpoint with token
10. ✓ Test dashboard endpoint

If any step fails, go back one step and debug.




































# Quick Fix Checklist - Do This Now!

## Step 1: Create Database Tables (MOST IMPORTANT)

\`\`\`bash
cd backend
npm run db:push
\`\`\`

Wait for: `✓ Create X new tables in your database`

## Step 2: Restart Backend

\`\`\`bash
npm run dev
\`\`\`

## Step 3: Test in Browser

- Admin Login: `http://localhost:8080/admin-login`

  - Email: `admin@ecosmart.com`
  - Password: `EcoSmart@Admin#2025!Secure`
  - Click "Sign In"
  - Should redirect to `/admin-dashboard`
  - Should NOT show "Failed to load dashboard data"

- Citizen Login: `http://localhost:8080/citizen-login`
  - Use credentials from registration
  - Should NOT show "Failed to load dashboard data"

## Step 4: Test in Thunder Client

**Admin Stats:**

- POST: `http://localhost:5000/api/auth/admin/login`
- Copy token from response
- GET: `http://localhost:5000/api/dashboard/admin-stats`
- Add header: `Authorization: Bearer {token}`
- Should return stats successfully

**Alerts:**

- GET: `http://localhost:5000/api/admin/alerts?limit=5`
- Same token and header
- Should return empty array (normal, DB is empty)

## If Issues Remain

1. Check backend logs - look for database errors
2. Check Neon Console - verify tables were created
3. Restart frontend: Stop (Ctrl+C) and `npm run dev`
4. Clear browser cache: Ctrl+Shift+Delete

## What Was Fixed

✅ Database table creation
✅ API endpoint paths corrected
✅ Admin alerts route added
✅ Dashboard stats endpoint fixed
✅ Authorization middleware checked

Done! Your app should now work 100% 🚀





















# Fix Data Fetch Issues - Step by Step

## ⚠️ CRITICAL STEP: Create Database Tables

The main issue is that Prisma migrations haven't been run. Your database has 0 tables!

### Step 1: Run Database Migration

\`\`\`bash
cd backend
npm run db:push
\`\`\`

**This will:**

- Create all tables (users, bins, collectors, complaints, pickups, routes, alerts, etc.)
- Set up relationships between tables
- Configure constraints

**Expected output:**
\`\`\`
✓ Create 9 new tables in your database
\`\`\`

### Step 2: Verify Database Created Tables

Check Neon Console:

- Go to https://console.neon.tech/
- Select your database
- Go to Tables section
- You should now see: Bin, Collector, Complaint, IoTLog, Pickup, Route, RouteBin, User, Alert

## Frontend API Endpoint Fixes

The frontend was calling wrong API endpoints. Fixed:

| What            | Before             | After                      |
| --------------- | ------------------ | -------------------------- |
| Dashboard Stats | `/dashboard/stats` | `/dashboard/admin-stats`   |
| Citizen Stats   | Same as before     | `/dashboard/citizen-stats` |
| Admin Alerts    | `/alerts`          | `/admin/alerts`            |

## What Was Changed

### Backend

1. **Added** `backend/controllers/alerts.controller.js` - Alert management
2. **Added** `backend/routes/alerts.routes.js` - Alert endpoints
3. **Updated** `backend/server.js` - Mounted alerts routes

### Frontend

1. **Updated** `src/lib/api.ts` - Fixed all API endpoint paths

## How to Test Now

### Test 1: Verify Database

\`\`\`bash
cd backend
npm run db:push # If not done yet
npm run dev
\`\`\`

Watch for: `✅ Database connected successfully`

### Test 2: Test Admin Dashboard

1. Login as admin: `admin@ecosmart.com` / `EcoSmart@Admin#2025!Secure`
2. Go to `/admin-dashboard`
3. Should load dashboard stats with 0 bins/collectors (database is empty, that's normal)
4. No "Failed to load dashboard data" error

### Test 3: Test Citizen Dashboard

1. Register a new citizen or login existing
2. Go to `/citizen-dashboard`
3. Should show your stats
4. No errors

### Test 4: API Test in Thunder Client

**Get Admin Stats:**

- Method: GET
- URL: `http://localhost:5000/api/dashboard/admin-stats`
- Headers: `Authorization: Bearer {token}`
- Response: Should return stats (zeros are fine, database is empty)

**Get Alerts:**

- Method: GET
- URL: `http://localhost:5000/api/admin/alerts?limit=5`
- Headers: `Authorization: Bearer {token}`
- Response: Should return empty array (no alerts yet)

## Complete Workflow

1. Stop backend (Ctrl+C)
2. Run: `npm run db:push`
3. Restart backend: `npm run dev`
4. Open frontend: `http://localhost:8080`
5. Test login and dashboard access

## If Still Getting Errors

Check backend logs for:

- `✅ Database connected successfully` - If missing, database connection failed
- `Route /api/dashboard/admin-stats not found` - If appears, restart backend
- `Error: Citizen access required` - If appears on admin endpoints, check token has admin role

## Database Seeding (Optional)

To add sample data for testing, create `backend/scripts/seed.js`:

\`\`\`javascript
const prisma = require("../config/database");

async function main() {
// Create a test bin
await prisma.bin.create({
data: {
bin_id: "BIN-001",
location_name: "Market Street",
area: "Central",
latitude: 28.6139,
longitude: 77.2090,
status: "normal",
},
});

console.log("✅ Database seeded successfully");
}

main()
.catch((e) => {
console.error(e);
process.exit(1);
});
\`\`\`

Then run: `node backend/scripts/seed.js`
