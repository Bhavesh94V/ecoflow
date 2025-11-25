import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Route as RouteIcon,
  Truck,
  MapPin,
  Clock,
  TrendingDown,
  Zap,
  Navigation,
  Play,
  Pause
} from "lucide-react";

export default function AdminRoutes() {
  const routes = [
    { 
      id: "RT-001", 
      name: "North Zone Morning", 
      driver: "John Smith",
      vehicle: "WM-1234",
      bins: 12, 
      distance: "24.5 km",
      duration: "2h 15m",
      status: "active",
      efficiency: 92,
      fuelSaved: "15%"
    },
    { 
      id: "RT-002", 
      name: "Central Zone Afternoon", 
      driver: "Sarah Johnson",
      vehicle: "WM-5678",
      bins: 18, 
      distance: "31.2 km",
      duration: "3h 05m",
      status: "active",
      efficiency: 88,
      fuelSaved: "12%"
    },
    { 
      id: "RT-003", 
      name: "South Zone Evening", 
      driver: "Mike Wilson",
      vehicle: "WM-9012",
      bins: 15, 
      distance: "28.8 km",
      duration: "2h 45m",
      status: "scheduled",
      efficiency: 95,
      fuelSaved: "18%"
    },
    { 
      id: "RT-004", 
      name: "East Zone Morning", 
      driver: "Emma Davis",
      vehicle: "WM-3456",
      bins: 10, 
      distance: "19.3 km",
      duration: "1h 50m",
      status: "completed",
      efficiency: 90,
      fuelSaved: "14%"
    },
  ];

  const optimizationMetrics = [
    { label: "Total Routes Today", value: "24", icon: RouteIcon, color: "primary" },
    { label: "Active Vehicles", value: "18", icon: Truck, color: "success" },
    { label: "Avg. Efficiency", value: "91%", icon: Zap, color: "info" },
    { label: "Fuel Saved", value: "142L", icon: TrendingDown, color: "warning" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "scheduled": return "info";
      case "completed": return "default";
      default: return "secondary";
    }
  };

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
            <Button variant="outline" className="gap-2">
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

        {/* Map Visualization */}
        <Card className="p-6 border-2 mb-8 h-[400px] relative overflow-hidden">
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-lg font-bold mb-2">Live Route Tracking</h3>
            <div className="flex gap-2">
              <Badge variant="default" className="bg-success">2 Active</Badge>
              <Badge variant="secondary">1 Scheduled</Badge>
            </div>
          </div>

          {/* Mock Map */}
          <div className="w-full h-full bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg flex items-center justify-center relative">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-10">
              {Array.from({ length: 96 }).map((_, i) => (
                <div key={i} className="border border-border" />
              ))}
            </div>

            {/* Route Lines */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 100 100 Q 200 50 300 100 T 500 100 L 650 200"
                stroke="hsl(var(--success))"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
              <path
                d="M 150 250 Q 300 200 450 250 T 700 250"
                stroke="hsl(var(--info))"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </svg>

            {/* Vehicle Markers */}
            <div className="absolute" style={{ left: "20%", top: "25%" }}>
              <div className="w-12 h-12 rounded-full bg-success shadow-lg border-4 border-white flex items-center justify-center animate-pulse-glow">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute" style={{ left: "60%", top: "60%" }}>
              <div className="w-12 h-12 rounded-full bg-info shadow-lg border-4 border-white flex items-center justify-center animate-pulse-glow">
                <Truck className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center text-muted-foreground">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Real-time Route Visualization</p>
              <p className="text-xs">Track vehicles and optimized paths</p>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
            <h4 className="font-semibold text-sm mb-3">Route Status</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-success" />
                <span className="text-xs">Active Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-info" />
                <span className="text-xs">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-muted" />
                <span className="text-xs">Completed</span>
              </div>
            </div>
          </div>
        </Card>

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
                {routes.map((route) => (
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
                            <div 
                              className="h-full bg-success" 
                              style={{ width: `${route.efficiency}%` }} 
                            />
                          </div>
                          <span className="text-sm font-medium">{route.efficiency}%</span>
                        </div>
                        <p className="text-xs text-success">↓ {route.fuelSaved} fuel</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
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
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Optimization Card */}
        <Card className="p-6 border-2 bg-gradient-primary text-white mt-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">AI Route Optimization</h3>
              <p className="text-white/90 mb-4">
                Our AI has analyzed traffic patterns and bin fill levels. We've identified an opportunity to reduce 
                total distance by 18% and save approximately 45L of fuel by optimizing 3 routes in the Central Zone.
              </p>
              <div className="flex gap-3">
                <Button className="bg-white text-primary hover:bg-white/90">
                  Apply Optimization
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
