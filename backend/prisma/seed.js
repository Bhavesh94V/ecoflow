/**
 * Database Seeder
 * Run: npm run db:seed
 */

const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create sample citizen users
  const hashedPassword = await bcrypt.hash("password123", 12)

  const citizens = await Promise.all([
    prisma.user.upsert({
      where: { email: "john.doe@example.com" },
      update: {},
      create: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: hashedPassword,
        phone: "+1234567890",
        address: "123 Green Street",
        role: "citizen",
        reward_points: 847,
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah.smith@example.com" },
      update: {},
      create: {
        name: "Sarah Smith",
        email: "sarah.smith@example.com",
        password: hashedPassword,
        phone: "+1234567891",
        address: "456 Eco Avenue",
        role: "citizen",
        reward_points: 523,
      },
    }),
  ])

  console.log(`✅ Created ${citizens.length} citizens`)

  // Create sample bins
  const bins = await Promise.all([
    prisma.bin.upsert({
      where: { bin_id: "BIN-001" },
      update: {},
      create: {
        bin_id: "BIN-001",
        location_name: "Green Park Main Gate",
        area: "North Zone",
        latitude: 28.6139,
        longitude: 77.209,
        status: "normal",
        fill_level: 30,
        temperature: 24,
        weight: 45,
        battery: 85,
      },
    }),
    prisma.bin.upsert({
      where: { bin_id: "BIN-002" },
      update: {},
      create: {
        bin_id: "BIN-002",
        location_name: "Market Street Corner",
        area: "Central Zone",
        latitude: 28.62,
        longitude: 77.215,
        status: "half",
        fill_level: 55,
        temperature: 26,
        weight: 82,
        battery: 72,
      },
    }),
    prisma.bin.upsert({
      where: { bin_id: "BIN-003" },
      update: {},
      create: {
        bin_id: "BIN-003",
        location_name: "City Mall Parking",
        area: "South Zone",
        latitude: 28.605,
        longitude: 77.2,
        status: "overflow",
        fill_level: 95,
        temperature: 29,
        weight: 142,
        battery: 45,
      },
    }),
    prisma.bin.upsert({
      where: { bin_id: "BIN-004" },
      update: {},
      create: {
        bin_id: "BIN-004",
        location_name: "Central Bus Station",
        area: "East Zone",
        latitude: 28.618,
        longitude: 77.23,
        status: "normal",
        fill_level: 25,
        temperature: 23,
        weight: 38,
        battery: 91,
      },
    }),
    prisma.bin.upsert({
      where: { bin_id: "BIN-005" },
      update: {},
      create: {
        bin_id: "BIN-005",
        location_name: "Hospital Main Entrance",
        area: "West Zone",
        latitude: 28.61,
        longitude: 77.195,
        status: "half",
        fill_level: 70,
        temperature: 27,
        weight: 105,
        battery: 68,
      },
    }),
  ])

  console.log(`✅ Created ${bins.length} bins`)

  // Create sample collectors
  const collectors = await Promise.all([
    prisma.collector.upsert({
      where: { email: "john.smith@ecosmart.com" },
      update: {},
      create: {
        name: "John Smith",
        phone: "+1234567901",
        email: "john.smith@ecosmart.com",
        vehicle_number: "WM-1234",
        zone: "North Zone",
        rating: 4.8,
        status: "active",
        shifts_completed: 145,
      },
    }),
    prisma.collector.upsert({
      where: { email: "sarah.johnson@ecosmart.com" },
      update: {},
      create: {
        name: "Sarah Johnson",
        phone: "+1234567902",
        email: "sarah.johnson@ecosmart.com",
        vehicle_number: "WM-5678",
        zone: "Central Zone",
        rating: 4.9,
        status: "active",
        shifts_completed: 132,
      },
    }),
    prisma.collector.upsert({
      where: { email: "mike.wilson@ecosmart.com" },
      update: {},
      create: {
        name: "Mike Wilson",
        phone: "+1234567903",
        email: "mike.wilson@ecosmart.com",
        vehicle_number: "WM-9012",
        zone: "South Zone",
        rating: 4.7,
        status: "on_break",
        shifts_completed: 158,
      },
    }),
    prisma.collector.upsert({
      where: { email: "emma.davis@ecosmart.com" },
      update: {},
      create: {
        name: "Emma Davis",
        phone: "+1234567904",
        email: "emma.davis@ecosmart.com",
        vehicle_number: "WM-3456",
        zone: "East Zone",
        rating: 5.0,
        status: "active",
        shifts_completed: 127,
      },
    }),
  ])

  console.log(`✅ Created ${collectors.length} collectors`)

  // Create sample routes
  const routes = await Promise.all([
    prisma.route.upsert({
      where: { route_id: "RT-001" },
      update: {},
      create: {
        route_id: "RT-001",
        name: "North Zone Morning Route",
        driver_id: collectors[0].id,
        distance: 12.5,
        duration: 90,
        efficiency: 85,
        status: "active",
        fuel_saved: 2.3,
        scheduled_at: new Date(),
      },
    }),
    prisma.route.upsert({
      where: { route_id: "RT-002" },
      update: {},
      create: {
        route_id: "RT-002",
        name: "Central Zone Evening Route",
        driver_id: collectors[1].id,
        distance: 8.2,
        duration: 60,
        efficiency: 92,
        status: "scheduled",
        fuel_saved: 1.8,
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    }),
  ])

  console.log(`✅ Created ${routes.length} routes`)

  // Create sample complaints
  const complaints = await Promise.all([
    prisma.complaint.create({
      data: {
        user_id: citizens[0].id,
        bin_id: bins[2].id,
        message: "Bin overflow at City Mall Parking. Causing bad smell and attracting pests.",
        priority: "high",
        status: "pending",
      },
    }),
    prisma.complaint.create({
      data: {
        user_id: citizens[1].id,
        bin_id: bins[0].id,
        message: "Missed collection on Green Park. Collection was scheduled for morning.",
        priority: "medium",
        status: "in_progress",
        assigned_to: collectors[0].id,
      },
    }),
  ])

  console.log(`✅ Created ${complaints.length} complaints`)

  // Create sample pickups
  const pickups = await Promise.all([
    prisma.pickup.create({
      data: {
        user_id: citizens[0].id,
        bin_id: bins[0].id,
        status: "completed",
        driver_id: collectors[0].id,
        scheduled_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completed_time: new Date(Date.now() - 23 * 60 * 60 * 1000),
      },
    }),
    prisma.pickup.create({
      data: {
        user_id: citizens[0].id,
        status: "on_the_way",
        driver_id: collectors[1].id,
        scheduled_time: new Date(),
      },
    }),
  ])

  console.log(`✅ Created ${pickups.length} pickups`)

  console.log("✅ Database seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
