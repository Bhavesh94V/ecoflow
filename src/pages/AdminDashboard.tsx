"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard"
import { dashboardApi } from "@/lib/api"
import { PublicNav } from "@/components/PublicNav"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Trash2, AlertTriangle, Users, TrendingUp, ClipboardList, Zap, Loader2, RefreshCw } from "lucide-react"

interface AdminStats {
  totalBins: number
  overflowBins: number
  totalCollectors: number
  activeCollectors: number
  totalComplaints: number
  pendingComplaints: number
  highPriorityComplaints: number
  pendingPickups: number
  todayCollection: number
  averageFillLevel: number
  wasteCollectionData: { day: string; waste: number; predicted: number }[]
  areaWiseData: { area: string; count: number }[]
  wasteTypeData: { name: string; value: number; color: string }[]
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: realtimeData, isConnected } = useRealtimeDashboard("admin", isAuthenticated)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin-login")
    }
  }, [authLoading, isAuthenticated, navigate, user])

  const fetchAdminStats = async () => {
    try {
      setIsRefreshing(true)
      const response = await dashboardApi.getStats()
      if (response.success) {
        console.log("[v0] Admin stats fetched:", response.data)
        setStats(response.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching admin stats:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminStats()
    }
  }, [isAuthenticated])

  // Update stats when real-time data changes
  useEffect(() => {
    if (realtimeData && stats) {
      console.log("[v0] Updating stats from real-time data")
      setStats((prev) => ({
        ...prev,
        ...realtimeData,
      }))
    }
  }, [realtimeData])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No data available</p>
          <Button onClick={fetchAdminStats}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Real-time waste management system overview</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Live" : "Offline"}</Badge>
              <Button variant="outline" size="sm" onClick={fetchAdminStats} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalBins}</p>
                  <p className="text-sm text-muted-foreground">Total Smart Bins</p>
                </div>
              </div>
              {stats.overflowBins > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <Badge variant="destructive">{stats.overflowBins} Overflow</Badge>
                </div>
              )}
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeCollectors}</p>
                  <p className="text-sm text-muted-foreground">Active Collectors</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">of {stats.totalCollectors} total</div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingComplaints}</p>
                  <p className="text-sm text-muted-foreground">Pending Complaints</p>
                </div>
              </div>
              {stats.highPriorityComplaints > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <Badge variant="destructive">{stats.highPriorityComplaints} High Priority</Badge>
                </div>
              )}
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.todayCollection}</p>
                  <p className="text-sm text-muted-foreground">Today's Pickups</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Waste Collection Trend */}
            <Card className="p-6 border-2">
              <h2 className="text-xl font-bold mb-6">Waste Collection Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.wasteCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="waste" stroke="#3b82f6" name="Actual" />
                  <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Waste Type Distribution */}
            <Card className="p-6 border-2">
              <h2 className="text-xl font-bold mb-6">Waste Type Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.wasteTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.wasteTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Area-wise Distribution */}
            <Card className="p-6 border-2">
              <h2 className="text-xl font-bold mb-6">Area-wise Bins Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.areaWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Bins" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* System Status */}
            <Card className="p-6 border-2">
              <h2 className="text-xl font-bold mb-6">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Pending Pickups
                  </span>
                  <Badge variant="secondary">{stats.pendingPickups}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Average Fill Level
                  </span>
                  <Badge variant="secondary">{stats.averageFillLevel}%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Real-time Connection
                  </span>
                  <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Active" : "Inactive"}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
