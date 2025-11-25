"use client"

import { AdminSidebar } from "@/components/AdminSidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react"
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
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { dashboardApi, alertsApi, type DashboardStats, type Alert } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const safeAlerts = Array.isArray(alerts) ? alerts : [];


  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin-login")
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, alertsResponse] = await Promise.all([
        dashboardApi.getStats(),
        alertsApi.getAll({ limit: 5 }),
      ])

      if (statsResponse.success) {
        setDashboardStats(statsResponse.data)
      }

      if (alertsResponse.success) {
        setAlerts(alertsResponse.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchDashboardData()
    }
  }, [isAuthenticated, user])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDashboardData()
  }

  // Default data for charts if API data not available
  const wasteCollectionData = dashboardStats?.wasteCollectionData || [
    { day: "Mon", waste: 65, predicted: 62 },
    { day: "Tue", waste: 72, predicted: 70 },
    { day: "Wed", waste: 68, predicted: 71 },
    { day: "Thu", waste: 81, predicted: 78 },
    { day: "Fri", waste: 89, predicted: 85 },
    { day: "Sat", waste: 95, predicted: 92 },
    { day: "Sun", waste: 78, predicted: 80 },
  ]

  const areaWiseData = dashboardStats?.areaWiseData || [
    { area: "North", waste: 245 },
    { area: "South", waste: 312 },
    { area: "East", waste: 198 },
    { area: "West", waste: 267 },
    { area: "Central", waste: 225 },
  ]

  const wasteTypeData = dashboardStats?.wasteTypeData || [
    { name: "Recyclable", value: 45, color: "#10b981" },
    { name: "Biodegradable", value: 30, color: "#3b82f6" },
    { name: "Hazardous", value: 10, color: "#ef4444" },
    { name: "Non-Recyclable", value: 15, color: "#6b7280" },
  ]

  const stats = [
    {
      label: "Total Bins",
      value: dashboardStats?.totalBins?.toLocaleString() || "0",
      change: "+12%",
      icon: Trash2,
      color: "primary",
      trend: "up",
    },
    {
      label: "Today's Collection",
      value: `${dashboardStats?.todayCollection || 0} tons`,
      change: "+8%",
      icon: TrendingUp,
      color: "success",
      trend: "up",
    },
    {
      label: "Active Collectors",
      value: dashboardStats?.activeCollectors?.toString() || "0",
      change: "+3",
      icon: Users,
      color: "info",
      trend: "up",
    },
    {
      label: "Pending Alerts",
      value: dashboardStats?.pendingAlerts?.toString() || "0",
      change: "-5",
      icon: AlertTriangle,
      color: "warning",
      trend: "down",
    },
  ]

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Real-time insights and analytics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="hero" size="sm" className="gap-2" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <Badge variant={stat.trend === "up" ? "default" : "secondary"}>{stat.change}</Badge>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Waste Collection */}
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Daily Waste Collection</h3>
              <Badge variant="outline">Last 7 Days</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wasteCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="waste" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual" />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Area-wise Distribution */}
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Area-wise Waste Pattern</h3>
              <Badge variant="outline">This Week</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areaWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="waste" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Waste Type Distribution */}
          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold mb-6">Waste Type Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Alerts */}
          <Card className="p-6 border-2 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent Bin Alerts</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/iot-data")}>
                View All
              </Button>
            </div>
            {/* <div className="space-y-4">

              {alerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent alerts</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${alert.severity === "high"
                        ? "bg-danger/10"
                        : alert.severity === "medium"
                          ? "bg-warning/10"
                          : "bg-info/10"
                        } flex items-center justify-center`}
                    >
                      {alert.severity === "high" ? (
                        <AlertTriangle className="w-5 h-5 text-danger" />
                      ) : alert.severity === "medium" ? (
                        <Clock className="w-5 h-5 text-warning" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-info" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{alert.binLocation || alert.binId}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{alert.type.replace("_", " ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{new Date(alert.createdAt).toLocaleTimeString()}</p>
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div> */}
            <div className="space-y-4">
              {safeAlerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent alerts</p>
              ) : (
                safeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${alert.severity === "high"
                          ? "bg-danger/10"
                          : alert.severity === "medium"
                            ? "bg-warning/10"
                            : "bg-info/10"
                        } flex items-center justify-center`}
                    >
                      {alert.severity === "high" ? (
                        <AlertTriangle className="w-5 h-5 text-danger" />
                      ) : alert.severity === "medium" ? (
                        <Clock className="w-5 h-5 text-warning" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-info" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{alert.binLocation || alert.binId}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {alert.type?.replace("_", " ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </p>
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>

          </Card>
        </div>

        {/* AI Insights Card */}
        <Card className="p-6 border-2 bg-gradient-hero text-white mt-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">AI Insights</h3>
              <p className="text-white/90 mb-4">
                Based on historical patterns, waste generation is expected to increase by 12% this weekend. Consider
                allocating 3 additional collection vehicles to high-traffic areas.
              </p>
              <Button className="bg-white text-primary hover:bg-white/90">View Recommendations</Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
