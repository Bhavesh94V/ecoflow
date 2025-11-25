# PostgreSQL Complete Setup Guide for EcoSmart

This guide covers everything you need to know about setting up and using PostgreSQL with EcoSmart.

---

## Table of Contents

1. [PostgreSQL Installation](#postgresql-installation)
2. [Database Creation](#database-creation)
3. [Connection String Format](#connection-string-format)
4. [All Database Tables](#all-database-tables)
5. [SQL Queries Reference](#sql-queries-reference)
6. [Prisma Commands](#prisma-commands)
7. [Common PostgreSQL Commands](#common-postgresql-commands)
8. [pgAdmin Setup (GUI)](#pgadmin-setup-gui)

---

## PostgreSQL Installation

### Windows

1. Download: https://www.postgresql.org/download/windows/
2. Run the installer
3. Set password for `postgres` user (REMEMBER THIS!)
4. Keep default port: `5432`
5. Finish installation
6. Add to PATH: `C:\Program Files\PostgreSQL\14\bin`

### Mac (Homebrew)

\`\`\`bash
# Install
brew install postgresql@14

# Start service
brew services start postgresql@14

# Verify
psql --version
\`\`\`

### Ubuntu/Linux

\`\`\`bash
# Install
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"
\`\`\`

---

## Database Creation

### Step 1: Connect as postgres user

\`\`\`bash
# Windows (PowerShell/CMD)
psql -U postgres

# Mac/Linux
sudo -u postgres psql
# OR
psql -U postgres -h localhost
\`\`\`

### Step 2: Run these SQL commands

\`\`\`sql
-- =============================================
-- CREATE DATABASE AND USER FOR ECOSMART
-- =============================================

-- Create database
CREATE DATABASE ecosmart_db;

-- Create user with password
CREATE USER ecosmart_user WITH ENCRYPTED PASSWORD 'EcoSmart@2025';

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE ecosmart_db TO ecosmart_user;

-- Connect to the new database
\c ecosmart_db

-- Grant schema privileges (IMPORTANT!)
GRANT ALL ON SCHEMA public TO ecosmart_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ecosmart_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ecosmart_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ecosmart_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ecosmart_user;

-- Verify user was created
\du

-- Exit
\q
\`\`\`

### Step 3: Test Connection

\`\`\`bash
psql -U ecosmart_user -d ecosmart_db -h localhost
# Enter password: EcoSmart@2025
\`\`\`

If successful, you'll see:
\`\`\`
ecosmart_db=>
\`\`\`

---

## Connection String Format

### Format

\`\`\`
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
\`\`\`

### Local PostgreSQL

\`\`\`
DATABASE_URL="postgresql://ecosmart_user:EcoSmart@2025@localhost:5432/ecosmart_db"
\`\`\`

### With SSL (for cloud databases like Neon, Supabase)

\`\`\`
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
\`\`\`

### Connection String Parts

| Part | Value | Description |
|------|-------|-------------|
| Protocol | postgresql:// | Database type |
| Username | ecosmart_user | Database user |
| Password | EcoSmart@2025 | User password |
| Host | localhost | Server address |
| Port | 5432 | PostgreSQL port (default) |
| Database | ecosmart_db | Database name |

---

## All Database Tables

### Tables Created by Prisma

After running `npm run db:push`, these tables are created:

| Table | Description |
|-------|-------------|
| users | Citizens and admin users |
| bins | Smart waste bins |
| collectors | Waste collection drivers |
| routes | Collection routes |
| route_bins | Junction table for routes and bins |
| pickups | Pickup requests from citizens |
| complaints | User complaints |
| iot_logs | IoT sensor data history |

### Table: users

\`\`\`sql
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(20) DEFAULT 'citizen',  -- 'citizen' or 'admin'
    phone           VARCHAR(50),
    address         VARCHAR(500),
    reward_points   INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Table: bins

\`\`\`sql
CREATE TABLE bins (
    id              SERIAL PRIMARY KEY,
    bin_id          VARCHAR(50) UNIQUE NOT NULL,  -- e.g., 'BIN-001'
    location_name   VARCHAR(255) NOT NULL,
    area            VARCHAR(100) NOT NULL,
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    status          VARCHAR(20) DEFAULT 'normal',  -- 'normal', 'half', 'overflow'
    fill_level      INTEGER DEFAULT 0,            -- 0-100 percentage
    temperature     DOUBLE PRECISION,
    weight          DOUBLE PRECISION,
    gas_level       DOUBLE PRECISION,
    humidity        DOUBLE PRECISION,
    battery         INTEGER,                       -- 0-100 percentage
    last_update     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Table: collectors

\`\`\`sql
CREATE TABLE collectors (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(50) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    vehicle_number  VARCHAR(50) NOT NULL,
    zone            VARCHAR(100) NOT NULL,
    rating          DOUBLE PRECISION DEFAULT 5.0,
    status          VARCHAR(20) DEFAULT 'active',  -- 'active', 'on_break', 'off_duty'
    shifts_completed INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Table: routes

\`\`\`sql
CREATE TABLE routes (
    id              SERIAL PRIMARY KEY,
    route_id        VARCHAR(50) UNIQUE NOT NULL,  -- e.g., 'RT-001'
    name            VARCHAR(255) NOT NULL,
    driver_id       INTEGER REFERENCES collectors(id),
    distance        DOUBLE PRECISION,
    duration        INTEGER,                       -- in minutes
    efficiency      DOUBLE PRECISION,
    status          VARCHAR(20) DEFAULT 'scheduled', -- 'active', 'scheduled', 'completed'
    fuel_saved      DOUBLE PRECISION,
    scheduled_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Table: route_bins

\`\`\`sql
CREATE TABLE route_bins (
    id          SERIAL PRIMARY KEY,
    route_id    INTEGER REFERENCES routes(id) ON DELETE CASCADE,
    bin_id      INTEGER REFERENCES bins(id) ON DELETE CASCADE,
    sequence    INTEGER DEFAULT 0,
    UNIQUE(route_id, bin_id)
);
\`\`\`

### Table: pickups

\`\`\`sql
CREATE TABLE pickups (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id),
    bin_id          INTEGER REFERENCES bins(id),
    status          VARCHAR(20) DEFAULT 'requested', -- 'requested', 'assigned', 'on_the_way', 'completed'
    driver_id       INTEGER REFERENCES collectors(id),
    scheduled_time  TIMESTAMP,
    completed_time  TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Table: complaints

\`\`\`sql
CREATE TABLE complaints (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    bin_id      INTEGER REFERENCES bins(id),
    message     TEXT NOT NULL,
    priority    VARCHAR(20) DEFAULT 'medium',  -- 'high', 'medium', 'low'
    status      VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'resolved', 'rejected'
    assigned_to INTEGER REFERENCES collectors(id),
    resolved_at TIMESTAMP,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Table: iot_logs

\`\`\`sql
CREATE TABLE iot_logs (
    id          SERIAL PRIMARY KEY,
    bin_id      INTEGER NOT NULL REFERENCES bins(id) ON DELETE CASCADE,
    fill_level  INTEGER NOT NULL,
    temperature DOUBLE PRECISION,
    weight      DOUBLE PRECISION,
    gas_level   DOUBLE PRECISION,
    humidity    DOUBLE PRECISION,
    battery     INTEGER,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## SQL Queries Reference

### User Queries

\`\`\`sql
-- View all users
SELECT * FROM users;

-- View only citizens
SELECT * FROM users WHERE role = 'citizen';

-- Find user by email
SELECT * FROM users WHERE email = 'john.doe@example.com';

-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Get user with most reward points
SELECT * FROM users ORDER BY reward_points DESC LIMIT 1;
\`\`\`

### Bin Queries

\`\`\`sql
-- View all bins
SELECT * FROM bins;

-- Bins by status
SELECT * FROM bins WHERE status = 'overflow';

-- Bins by area
SELECT * FROM bins WHERE area = 'North Zone';

-- Bins needing collection (fill > 70%)
SELECT bin_id, location_name, area, fill_level, status 
FROM bins 
WHERE fill_level > 70 
ORDER BY fill_level DESC;

-- Count bins by status
SELECT status, COUNT(*) as count FROM bins GROUP BY status;

-- Average fill level by area
SELECT area, ROUND(AVG(fill_level), 2) as avg_fill 
FROM bins 
GROUP BY area;
\`\`\`

### Collector Queries

\`\`\`sql
-- View all collectors
SELECT * FROM collectors;

-- Active collectors
SELECT * FROM collectors WHERE status = 'active';

-- Collectors by zone
SELECT * FROM collectors WHERE zone = 'North Zone';

-- Top rated collectors
SELECT name, zone, rating, shifts_completed 
FROM collectors 
ORDER BY rating DESC, shifts_completed DESC;
\`\`\`

### Complaint Queries

\`\`\`sql
-- View all complaints
SELECT c.*, u.name as citizen_name, b.bin_id, b.location_name
FROM complaints c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN bins b ON c.bin_id = b.id;

-- Pending complaints
SELECT * FROM complaints WHERE status = 'pending';

-- High priority complaints
SELECT * FROM complaints WHERE priority = 'high' AND status != 'resolved';

-- Complaints by status count
SELECT status, COUNT(*) as count FROM complaints GROUP BY status;
\`\`\`

### Pickup Queries

\`\`\`sql
-- View all pickups
SELECT p.*, u.name as citizen_name, c.name as driver_name
FROM pickups p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN collectors c ON p.driver_id = c.id;

-- Pending pickups
SELECT * FROM pickups WHERE status IN ('requested', 'assigned');

-- Completed pickups today
SELECT * FROM pickups 
WHERE status = 'completed' 
AND DATE(completed_time) = CURRENT_DATE;
\`\`\`

### IoT Logs Queries

\`\`\`sql
-- Latest readings for all bins
SELECT DISTINCT ON (bin_id) *
FROM iot_logs
ORDER BY bin_id, timestamp DESC;

-- Readings for specific bin
SELECT * FROM iot_logs 
WHERE bin_id = 1 
ORDER BY timestamp DESC 
LIMIT 10;

-- Average fill level over time (last 24 hours)
SELECT 
    bin_id,
    DATE_TRUNC('hour', timestamp) as hour,
    ROUND(AVG(fill_level), 2) as avg_fill
FROM iot_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY bin_id, DATE_TRUNC('hour', timestamp)
ORDER BY bin_id, hour;
\`\`\`

### Insert Sample Data Manually

\`\`\`sql
-- Insert a citizen (password: password123 - bcrypt hashed)
INSERT INTO users (name, email, password, role, phone, address)
VALUES (
    'Test User',
    'test@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.E8fJ5aP7q5x0EO',
    'citizen',
    '+1234567890',
    '123 Test Street'
);

-- Insert a bin
INSERT INTO bins (bin_id, location_name, area, latitude, longitude, status, fill_level)
VALUES (
    'BIN-NEW-001',
    'New Test Location',
    'Test Zone',
    28.6139,
    77.2090,
    'normal',
    25
);

-- Insert a collector
INSERT INTO collectors (name, email, phone, vehicle_number, zone)
VALUES (
    'New Driver',
    'driver@ecosmart.com',
    '+1234567999',
    'WM-NEW-01',
    'Test Zone'
);
\`\`\`

---

## Prisma Commands

Run these from the `backend` folder:

\`\`\`bash
# Generate Prisma Client (run after schema changes)
npm run db:generate
# OR
npx prisma generate

# Push schema to database (creates/updates tables)
npm run db:push
# OR
npx prisma db push

# Create migration (production)
npm run db:migrate
# OR
npx prisma migrate dev --name init

# Seed database with sample data
npm run db:seed
# OR
node prisma/seed.js

# Open Prisma Studio (GUI for database)
npm run db:studio
# OR
npx prisma studio

# Reset database (DELETES ALL DATA!)
npx prisma migrate reset

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
\`\`\`

---

## Common PostgreSQL Commands

### psql Commands

\`\`\`bash
# Connect to database
psql -U ecosmart_user -d ecosmart_db -h localhost

# Connect as postgres superuser
psql -U postgres
\`\`\`

### Inside psql

\`\`\`sql
-- List all databases
\l

-- Connect to a database
\c ecosmart_db

-- List all tables
\dt

-- Describe table structure
\d users
\d bins

-- List all users
\du

-- Show current database
SELECT current_database();

-- Show current user
SELECT current_user;

-- Exit psql
\q
\`\`\`

### Backup & Restore

\`\`\`bash
# Backup database
pg_dump -U ecosmart_user -d ecosmart_db -F c -f backup.dump

# Restore database
pg_restore -U ecosmart_user -d ecosmart_db -F c backup.dump

# Backup as SQL
pg_dump -U ecosmart_user -d ecosmart_db > backup.sql

# Restore from SQL
psql -U ecosmart_user -d ecosmart_db < backup.sql
\`\`\`

---

## pgAdmin Setup (GUI)

### Installation

Download: https://www.pgadmin.org/download/

### Connect to Local Database

1. Open pgAdmin
2. Right-click "Servers" → "Create" → "Server"
3. General tab:
   - Name: `EcoSmart Local`
4. Connection tab:
   - Host: `localhost`
   - Port: `5432`
   - Database: `ecosmart_db`
   - Username: `ecosmart_user`
   - Password: `EcoSmart@2025`
5. Click "Save"

### View Tables

1. Expand: Servers → EcoSmart Local → Databases → ecosmart_db
2. Expand: Schemas → public → Tables
3. Right-click any table → View/Edit Data → All Rows

---

## Quick Reference Card

### Connection Info

| Item | Value |
|------|-------|
| Host | localhost |
| Port | 5432 |
| Database | ecosmart_db |
| Username | ecosmart_user |
| Password | EcoSmart@2025 |
| Connection String | postgresql://ecosmart_user:EcoSmart@2025@localhost:5432/ecosmart_db |

### Backend Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma GUI |

### Default Credentials

| Account | Email | Password |
|---------|-------|----------|
| Admin | admin@ecosmart.com | EcoSmart@Admin#2025!Secure |
| Test Citizen | john.doe@example.com | password123 |
| Test Citizen 2 | sarah.smith@example.com | password123 |
\`\`\`
