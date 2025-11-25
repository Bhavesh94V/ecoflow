# Thunder Client - Complete API Testing Collection

Import this collection into Thunder Client for testing all EcoSmart APIs.

---

## Environment Setup

Create environment "EcoSmart Local" with these variables:

| Variable | Value |
|----------|-------|
| baseUrl | http://localhost:5000/api |
| adminToken | (fill after admin login) |
| citizenToken | (fill after citizen login) |

---

## Collection: EcoSmart API

### 1. Health & Debug

#### 1.1 Health Check
\`\`\`
GET {{baseUrl}}/health
\`\`\`

#### 1.2 Debug Routes
\`\`\`
GET {{baseUrl}}/debug/routes
\`\`\`

---

### 2. Authentication

#### 2.1 Admin Login
\`\`\`
POST {{baseUrl}}/auth/admin/login
Content-Type: application/json

{
  "email": "admin@ecosmart.com",
  "password": "EcoSmart@Admin#2025!Secure"
}
\`\`\`
**After Success:** Copy `data.token` to `adminToken` environment variable.

#### 2.2 Citizen Register
\`\`\`
POST {{baseUrl}}/auth/citizen/register
Content-Type: application/json

{
  "name": "New Citizen",
  "email": "newcitizen@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "456 Eco Street"
}
\`\`\`

#### 2.3 Citizen Login
\`\`\`
POST {{baseUrl}}/auth/citizen/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
\`\`\`
**After Success:** Copy `data.token` to `citizenToken` environment variable.

#### 2.4 Universal Login
\`\`\`
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "admin@ecosmart.com",
  "password": "EcoSmart@Admin#2025!Secure"
}
\`\`\`

#### 2.5 Get My Profile
\`\`\`
GET {{baseUrl}}/auth/me
Authorization: Bearer {{adminToken}}
\`\`\`

---

### 3. Admin - Bins Management

#### 3.1 Get All Bins
\`\`\`
GET {{baseUrl}}/admin/bins
Authorization: Bearer {{adminToken}}
\`\`\`

#### 3.2 Get All Bins (with filters)
\`\`\`
GET {{baseUrl}}/admin/bins?area=North&status=normal&page=1&limit=10
Authorization: Bearer {{adminToken}}
\`\`\`

#### 3.3 Get Bin by ID
\`\`\`
GET {{baseUrl}}/admin/bins/1
Authorization: Bearer {{adminToken}}
\`\`\`

#### 3.4 Create New Bin
\`\`\`
POST {{baseUrl}}/admin/bins
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "bin_id": "BIN-TEST-001",
  "location_name": "Test Location Park",
  "area": "Test Zone",
  "latitude": 28.6200,
  "longitude": 77.2200
}
\`\`\`

#### 3.5 Update Bin
\`\`\`
PUT {{baseUrl}}/admin/bins/1
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "location_name": "Updated Location Name",
  "area": "Updated Zone"
}
\`\`\`

#### 3.6 Delete Bin
\`\`\`
DELETE {{baseUrl}}/admin/bins/6
Authorization: Bearer {{adminToken}}
\`\`\`

---

### 4. Admin - Collectors Management

#### 4.1 Get All Collectors
\`\`\`
GET {{baseUrl}}/admin/collectors
Authorization: Bearer {{adminToken}}
\`\`\`

#### 4.2 Get Collector by ID
\`\`\`
GET {{baseUrl}}/admin/collectors/1
Authorization: Bearer {{adminToken}}
\`\`\`

#### 4.3 Create Collector
\`\`\`
POST {{baseUrl}}/admin/collectors
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "New Collector",
  "email": "newcollector@ecosmart.com",
  "phone": "+1234567999",
  "vehicle_number": "WM-9999",
  "zone": "New Zone"
}
\`\`\`

#### 4.4 Update Collector
\`\`\`
PUT {{baseUrl}}/admin/collectors/1
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "Updated Collector Name",
  "zone": "Updated Zone"
}
\`\`\`

#### 4.5 Delete Collector
\`\`\`
DELETE {{baseUrl}}/admin/collectors/5
Authorization: Bearer {{adminToken}}
\`\`\`

---

### 5. Admin - Complaints Management

#### 5.1 Get All Complaints
\`\`\`
GET {{baseUrl}}/admin/complaints
Authorization: Bearer {{adminToken}}
\`\`\`

#### 5.2 Get Complaints by Status
\`\`\`
GET {{baseUrl}}/admin/complaints?status=pending
Authorization: Bearer {{adminToken}}
\`\`\`

#### 5.3 Update Complaint Status
\`\`\`
PATCH {{baseUrl}}/admin/complaints/1/status
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "in_progress",
  "assigned_to": 1
}
\`\`\`

#### 5.4 Resolve Complaint
\`\`\`
PATCH {{baseUrl}}/admin/complaints/1/status
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "resolved"
}
\`\`\`

---

### 6. Admin - Routes Management

#### 6.1 Get All Routes
\`\`\`
GET {{baseUrl}}/admin/routes
Authorization: Bearer {{adminToken}}
\`\`\`

#### 6.2 Get Route by ID
\`\`\`
GET {{baseUrl}}/admin/routes/1
Authorization: Bearer {{adminToken}}
\`\`\`

#### 6.3 Create Route
\`\`\`
POST {{baseUrl}}/admin/routes
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "name": "New Test Route",
  "bin_ids": [1, 2, 3],
  "driver_id": 1,
  "scheduled_at": "2025-01-26T08:00:00Z"
}
\`\`\`

#### 6.4 Update Route Status
\`\`\`
PATCH {{baseUrl}}/admin/routes/1/status
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "active"
}
\`\`\`

---

### 7. Citizen Endpoints

#### 7.1 Get Nearby Bins
\`\`\`
GET {{baseUrl}}/citizen/bins?lat=28.6139&lng=77.2090
Authorization: Bearer {{citizenToken}}
\`\`\`

#### 7.2 Get My Rewards
\`\`\`
GET {{baseUrl}}/citizen/rewards
Authorization: Bearer {{citizenToken}}
\`\`\`

#### 7.3 Request Pickup
\`\`\`
POST {{baseUrl}}/citizen/pickup
Authorization: Bearer {{citizenToken}}
Content-Type: application/json

{
  "bin_id": 1,
  "scheduled_time": "2025-01-26T10:00:00Z"
}
\`\`\`

#### 7.4 Get Pickup Status
\`\`\`
GET {{baseUrl}}/citizen/pickup-status
Authorization: Bearer {{citizenToken}}
\`\`\`

#### 7.5 File Complaint
\`\`\`
POST {{baseUrl}}/citizen/complaint
Authorization: Bearer {{citizenToken}}
Content-Type: application/json

{
  "message": "Bin overflowing at main entrance",
  "bin_id": 1,
  "priority": "high"
}
\`\`\`

#### 7.6 Get My Complaints
\`\`\`
GET {{baseUrl}}/citizen/complaints
Authorization: Bearer {{citizenToken}}
\`\`\`

---

### 8. IoT Endpoints

#### 8.1 Submit Sensor Data
\`\`\`
POST {{baseUrl}}/iot/sensor-data
Content-Type: application/json

{
  "bin_id": "BIN-001",
  "fill_level": 75,
  "temperature": 28.5,
  "humidity": 65,
  "weight": 95.5,
  "battery": 80,
  "gas_level": 12.5
}
\`\`\`

#### 8.2 Get IoT Logs
\`\`\`
GET {{baseUrl}}/iot/bins/BIN-001/logs
Authorization: Bearer {{adminToken}}
\`\`\`

---

## Response Format

All API responses follow this format:

### Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": null
}
\`\`\`

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Server Error |

---

## Tips

1. **Always login first** to get tokens
2. **Copy tokens** to environment variables after login
3. **Use correct token** (admin vs citizen) for each endpoint
4. **Check response** for error messages
5. **Refresh token** if you get "Token expired" error
