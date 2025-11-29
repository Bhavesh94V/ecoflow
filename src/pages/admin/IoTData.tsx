"use client"

import { AdminSidebar } from "@/components/AdminSidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Radio,
  RefreshCw,
  Activity,
  Thermometer,
  Weight,
  Battery,
  Signal,
  AlertTriangle,
  TrendingUp,
  Download,
  Loader2,
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface SensorData {
  binId: string
  location: string
  fillLevel: number
  temperature: number
  weight: number
  battery: number
  signal: string
  humidity: number
  lastUpdate: string
  alerts: string[]
}

export default function AdminIoTData() {
  const { toast } = useToast()
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [fillLevelHistory, setFillLevelHistory] = useState([])
  const [temperatureHistory, setTemperatureHistory] = useState([])
  const [metrics, setMetrics] = useState({
    activeSensors: "0",
    dataPointsToday: "0K",
    avgResponseTime: "0s",
    criticalAlerts: "0",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchIoTData()
  }, [])

  const fetchIoTData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      // Fetch metrics
      const metricsRes = await fetch("http://localhost:5000/api/admin/iot/metrics", { headers })
      if (!metricsRes.ok) throw new Error("Failed to fetch metrics")
      const metricsData = await metricsRes.json()
      if (metricsData.success) {
        setMetrics(metricsData.data)
      }

      // Fetch sensor data
      const sensorsRes = await fetch("http://localhost:5000/api/admin/iot/sensors", { headers })
      if (!sensorsRes.ok) throw new Error("Failed to fetch sensors")
      const sensorsData = await sensorsRes.json()
      if (sensorsData.success) {
        setSensorData(sensorsData.data || [])
      }

      // Fetch fill level history
      const fillRes = await fetch("http://localhost:5000/api/admin/iot/fill-level-history", { headers })
      if (!fillRes.ok) throw new Error("Failed to fetch fill history")
      const fillData = await fillRes.json()
      if (fillData.success) {
        setFillLevelHistory(fillData.data || [])
      }

      // Fetch temperature history
      const tempRes = await fetch("http://localhost:5000/api/admin/iot/temperature-history", { headers })
      if (!tempRes.ok) throw new Error("Failed to fetch temperature history")
      const tempData = await tempRes.json()
      if (tempData.success) {
        setTemperatureHistory(tempData.data || [])
      }
    } catch (error) {
      console.error("Error fetching IoT data:", error)
      toast({ title: "Error", description: "Failed to fetch IoT data", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "strong":
        return "success"
      case "medium":
        return "warning"
      case "weak":
        return "danger"
      default:
        return "muted"
    }
  }

  const metricsConfig = [
    { label: "Active Sensors", value: metrics.activeSensors, icon: Radio, color: "primary", change: "+12" },
    { label: "Data Points Today", value: metrics.dataPointsToday, icon: Activity, color: "success", change: "+8.2%" },
    { label: "Avg Response Time", value: metrics.avgResponseTime, icon: TrendingUp, color: "info", change: "-0.3s" },
    { label: "Critical Alerts", value: metrics.criticalAlerts, icon: AlertTriangle, color: "warning", change: "-5" },
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
            <h1 className="text-3xl font-bold mb-2">IoT Device Data Panel</h1>
            <p className="text-muted-foreground">Real-time sensor data and device monitoring</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="hero" size="sm" className="gap-2" onClick={fetchIoTData}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metricsConfig.map((metric, index) => (
            <Card key={index} className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${metric.color}/10 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}`} />
                </div>
                <Badge variant="outline">{metric.change}</Badge>
              </div>
              <p className="text-3xl font-bold mb-1">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold mb-6">Fill Level Trends (Last 24h)</h3>
            {fillLevelHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={fillLevelHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="level"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    name="Fill Level %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">No data available</p>
            )}
          </Card>

          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold mb-6">Temperature Monitoring (Last 24h)</h3>
            {temperatureHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={temperatureHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    name="Temperature °C"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">No data available</p>
            )}
          </Card>
        </div>

        {/* Sensor Data Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sensorData.length > 0 ? (
            sensorData.map((sensor) => (
              <Card key={sensor.binId} className="p-6 border-2 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{sensor.binId}</h3>
                      {sensor.alerts.length > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {sensor.alerts.length}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{sensor.location}</p>
                  </div>
                  <Badge variant={getSignalColor(sensor.signal) as any}>
                    <Signal className="w-3 h-3 mr-1" />
                    {sensor.signal}
                  </Badge>
                </div>

                {sensor.alerts.length > 0 && (
                  <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg">
                    <p className="text-sm font-medium text-danger">{sensor.alerts.join(", ")}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-muted/30 border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <span className="text-xs text-muted-foreground">Fill Level</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold">{sensor.fillLevel}%</p>
                      <div className="flex-1 h-2 bg-background rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full ${sensor.fillLevel > 70 ? "bg-danger" : sensor.fillLevel > 40 ? "bg-warning" : "bg-success"}`}
                          style={{ width: `${sensor.fillLevel}%` }}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-muted/30 border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-5 h-5 text-warning" />
                      <span className="text-xs text-muted-foreground">Temperature</span>
                    </div>
                    <p className="text-2xl font-bold">{sensor.temperature}°C</p>
                    <p className="text-xs text-muted-foreground mt-1">Humidity: {sensor.humidity}%</p>
                  </Card>

                  <Card className="p-4 bg-muted/30 border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Weight className="w-5 h-5 text-info" />
                      <span className="text-xs text-muted-foreground">Weight</span>
                    </div>
                    <p className="text-2xl font-bold">{sensor.weight} kg</p>
                    <p className="text-xs text-muted-foreground mt-1">of 150 kg capacity</p>
                  </Card>

                  <Card className="p-4 bg-muted/30 border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className={`w-5 h-5 ${sensor.battery < 50 ? "text-danger" : "text-success"}`} />
                      <span className="text-xs text-muted-foreground">Battery</span>
                    </div>
                    <p className="text-2xl font-bold">{sensor.battery}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Est. {Math.floor(sensor.battery / 2)} days</p>
                  </Card>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Last updated: {sensor.lastUpdate}</p>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="col-span-2 text-center text-muted-foreground p-8">No sensor data available</p>
          )}
        </div>
      </main>
    </div>
  )
}
