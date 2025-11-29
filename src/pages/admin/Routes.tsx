"use client"

import { AdminSidebar } from "@/components/AdminSidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  RouteIcon,
  Truck,
  MapPin,
  Clock,
  TrendingDown,
  Zap,
  Navigation,
  Play,
  Pause,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { routesApi, type Route } from "@/lib/api"

interface RouteData {
  id: string
  name: string
  driver: string
  vehicle: string
  bins: number
  distance: string
  duration: string
  status: string
  efficiency: number
  fuelSaved: string
}

export default function AdminRoutes() {
  const { toast } = useToast()
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalRoutesToday: 0,
    activeVehicles: 0,
    avgEfficiency: 0,
    fuelSaved: "0L",
  })
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchRoutes = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true)

      const response = await routesApi.getAll({ limit: 100 })
      if (response.success) {
        setRoutes(response.data || [])
        // Calculate stats from routes data
        const activeCount = response.data?.filter((r: Route) => r.status === "active").length || 0
        setStats({
          totalRoutesToday: response.data?.length || 0,
          activeVehicles: activeCount,
          avgEfficiency: Math.round(
            (response.data?.reduce((sum: number, r: Route) => sum + (r.efficiency || 85), 0) || 0) /
            (response.data?.length || 1),
          ),
          fuelSaved: `${Math.round((response.data?.reduce((sum: number, r: Route) => sum + (r.fuelSaved || 10), 0) || 0) / 100) * 10}L`,
        })
      }
    } catch (error) {
      console.error("[v0] Error fetching routes:", error)
      toast({ title: "Error", description: "Failed to fetch routes", variant: "destructive" })
    } finally {
      if (showLoading) setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRoutes(true)

    // Poll every 15 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchRoutes(false)
    }, 15000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "scheduled":
        return "info"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }

  const optimizationMetrics = [
    { label: "Total Routes Today", value: stats.totalRoutesToday.toString(), icon: RouteIcon, color: "primary" },
    { label: "Active Vehicles", value: stats.activeVehicles.toString(), icon: Truck, color: "success" },
    { label: "Avg. Efficiency", value: `${stats.avgEfficiency}%`, icon: Zap, color: "info" },
    { label: "Fuel Saved", value: stats.fuelSaved, icon: TrendingDown, color: "warning" },
  ]

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
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
            <h1 className="text-3xl font-bold mb-2">Route Optimization</h1>
            <p className="text-muted-foreground">AI-powered route planning and vehicle tracking</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => {
                setIsRefreshing(true)
                fetchRoutes(false)
              }}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Navigation className="w-4 h-4" />
              View Map
            </Button>
            <Button variant="hero" className="gap-2">
              <Zap className="w-4 h-4" />
              Optimize Routes
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {optimizationMetrics.map((metric, index) => (
            <Card key={index} className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${metric.color}/10 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </Card>
          ))}
        </div>

        {/* Routes List */}
        <Card className="border-2 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold">All Routes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold">Route ID</th>
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">Driver/Vehicle</th>
                  <th className="text-left p-4 font-semibold">Bins</th>
                  <th className="text-left p-4 font-semibold">Distance</th>
                  <th className="text-left p-4 font-semibold">Duration</th>
                  <th className="text-left p-4 font-semibold">Efficiency</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.length > 0 ? (
                  routes.map((route) => (
                    <tr key={route.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-semibold">{route.id}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <RouteIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{route.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{route.driver}</p>
                          <p className="text-sm text-muted-foreground">{route.vehicle}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{route.bins} bins</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{route.distance}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{route.duration}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-success" style={{ width: `${route.efficiency}%` }} />
                            </div>
                            <span className="text-sm font-medium">{route.efficiency}%</span>
                          </div>
                          <p className="text-xs text-success">↓ {route.fuelSaved} fuel</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusColor(route.status)}>{route.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {route.status === "active" ? (
                            <Button variant="ghost" size="sm" className="text-warning">
                              <Pause className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-success">
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-primary">
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      No routes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
