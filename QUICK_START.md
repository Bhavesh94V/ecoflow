# Quick Start - 5 Minutes Setup

## Fastest Way to Get Running

### Terminal 1: Backend Setup

\`\`\`bash
cd backend
npm install
npm run db:push
npm run dev
\`\`\`

Wait for: `🚀 EcoSmart Server running on port 5000`

### Terminal 2: Frontend Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

Open: `http://localhost:5173`

---

## Test It Now

### In Browser

1. **Register**: Go to `/citizen-register`
   - Email: test@example.com
   - Password: password123
   - Name: Test User

2. **Login**: Go to `/citizen-login`
   - Email: test@example.com
   - Password: password123

3. **Admin Login**: Go to `/admin-login`
   - Email: admin@ecosmart.com
   - Password: EcoSmart@Admin#2025!Secure

### In Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request:
   \`\`\`
   POST http://localhost:5000/api/auth/citizen/login
   
   {
     "email": "test@example.com",
     "password": "password123"
   }
   \`\`\`
3. Send and see response

---

## Environment Variables

### Backend (backend/.env)

\`\`\`env
DATABASE_URL="your_postgres_url"
PORT=5000
ADMIN_EMAIL=admin@ecosmart.com
ADMIN_PASSWORD=EcoSmart@Admin#2025!Secure
CORS_ORIGIN=http://localhost:5173
\`\`\`

### Frontend (.env)

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

---

## Credentials

**Admin**:
- Email: `admin@ecosmart.com`
- Password: `EcoSmart@Admin#2025!Secure`

**Test Citizen**:
- Email: `test@example.com`
- Password: `password123`

---

## Verify Working

✅ Backend: `http://localhost:5000/api/health` → Status OK
✅ Frontend: `http://localhost:5173` → App loads
✅ Login works with admin credentials
✅ Register works for new citizen

---

## API Docs

Swagger UI: `http://localhost:5000/api/docs`

---

**Done! Now test the app!**
