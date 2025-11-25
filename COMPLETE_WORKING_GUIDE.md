# EcoSmart - Complete Working Backend & Frontend Guide

## Quick Summary of Fixes

✅ **Fixed Issues:**
1. Admin login now works - credentials properly validated
2. Missing `/api/bins` endpoint - now routes to citizen controller
3. Dashboard data loading - added `/api/dashboard/citizen-stats` endpoint
4. Missing services - added pickup and complaint services
5. Route mounting fixed - all endpoints properly registered

---

## Part 1: Backend Setup (Complete)

### Step 1: Install Backend Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

**Dependencies installed:**
- express, cors, helmet
- @prisma/client, prisma
- jsonwebtoken, bcryptjs
- swagger-ui-express
- morgan, dotenv
- node-cron for scheduled tasks

### Step 2: Database Configuration

Your `.env` already has the Neon database URL configured:
\`\`\`
DATABASE_URL="postgresql://neondb_owner:npg_T9ekjgCZyV5D@ep-green-poetry-a1tx5me0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
\`\`\`

### Step 3: Initialize Prisma & Run Migrations

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
\`\`\`

### Step 4: Start Backend Server

\`\`\`bash
npm run dev
\`\`\`

**Expected output:**
\`\`\`
[nodemon] starting `node server.js`
🚀 EcoSmart Server running on port 5000
📚 API Documentation: http://localhost:5000/api/docs
✅ Database connected successfully
\`\`\`

---

## Part 2: Frontend Setup

### Step 1: Install Frontend Dependencies

\`\`\`bash
# In the root directory (NOT backend)
npm install
\`\`\`

### Step 2: Verify .env File

Check that `.env` file exists in root:
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
\`\`\`

### Step 3: Start Frontend Dev Server

\`\`\`bash
npm run dev
\`\`\`

**Expected output:**
\`\`\`
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
\`\`\`

---

## Part 3: Real-Time Testing in Browser

### Test 1: Citizen Registration

1. Open browser: `http://localhost:5173/citizen-register`
2. Fill form:
   - Name: `John Doe`
   - Email: `john@test.com`
   - Password: `Test@1234`
   - Phone: `9876543210`
   - Address: `123 Main St, Delhi`
3. Click Register
4. **Expected:** Redirects to citizen-login with success message

### Test 2: Citizen Login

1. Navigate to: `http://localhost:5173/citizen-login`
2. Enter:
   - Email: `john@test.com`
   - Password: `Test@1234`
3. Click Login
4. **Expected:** Redirects to dashboard, shows nearby bins and stats

### Test 3: Citizen Dashboard

Once logged in as citizen:
- **Nearby Bins:** Should show 5 bins with fill levels
- **Pickup Requests:** Shows your pending pickups
- **Complaints:** Shows your filed complaints
- **Stats:** Shows reward points, completed pickups, recycling rate

### Test 4: Admin Login

1. Navigate to: `http://localhost:5173/admin-login`
2. Enter credentials:
   - Email: `admin@ecosmart.com`
   - Password: `EcoSmart@Admin#2025!Secure`
3. Click Login
4. **Expected:** Access admin dashboard with full system stats

### Test 5: Admin Dashboard

Once logged in as admin:
- **Total Stats:** Bins, collectors, complaints count
- **System Health:** Active collectors, pending alerts
- **Charts:** Waste collection data, area-wise distribution
- **Real-time Updates:** Via WebSocket connection

---

## Part 4: API Testing with Thunder Client (VS Code Extension)

### Setup Thunder Client

1. **Install Extension:**
   - Open VS Code
   - Extensions → Search "Thunder Client"
   - Install by Rangav

2. **Import Collection:**
   - Click "Collections" in left sidebar
   - Right-click → "New Collection" → Name: "EcoSmart API"

### Test Cases

#### **Test 1: Health Check**
- **Method:** GET
- **URL:** `http://localhost:5000/api/health`
- **Expected Response:** `{ "status": "ok", ... }`

#### **Test 2: Citizen Register**
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/citizen/register`
- **Body (JSON):**
\`\`\`json
{
  "name": "Alice Smith",
  "email": "alice@test.com",
  "password": "Test@1234",
  "phone": "9876543210",
  "address": "456 Park Ave, Delhi"
}
\`\`\`
- **Expected:** 201 Created with token

#### **Test 3: Citizen Login**
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/citizen/login`
- **Body:**
\`\`\`json
{
  "email": "alice@test.com",
  "password": "Test@1234"
}
\`\`\`
- **Expected:** 200 OK with token and user data

#### **Test 4: Get Nearby Bins**
- **Method:** GET
- **URL:** `http://localhost:5000/api/bins?limit=5`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - Replace YOUR_TOKEN_HERE with actual token from login
- **Expected:** 200 OK with array of bins

#### **Test 5: Dashboard Stats**
- **Method:** GET
- **URL:** `http://localhost:5000/api/dashboard/citizen-stats`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Expected:** 200 OK with stats object

#### **Test 6: Admin Login**
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/admin/login`
- **Body:**
\`\`\`json
{
  "email": "admin@ecosmart.com",
  "password": "EcoSmart@Admin#2025!Secure"
}
\`\`\`
- **Expected:** 200 OK with admin token

#### **Test 7: Create Complaint**
- **Method:** POST
- **URL:** `http://localhost:5000/api/citizen/complaints`
- **Headers:**
  - `Authorization: Bearer YOUR_CITIZEN_TOKEN`
- **Body:**
\`\`\`json
{
  "title": "Overflowing Bin",
  "description": "Bin at main street is full",
  "location": "Main Street, Near Market",
  "area": "Central",
  "priority": "high"
}
\`\`\`
- **Expected:** 201 Created with complaint ID

#### **Test 8: Get Complaints**
- **Method:** GET
- **URL:** `http://localhost:5000/api/citizen/complaints/my`
- **Headers:**
  - `Authorization: Bearer YOUR_CITIZEN_TOKEN`
- **Expected:** 200 OK with array of complaints

---

## Part 5: Debugging & Troubleshooting

### Issue 1: "Cannot connect to database"

**Solution:**
1. Check DATABASE_URL in `backend/.env`
2. Verify Neon database is running
3. Test connection:
\`\`\`bash
cd backend
npx prisma db execute --stdin < /dev/null
\`\`\`

### Issue 2: "Route not found" errors

**Solution:**
1. Check that all route files exist:
   - `backend/routes/auth.routes.js` ✓
   - `backend/routes/citizen.routes.js` ✓
   - `backend/routes/dashboard.routes.js` ✓

2. Verify routes are mounted in `server.js`:
\`\`\`javascript
app.use("/api/auth", authRoutes)
app.use("/api/citizen", citizenRoutes)
app.use("/api/bins", citizenRoutes)
app.use("/api/dashboard", dashboardRoutes)
\`\`\`

### Issue 3: "Invalid admin credentials"

**Solution:**
Admin credentials are hardcoded (for development):
- Email: `admin@ecosmart.com`
- Password: `EcoSmart@Admin#2025!Secure`

Verify in `backend/.env`:
\`\`\`
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure
\`\`\`

### Issue 4: CORS errors in browser console

**Solution:**
1. Check frontend `.env`:
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

2. Check backend `backend/.env`:
\`\`\`
CORS_ORIGIN=http://localhost:8080
\`\`\`

3. Add frontend port if needed:
\`\`\`
CORS_ORIGIN=http://localhost:5173,http://localhost:8080
\`\`\`

### Issue 5: Token errors in Thunder Client

**Solution:**
1. Get token from login response
2. Copy full token string
3. Add to Headers:
\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

---

## Part 6: Full Testing Workflow

### Complete End-to-End Test (30 minutes)

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm install
npx prisma db push
npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
npm install
npm run dev
\`\`\`

**Browser Testing:**
1. Open `http://localhost:5173/citizen-register`
2. Register new account
3. Login to dashboard
4. View nearby bins
5. File a complaint
6. Check admin login works

**Thunder Client Testing:**
1. Test health endpoint
2. Register user
3. Login and get token
4. Fetch bins with token
5. Get dashboard stats
6. Create complaint
7. Get admin stats

---

## Part 7: Environment Variables Reference

### Backend `.env` (backend/.env)
\`\`\`
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=ecosmart_super_secret_jwt_key_2025_xk9m2n3b4v5c6z7a8s9d0f
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
\`\`\`

### Frontend `.env` (.env in root)
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
\`\`\`

---

## Part 8: API Endpoints Summary

### Authentication
\`\`\`
POST   /api/auth/citizen/register
POST   /api/auth/citizen/login
POST   /api/auth/admin/login
GET    /api/auth/me
\`\`\`

### Citizen
\`\`\`
GET    /api/citizen/bins           (or /api/bins)
POST   /api/citizen/complaints
GET    /api/citizen/complaints/my
\`\`\`

### Dashboard
\`\`\`
GET    /api/dashboard/citizen-stats
GET    /api/dashboard/admin-stats
\`\`\`

### Admin
\`\`\`
GET    /api/admin/bins
POST   /api/admin/bins
GET    /api/admin/collectors
GET    /api/admin/complaints
\`\`\`

---

## Part 9: Common Commands

### Backend Development
\`\`\`bash
cd backend
npm run dev          # Start with nodemon
npm run build        # Build for production
npx prisma studio   # Open Prisma dashboard
npx prisma db push  # Push schema to DB
npx prisma generate # Generate Prisma client
\`\`\`

### Frontend Development
\`\`\`bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
\`\`\`

---

## Part 10: Next Steps

1. **Add more citizen features:**
   - Pickup requests scheduling
   - Reward redemption
   - Notification system

2. **Add collector dashboard:**
   - Route management
   - Collection tracking
   - Performance metrics

3. **Deploy to production:**
   - Move to HTTPS
   - Set up proper error handling
   - Implement caching
   - Set up monitoring

---

## Support

### Still Having Issues?

1. Check logs in both terminal windows
2. Verify all `.env` files are correct
3. Ensure database is accessible
4. Clear browser cache and localStorage
5. Try in incognito/private window

### Quick Validation

Run these commands to validate setup:

\`\`\`bash
# Check backend is running
curl http://localhost:5000/api/health

# Check frontend can reach backend
curl http://localhost:5173

# Check database connection
cd backend && npx prisma db execute --stdin < /dev/null
\`\`\`

That's it! Your full-stack EcoSmart application is now ready to use!
