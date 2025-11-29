"use client"

import type React from "react"

import { AdminSidebar } from "@/components/AdminSidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Plus,
  Search,
  Edit,
  Phone,
  Mail,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { collectorsApi, type Collector } from "@/lib/api"

export default function AdminCollectors() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [collectors, setCollectors] = useState<Collector[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Form state for adding new collector
  const [newCollector, setNewCollector] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleId: "",
    area: "",
    licenseNumber: "",
  })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin-login")
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const fetchCollectors = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)

    try {
      const response = await collectorsApi.getAll({ limit: 100 })
      if (response.success) {
        setCollectors(response.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching collectors:", error)
      if (showLoading) {
        toast({
          title: "Error",
          description: "Failed to load collectors data.",
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return

    fetchCollectors(true)

    // Poll every 15 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchCollectors(false)
    }, 15000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [isAuthenticated, user])

  const stats = [
    { label: "Total Collectors", value: collectors.length.toString(), icon: Users, color: "primary" },
    {
      label: "Active Now",
      value: collectors.filter((c) => c.status === "active").length.toString(),
      icon: CheckCircle,
      color: "success",
    },
    {
      label: "On Break",
      value: collectors.filter((c) => c.status === "on-break").length.toString(),
      icon: Clock,
      color: "warning",
    },
    {
      label: "Total Vehicles",
      value: new Set(collectors.map((c) => c.vehicleId)).size.toString(),
      icon: Truck,
      color: "info",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "on-break":
        return "warning"
      case "off-duty":
        return "secondary"
      default:
        return "default"
    }
  }

  const handleAddCollector = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    try {
      const response = await collectorsApi.create(newCollector)

      if (response.success) {
        toast({
          title: "Collector Added Successfully",
          description: "New collector has been added to the system.",
        })
        setCollectors((prev) => [response.data, ...prev])
        setIsAddDialogOpen(false)
        setNewCollector({ name: "", email: "", phone: "", vehicleId: "", area: "", licenseNumber: "" })
      }
    } catch (error: any) {
      toast({
        title: "Failed to Add Collector",
        description: error.message || "Could not add the collector. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const filteredCollectors = collectors.filter(
    (collector) =>
      collector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collector.collectorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collector.area.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <h1 className="text-3xl font-bold mb-2">Collector Management</h1>
            <p className="text-muted-foreground">Manage collection staff and vehicle assignments</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsRefreshing(true)
                fetchCollectors(false)
              }}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Collector
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Collector</DialogTitle>
                  <DialogDescription>Register a new waste collection staff member</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleAddCollector}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="collectorName">Full Name</Label>
                      <Input
                        id="collectorName"
                        placeholder="John Doe"
                        value={newCollector.name}
                        onChange={(e) => setNewCollector((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collectorPhone">Phone Number</Label>
                      <Input
                        id="collectorPhone"
                        type="tel"
                        placeholder="+1 (234) 567-8900"
                        value={newCollector.phone}
                        onChange={(e) => setNewCollector((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collectorEmail">Email</Label>
                      <Input
                        id="collectorEmail"
                        type="email"
                        placeholder="john@ecosmart.com"
                        value={newCollector.email}
                        onChange={(e) => setNewCollector((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collectorVehicle">Vehicle ID</Label>
                      <Input
                        id="collectorVehicle"
                        placeholder="WM-1234"
                        value={newCollector.vehicleId}
                        onChange={(e) => setNewCollector((prev) => ({ ...prev, vehicleId: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collectorArea">Assigned Area</Label>
                      <Input
                        id="collectorArea"
                        placeholder="North Zone"
                        value={newCollector.area}
                        onChange={(e) => setNewCollector((prev) => ({ ...prev, area: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collectorLicense">License Number</Label>
                      <Input
                        id="collectorLicense"
                        placeholder="DL12345"
                        value={newCollector.licenseNumber}
                        onChange={(e) => setNewCollector((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="hero" disabled={isAdding}>
                      {isAdding ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Collector"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="p-6 border-2 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Collectors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCollectors.length === 0 ? (
            <Card className="p-8 col-span-full text-center text-muted-foreground">No collectors found</Card>
          ) : (
            filteredCollectors.map((collector) => (
              <Card key={collector.id} className="p-6 border-2 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {collector.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-bold">{collector.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{collector.collectorId}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(collector.status) as any}>{collector.status}</Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{collector.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{collector.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span>{collector.vehicleId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{collector.area}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold">{collector.shiftsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Shifts Completed</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold">{collector.rating.toFixed(1)}</span>
                      <span className="text-warning">★</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                {collector.currentRouteId && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium text-primary">Currently on route</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="hero" size="sm" className="flex-1">
                    Assign Route
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
