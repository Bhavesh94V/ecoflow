-- NEW FILE - Database seed data for testing all functionality

-- Seed Users (Citizens)
INSERT INTO users (name, email, password, role, phone, address, reward_points, created_at, updated_at)
VALUES
  ('Raj Kumar', 'raj@example.com', '$2b$10$hashedpassword1', 'citizen', '9876543210', '123 Green Street, Mumbai', 150, NOW(), NOW()),
  ('Priya Singh', 'priya@example.com', '$2b$10$hashedpassword2', 'citizen', '9988776655', '456 Blue Avenue, Delhi', 200, NOW(), NOW()),
  ('Amit Patel', 'amit@example.com', '$2b$10$hashedpassword3', 'citizen', '9123456789', '789 Red Lane, Bangalore', 75, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Seed Collectors
INSERT INTO collectors (name, phone, email, vehicle_number, zone, rating, status, shifts_completed, created_at, updated_at)
VALUES
  ('John Smith', '9111111111', 'john@ecosmart.com', 'WM-1234', 'central-zone', 4.7, 'active', 85, NOW(), NOW()),
  ('Sarah Johnson', '9222222222', 'sarah@ecosmart.com', 'WM-5678', 'central-zone', 4.9, 'active', 92, NOW(), NOW()),
  ('Mike Wilson', '9333333333', 'mike@ecosmart.com', 'WM-9012', 'south-zone', 4.5, 'on_break', 78, NOW(), NOW()),
  ('Emma Davis', '9444444444', 'emma@ecosmart.com', 'WM-3456', 'east-zone', 5.0, 'active', 110, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Seed Bins
INSERT INTO bins (bin_id, location_name, area, latitude, longitude, status, fill_level, temperature, weight, gas_level, humidity, battery, created_at, updated_at)
VALUES
  ('BIN-001', 'Green Park Main Gate', 'central-zone', 19.0760, 72.8777, 'normal', 45, 24, 68, 15, 62, 85, NOW(), NOW()),
  ('BIN-002', 'Market Street Corner', 'central-zone', 19.0761, 72.8778, 'half', 65, 26, 98, 22, 58, 72, NOW(), NOW()),
  ('BIN-003', 'City Mall Parking', 'east-zone', 19.0762, 72.8779, 'overflow', 92, 29, 138, 35, 65, 45, NOW(), NOW()),
  ('BIN-004', 'Central Bus Station', 'central-zone', 19.0763, 72.8780, 'normal', 38, 23, 57, 12, 60, 91, NOW(), NOW()),
  ('BIN-005', 'South Park Entrance', 'south-zone', 19.0764, 72.8781, 'normal', 52, 25, 78, 18, 61, 88, NOW(), NOW())
ON CONFLICT (bin_id) DO NOTHING;

-- Seed IoT Logs (sensor data)
INSERT INTO iot_logs (bin_id, fill_level, temperature, weight, gas_level, humidity, battery, timestamp)
SELECT b.id, RANDOM() * 100, 20 + RANDOM() * 15, RANDOM() * 150, RANDOM() * 50, 55 + RANDOM() * 20, 40 + RANDOM() * 60, NOW() - (i || ' minutes')::INTERVAL
FROM bins b, generate_series(0, 47) AS i
ON CONFLICT DO NOTHING;

-- Seed Routes
INSERT INTO routes (route_id, name, driver_id, distance, duration, efficiency, status, fuel_saved, scheduled_at, created_at, updated_at)
VALUES
  ('RT-001', 'North Zone Morning', 1, 24.5, 135, 92, 'active', 15, NOW(), NOW(), NOW()),
  ('RT-002', 'Central Zone Afternoon', 2, 31.2, 185, 88, 'active', 12, NOW(), NOW(), NOW()),
  ('RT-003', 'South Zone Evening', 3, 28.8, 165, 95, 'scheduled', 18, NOW() + INTERVAL '3 hours', NOW(), NOW()),
  ('RT-004', 'East Zone Morning', 4, 19.3, 110, 90, 'completed', 14, NOW() - INTERVAL '2 hours', NOW(), NOW())
ON CONFLICT (route_id) DO NOTHING;

-- Seed Route-Bin mappings
INSERT INTO route_bins (route_id, bin_id, sequence)
SELECT r.id, b.id, ROW_NUMBER() OVER (PARTITION BY r.id ORDER BY b.id)
FROM routes r, bins b
WHERE r.id <= 4 AND b.id <= 5
ON CONFLICT DO NOTHING;

-- Seed Complaints
INSERT INTO complaints (user_id, bin_id, message, priority, status, assigned_to, created_at, updated_at)
VALUES
  (1, 3, 'Bin overflowing with waste', 'high', 'in_progress', 1, NOW(), NOW()),
  (2, 2, 'Bad smell from bin area', 'medium', 'pending', NULL, NOW(), NOW()),
  (3, 5, 'Bin not emptied since yesterday', 'medium', 'resolved', 2, NOW() - INTERVAL '1 day', NOW())
ON CONFLICT DO NOTHING;

-- Seed Pickups
INSERT INTO pickups (user_id, bin_id, status, driver_id, scheduled_time, completed_time, created_at, updated_at)
VALUES
  (1, 1, 'completed', 1, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', NOW(), NOW()),
  (2, 2, 'on_the_way', 2, NOW() + INTERVAL '30 minutes', NULL, NOW(), NOW()),
  (3, 3, 'requested', NULL, NOW() + INTERVAL '1 hour', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;
