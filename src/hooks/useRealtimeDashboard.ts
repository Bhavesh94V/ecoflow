"use client"

/**
 * Custom Hook for Real-time Dashboard Updates
 * Uses Socket.IO to subscribe to live data changes
 */

import { useEffect, useState, useRef } from "react"
import { io, type Socket } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"

interface RealtimeDashboardData {
  totalBins?: number
  overflowBins?: number
  totalCollectors?: number
  activeCollectors?: number
  totalComplaints?: number
  pendingComplaints?: number
  highPriorityComplaints?: number
  pendingPickups?: number
  todayCollection?: number
  averageFillLevel?: number
  rewardPoints?: number
  pickupsCompleted?: number
  recyclingRate?: number
  activeComplaints?: number
}

export const useRealtimeDashboard = (userRole: "admin" | "citizen", isAuthenticated: boolean) => {
  const [data, setData] = useState<RealtimeDashboardData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    console.log("[v0] Connecting to WebSocket:", SOCKET_URL)

    // Initialize Socket.IO connection
    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("ecosmart_token"),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("[v0] WebSocket connected:", socket.id)
      setIsConnected(true)

      // Subscribe to appropriate channel based on role
      if (userRole === "admin") {
        socket.emit("subscribe:dashboard:admin")
      } else {
        socket.emit("subscribe:dashboard:citizen")
      }
    })

    socket.on("disconnect", () => {
      console.log("[v0] WebSocket disconnected")
      setIsConnected(false)
    })

    // Listen for real-time dashboard updates
    socket.on("dashboard:update", (newData: RealtimeDashboardData) => {
      console.log("[v0] Dashboard update received:", newData)
      setData(newData)
    })

    // Listen for bin updates
    socket.on("bin:update", (binData) => {
      console.log("[v0] Bin update received:", binData)
      setData((prev) => ({
        ...prev,
        totalBins: prev?.totalBins || 0,
        overflowBins: prev?.overflowBins || 0,
        averageFillLevel: prev?.averageFillLevel || 0,
      }))
    })

    // Listen for complaint updates
    socket.on("complaint:update", (complaintData) => {
      console.log("[v0] Complaint update received:", complaintData)
      setData((prev) => ({
        ...prev,
        totalComplaints: (prev?.totalComplaints || 0) + 1,
        pendingComplaints: (prev?.pendingComplaints || 0) + (complaintData.status === "pending" ? 1 : 0),
      }))
    })

    // Listen for pickup updates
    socket.on("pickup:update", (pickupData) => {
      console.log("[v0] Pickup update received:", pickupData)
      if (userRole === "admin") {
        setData((prev) => ({
          ...prev,
          pendingPickups: (prev?.pendingPickups || 0) + (pickupData.status === "pending" ? 1 : 0),
        }))
      }
    })

    socket.on("connect_error", (error) => {
      console.error("[v0] WebSocket connection error:", error)
    })

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [userRole, isAuthenticated])

  return { data, isConnected, socket: socketRef.current }
}
