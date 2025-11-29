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
  Plus,
  Search,
  Filter,
  Edit,
  MapPin,
  Battery,
  Thermometer,
  Weight,
  Signal,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { binsApi, type Bin } from "@/lib/api"

export default function AdminBins() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [bins, setBins] = useState<Bin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Form state for adding new bin
  const [newBin, setNewBin] = useState({
    binId: "",
    location: "",
    area: "",
    capacity: "",
    latitude: "",
    longitude: "",
  })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin-login")
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const fetchBins = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)

    try {
      const response = await binsApi.getAll({ limit: 100 })
      if (response.success) {
        const binsData = Array.isArray(response.data) ? response.data : []
        setBins(binsData)
      } else {
        setBins([])
      }
    } catch (error) {
      console.error("[v0] Error fetching bins:", error)
      setBins([])
      if (showLoading) {
        toast({
          title: "Error",
          description: "Failed to load bins data.",
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

    // Initial fetch
    fetchBins(true)

    // Poll every 15 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchBins(false)
    }, 15000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [isAuthenticated, user])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchBins(false)
  }

  const getStatusColor = (fillLevel: number) => {
    if (fillLevel >= 80) return "danger"
    if (fillLevel >= 50) return "warning"
    return "success"
  }

  const getStatusText = (fillLevel: number) => {
    if (fillLevel >= 80) return "overflow"
    if (fillLevel >= 50) return "half"
    return "normal"
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

  const handleAddBin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    try {
      const response = await binsApi.create({
        binId: newBin.binId,
        location: newBin.location,
        area: newBin.area,
        capacity: Number.parseInt(newBin.capacity),
        latitude: Number.parseFloat(newBin.latitude),
        longitude: Number.parseFloat(newBin.longitude),
      })

      if (response.success) {
        toast({
          title: "Bin Added Successfully",
          description: "New smart bin has been added to the system.",
        })
        setBins((prev) => [response.data, ...prev])
        setIsAddDialogOpen(false)
        setNewBin({ binId: "", location: "", area: "", capacity: "", latitude: "", longitude: "" })
      }
    } catch (error: any) {
      toast({
        title: "Failed to Add Bin",
        description: error.message || "Could not add the bin. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const filteredBins = Array.isArray(bins)
    ? bins.filter(
      (bin) =>
        bin.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.binId?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : []

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
            <h1 className="text-3xl font-bold mb-2">Smart Bins Management</h1>
            <p className="text-muted-foreground">Monitor and manage all smart waste bins</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Bin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Smart Bin</DialogTitle>
                  <DialogDescription>Register a new smart bin to the waste management system</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleAddBin}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="binId">Bin ID</Label>
                      <Input
                        id="binId"
                        placeholder="BIN-006"
                        value={newBin.binId}
                        onChange={(e) => setNewBin((prev) => ({ ...prev, binId: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Enter location"
                        value={newBin.location}
                        onChange={(e) => setNewBin((prev) => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area/Zone</Label>
                      <Input
                        id="area"
                        placeholder="e.g., North Zone"
                        value={newBin.area}
                        onChange={(e) => setNewBin((prev) => ({ ...prev, area: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity (kg)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="150"
                        value={newBin.capacity}
                        onChange={(e) => setNewBin((prev) => ({ ...prev, capacity: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        placeholder="28.5355"
                        value={newBin.latitude}
                        onChange={(e) => setNewBin((prev) => ({ ...prev, latitude: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        placeholder="77.3910"
                        value={newBin.longitude}
                        onChange={(e) => setNewBin((prev) => ({ ...prev, longitude: e.target.value }))}
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
                        "Add Bin"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 border-2 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by location, area, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 border-2">
            <p className="text-sm text-muted-foreground mb-1">Total Bins</p>
            <p className="text-3xl font-bold">{bins.length}</p>
          </Card>
          <Card className="p-6 border-2">
            <p className="text-sm text-muted-foreground mb-1">Normal Status</p>
            <p className="text-3xl font-bold text-success">{bins.filter((b) => b.currentFillLevel < 50).length}</p>
          </Card>
          <Card className="p-6 border-2">
            <p className="text-sm text-muted-foreground mb-1">Half Full</p>
            <p className="text-3xl font-bold text-warning">
              {bins.filter((b) => b.currentFillLevel >= 50 && b.currentFillLevel < 80).length}
            </p>
          </Card>
          <Card className="p-6 border-2">
            <p className="text-sm text-muted-foreground mb-1">Overflow</p>
            <p className="text-3xl font-bold text-danger">{bins.filter((b) => b.currentFillLevel >= 80).length}</p>
          </Card>
        </div>

        {/* Bins Table */}
        <Card className="border-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b-2 border-border">
                <tr>
                  <th className="text-left p-4 font-semibold">Bin ID</th>
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Area</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Fill Level</th>
                  <th className="text-left p-4 font-semibold">Sensors</th>
                  <th className="text-left p-4 font-semibold">Last Update</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBins.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No bins found
                    </td>
                  </tr>
                ) : (
                  filteredBins.map((bin) => (
                    <tr key={bin.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-semibold">{bin.binId}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{bin.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{bin.area}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            getStatusText(bin.currentFillLevel) === "normal"
                              ? "default"
                              : getStatusText(bin.currentFillLevel) === "half"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {getStatusText(bin.currentFillLevel)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-${getStatusColor(bin.currentFillLevel)}`}
                                style={{ width: `${bin.currentFillLevel}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{bin.currentFillLevel}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1 text-xs">
                            <Thermometer className="w-4 h-4 text-muted-foreground" />
                            <span>{bin.temperature}°C</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Weight className="w-4 h-4 text-muted-foreground" />
                            <span>{bin.weight}kg</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Battery className={`w-4 h-4 text-${bin.batteryLevel < 50 ? "danger" : "success"}`} />
                            <span>{bin.batteryLevel}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Signal className={`w-4 h-4 text-${getSignalColor(bin.signalStrength)}`} />
                            <span className="capitalize">{bin.signalStrength}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(bin.lastUpdate).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-primary">
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
