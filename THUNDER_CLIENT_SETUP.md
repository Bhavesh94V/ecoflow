# Thunder Client - Complete Testing Guide for EcoSmart

Thunder Client is a lightweight API testing tool built into VS Code. This guide shows you how to test the entire EcoSmart API.

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "Thunder Client"
4. Click Install (by Ranga Vadhineni)
5. Reload VS Code

---

## Complete Test Workflow

### Step 1: Health Check (No Auth Required)

**Request**:
\`\`\`
GET http://localhost:5000/api/health
\`\`\`

**Expected Response** (200):
\`\`\`json
{
  "status": "ok",
  "timestamp": "2025-01-01T10:00:00Z",
  "version": "1.0.0"
}
\`\`\`

---

### Step 2: Citizen Registration

**Request**:
\`\`\`
POST http://localhost:5000/api/auth/citizen/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+1234567890",
  "address": "123 Main Street, City"
}
\`\`\`

**Expected Response** (201):
\`\`\`json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "citizen",
      "reward_points": 0,
      "created_at": "2025-01-01T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Save the token**: You'll need this for authenticated requests.

---

### Step 3: Citizen Login

**Request**:
\`\`\`
POST http://localhost:5000/api/auth/citizen/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
\`\`\`

**Expected Response** (200):
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "citizen",
      "reward_points": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

---

### Step 4: Get Citizen Profile

**Request**:
\`\`\`
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_CITIZEN_TOKEN_HERE
\`\`\`

**Replace**: `YOUR_CITIZEN_TOKEN_HERE` with the token from Step 3

**Expected Response** (200):
\`\`\`json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "phone": "+1234567890",
    "address": "123 Main Street, City",
    "reward_points": 0,
    "created_at": "2025-01-01T10:00:00Z"
  }
}
\`\`\`

---

### Step 5: Admin Login

**Request**:
\`\`\`
POST http://localhost:5000/api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@ecosmart.com",
  "password": "EcoSmart@Admin#2025!Secure"
}
\`\`\`

**Expected Response** (200):
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

**Save the admin token**: You'll need this for admin-protected requests.

---

### Step 6: Get Admin Profile

**Request**:
\`\`\`
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
\`\`\`

**Replace**: `YOUR_ADMIN_TOKEN_HERE` with the token from Step 5

**Expected Response** (200):
\`\`\`json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": 0,
    "name": "System Admin",
    "email": "admin@ecosmart.com",
    "role": "admin"
  }
}
\`\`\`

---

## Using Thunder Client Variables

### Create Token Variable

1. Click the **Variables** icon in Thunder Client
2. Click **Create** or **+**
3. Add variable:
   - **Name**: `citizen_token`
   - **Value**: Paste your citizen token
4. Save

Repeat for admin:
   - **Name**: `admin_token`
   - **Value**: Paste your admin token

### Use Variable in Request

Instead of pasting the token:
\`\`\`
Authorization: Bearer {{citizen_token}}
\`\`\`

Or for admin:
\`\`\`
Authorization: Bearer {{admin_token}}
\`\`\`

---

## Testing Error Scenarios

### Test 1: Invalid Email Format

**Request**:
\`\`\`
POST http://localhost:5000/api/auth/citizen/login
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "Password123"
}
\`\`\`

**Expected Response** (400):
\`\`\`json
{
  "success": false,
  "message": "Please provide a valid email"
}
\`\`\`

---

### Test 2: Invalid Credentials

**Request**:
\`\`\`
POST http://localhost:5000/api/auth/citizen/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "WrongPassword"
}
\`\`\`

**Expected Response** (401):
\`\`\`json
{
  "success": false,
  "message": "Invalid email or password"
}
\`\`\`

---

### Test 3: Missing Token

**Request**:
\`\`\`
GET http://localhost:5000/api/auth/me
\`\`\`

(No Authorization header)

**Expected Response** (401):
\`\`\`json
{
  "success": false,
  "message": "Access token required"
}
\`\`\`

---

### Test 4: Invalid Token

**Request**:
\`\`\`
GET http://localhost:5000/api/auth/me
Authorization: Bearer invalid_token_12345
\`\`\`

**Expected Response** (401):
\`\`\`json
{
  "success": false,
  "message": "Invalid token"
}
\`\`\`

---

### Test 5: Duplicate Email

**Request**:
\`\`\`
POST http://localhost:5000/api/auth/citizen/register
Content-Type: application/json

{
  "name": "Another User",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+9876543210",
  "address": "456 Oak Street"
}
\`\`\`

(Using email from Step 2)

**Expected Response** (409):
\`\`\`json
{
  "success": false,
  "message": "Email already registered"
}
\`\`\`

---

## API Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Login successful |
| 201 | Created | Registration successful |
| 400 | Bad Request | Invalid email format |
| 401 | Unauthorized | Invalid credentials, missing token |
| 403 | Forbidden | Admin access required |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Database connection failed |

---

## Quick Reference - All Endpoints

### Authentication (No Token Required)
\`\`\`
POST   /api/auth/citizen/register
POST   /api/auth/citizen/login
POST   /api/auth/admin/login
\`\`\`

### Authentication (Token Required)
\`\`\`
GET    /api/auth/me
GET    /api/auth/profile
\`\`\`

### Admin Routes (Token Required)
\`\`\`
GET    /api/admin/bins
POST   /api/admin/bins
GET    /api/admin/bins/:id
PUT    /api/admin/bins/:id
DELETE /api/admin/bins/:id

GET    /api/admin/collectors
POST   /api/admin/collectors
GET    /api/admin/collectors/:id
PUT    /api/admin/collectors/:id
DELETE /api/admin/collectors/:id

GET    /api/admin/complaints
POST   /api/admin/complaints
GET    /api/admin/complaints/:id
PUT    /api/admin/complaints/:id
DELETE /api/admin/complaints/:id
\`\`\`

### Swagger Documentation
\`\`\`
GET    /api/docs
\`\`\`

---

## Testing Checklist

- [x] Health Check
- [x] Citizen Registration
- [x] Citizen Login
- [x] Get Citizen Profile
- [x] Admin Login
- [x] Get Admin Profile
- [x] Test Invalid Email
- [x] Test Invalid Password
- [x] Test Missing Token
- [x] Test Invalid Token
- [x] Test Duplicate Email
- [ ] Test Admin Bins Endpoints
- [ ] Test Admin Collectors Endpoints
- [ ] Test Admin Complaints Endpoints

---

## Pro Tips

### 1. Copy Full cURL Command
Right-click request → Copy as cURL → Use in terminal

### 2. Save Request History
Thunder Client automatically saves all requests

### 3. Compare Responses
Click response → Compare with previous response

### 4. Mock Server
Create mock responses for testing without backend

### 5. Export Collection
Click Collections → Export → Share with team

---

## Common Issues & Solutions

### Issue: "Connection refused"
**Solution**: 
- Ensure backend is running: `npm run dev`
- Check port 5000 is not blocked

### Issue: "Invalid token"
**Solution**:
- Copy fresh token from login response
- Token expires after 7 days
- Login again to get new token

### Issue: "CORS error in browser"
**Solution**:
- Thunder Client doesn't have CORS issues
- Frontend browser will have CORS issues if backend CORS_ORIGIN is wrong
- Update `/backend/.env`: `CORS_ORIGIN=http://localhost:5173`

### Issue: "Database connection failed"
**Solution**:
- Check DATABASE_URL in `/backend/.env`
- Verify PostgreSQL is running
- Check database credentials

---

## Next Steps After Testing

1. ✅ Authentication working
2. ✅ API endpoints responding
3. Next: Test admin features (bins, collectors, routes)
4. Build real-time updates (WebSocket)
5. Deploy to production

---

**Version**: 1.0
**Last Updated**: January 2025
**Status**: ✅ Ready for Testing
