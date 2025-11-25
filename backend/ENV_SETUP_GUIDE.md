# EcoSmart Backend - Environment Variables Setup Guide

## Quick Start

1. Copy `.env.example` to `.env`
2. Fill in the required values following this guide
3. Run `npm install`
4. Run `npm run db:push` to create database tables
5. Run `npm run db:seed` to add sample data
6. Run `npm run dev` to start the server

---

## Required Environment Variables

### 1. DATABASE_URL (Required)

**What it is:** PostgreSQL connection string for your database.

**Where to get it:**

#### Option A: Neon (Recommended - Free Tier)
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up / Login with GitHub
3. Click "Create Project"
4. Enter project name: "ecosmart"
5. Select region closest to you
6. Click "Create Project"
7. Copy the connection string from the dashboard
8. It looks like: `postgresql://username:password@ep-xxxx.region.aws.neon.tech/ecosmart?sslmode=require`

#### Option B: Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

#### Option C: Railway
1. Go to [https://railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Go to Variables tab
4. Copy `DATABASE_URL`

#### Option D: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create database: `createdb ecosmart`
3. Use: `postgresql://postgres:yourpassword@localhost:5432/ecosmart`

---

### 2. JWT_SECRET (Required for Production)

**What it is:** Secret key for signing JWT tokens.

**How to generate:**
\`\`\`bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64
\`\`\`

**Example output:**
\`\`\`
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8
\`\`\`

**Default (Development only):**
\`\`\`
ecosmart_super_secret_jwt_key_2025_xk9m2n3b4v5c6z7a8s9d0f
\`\`\`

---

### 3. Admin Credentials (Pre-configured)

**What they are:** Fixed admin login credentials stored in environment.

**Default values (already set):**
\`\`\`env
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure
\`\`\`

**To change:**
Simply update these values in your `.env` file. The admin authentication uses these environment variables directly - no database entry needed.

---

### 4. PORT (Optional)

**What it is:** Server port number.

**Default:** `5000`

**When to change:** If port 5000 is already in use.

---

### 5. CORS_ORIGIN (Optional)

**What it is:** Frontend URL for CORS.

**Default:** `http://localhost:5173` (Vite default)

**When to change:** In production, set to your frontend domain:
\`\`\`env
CORS_ORIGIN=https://your-frontend-domain.com
\`\`\`

---

## Complete .env Example

\`\`\`env
# Server
PORT=5000
NODE_ENV=development

# Database (Get from Neon/Supabase/Railway)
DATABASE_URL="postgresql://username:password@host:5432/ecosmart?sslmode=require"

# JWT (Generate using commands above)
JWT_SECRET=your_generated_secret_key_here
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
\`\`\`

---

## Setup Commands

After configuring `.env`:

\`\`\`bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed

# Start development server
npm run dev

# View database (optional)
npm run db:studio
\`\`\`

---

## API Documentation

After starting the server, visit:
- Swagger UI: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Testing Login

### Admin Login:
\`\`\`json
POST /api/auth/login
{
  "email": "admin@ecosmart.com",
  "password": "EcoSmart@Admin#2025!Secure"
}
\`\`\`

### Citizen Login (after seeding):
\`\`\`json
POST /api/auth/login
{
  "email": "john.doe@example.com",
  "password": "password123"
}
\`\`\`

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Ensure database exists
- Check if firewall allows connection

### "Invalid token"
- Ensure JWT_SECRET matches between requests
- Check token hasn't expired

### "CORS error"
- Update CORS_ORIGIN to match your frontend URL

### "Port already in use"
- Change PORT to different value (e.g., 5001)
