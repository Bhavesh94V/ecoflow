import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminIoTData() {
  const sensorData = [
    {
      binId: "BIN-001",
      location: "Green Park Main Gate",
      fillLevel: 30,
      temperature: 24,
      weight: 45,
      battery: 85,
      signal: "strong",
      humidity: 62,
      lastUpdate: "1 min ago",
      alerts: []
    },
    {
      binId: "BIN-002",
      location: "Market Street Corner",
      fillLevel: 55,
      temperature: 26,
      weight: 82,
      battery: 72,
      signal: "strong",
      humidity: 58,
      lastUpdate: "2 mins ago",
      alerts: ["High temperature"]
    },
    {
      binId: "BIN-003",
      location: "City Mall Parking",
      fillLevel: 95,
      temperature: 29,
      weight: 142,
      battery: 45,
      signal: "medium",
      humidity: 65,
      lastUpdate: "30 secs ago",
      alerts: ["Overflow", "Low battery"]
    },
    {
      binId: "BIN-004",
      location: "Central Bus Station",
      fillLevel: 25,
      temperature: 23,
      weight: 38,
      battery: 91,
      signal: "strong",
      humidity: 60,
      lastUpdate: "3 mins ago",
      alerts: []
    },
  ];

  const fillLevelHistory = [
    { time: "00:00", level: 20 },
    { time: "04:00", level: 28 },
    { time: "08:00", level: 45 },
    { time: "12:00", level: 68 },
    { time: "16:00", level: 82 },
    { time: "20:00", level: 91 },
    { time: "23:59", level: 95 },
  ];

  const temperatureHistory = [
    { time: "00:00", temp: 18 },
    { time: "04:00", temp: 16 },
    { time: "08:00", temp: 20 },
    { time: "12:00", temp: 26 },
    { time: "16:00", temp: 29 },
    { time: "20:00", temp: 24 },
    { time: "23:59", temp: 21 },
  ];

  const metrics = [
    { label: "Active Sensors", value: "1,247", icon: Radio, color: "primary", change: "+12" },
    { label: "Data Points Today", value: "458K", icon: Activity, color: "success", change: "+8.2%" },
    { label: "Avg Response Time", value: "1.2s", icon: TrendingUp, color: "info", change: "-0.3s" },
    { label: "Critical Alerts", value: "23", icon: AlertTriangle, color: "warning", change: "-5" },
  ];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "strong": return "success";
      case "medium": return "warning";
      case "weak": return "danger";
      default: return "muted";
    }
  };

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
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="hero" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
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
          </Card>

          <Card className="p-6 border-2">
            <h3 className="text-lg font-bold mb-6">Temperature Monitoring (Last 24h)</h3>
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
          </Card>
        </div>

        {/* Sensor Data Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sensorData.map((sensor) => (
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
                  <p className="text-sm font-medium text-danger">
                    {sensor.alerts.join(", ")}
                  </p>
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
                <Button variant="outline" size="sm">View History</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
