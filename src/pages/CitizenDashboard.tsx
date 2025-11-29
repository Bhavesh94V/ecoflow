"use client"

import type React from "react"

import { PublicNav } from "@/components/PublicNav"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Gift,
  FileText,
  Recycle,
  Leaf,
  Award,
  Loader2,
  Plus,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  binsApi,
  pickupApi,
  complaintsApi,
  dashboardApi,
  type Bin,
  type PickupRequest,
  type Complaint,
} from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CitizenDashboard() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [nearbyBins, setNearbyBins] = useState<Bin[]>([])
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [stats, setStats] = useState({
    rewardPoints: 0,
    pickupsCompleted: 0,
    recyclingRate: 0,
    activeComplaints: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRequestingPickup, setIsRequestingPickup] = useState(false)
  const [isFilingComplaint, setIsFilingComplaint] = useState(false)
  const [pickupDialogOpen, setPickupDialogOpen] = useState(false)
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false)

  // Pickup form state
  const [pickupForm, setPickupForm] = useState({
    address: "",
    wasteType: "general",
    notes: "",
    scheduledDate: "",
  })

  // Complaint form state
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    description: "",
    location: "",
    area: "",
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/citizen-login")
    }
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return

      setIsLoading(true)
      try {
        // Fetch nearby bins
        const binsResponse = await binsApi.getAll({ limit: 5 })
        if (binsResponse.success) {
          const binsData = Array.isArray(binsResponse.data) ? binsResponse.data : []
          setNearbyBins(binsData)
        } else {
          setNearbyBins([])
        }

        // Fetch my pickup requests
        try {
          const pickupsResponse = await pickupApi.getMy()
          if (pickupsResponse?.success && Array.isArray(pickupsResponse.data)) {
            setPickupRequests(pickupsResponse.data)
          } else {
            setPickupRequests([])
          }
        } catch (error) {
          console.error("Pickups fetch error:", error)
          setPickupRequests([])
        }

        // Fetch my complaints
        try {
          const complaintsResponse = await complaintsApi.getMyCitizen()
          if (complaintsResponse?.success && Array.isArray(complaintsResponse.data)) {
            setComplaints(complaintsResponse.data)
          } else {
            setComplaints([])
          }
        } catch (error) {
          console.error("Complaints fetch error:", error)
          setComplaints([])
        }

        // Fetch citizen stats
        const statsResponse = await dashboardApi.getCitizenStats()
        if (statsResponse?.success && statsResponse.data) {
          setStats(statsResponse.data)
        } else {
          setStats({
            rewardPoints: 0,
            pickupsCompleted: 0,
            recyclingRate: 0,
            activeComplaints: 0,
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please refresh.",
          variant: "destructive",
        })
        setNearbyBins([])
        setPickupRequests([])
        setComplaints([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, toast])

  const handleRequestPickup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRequestingPickup(true)

    try {
      const response = await pickupApi.create({
        address: pickupForm.address,
        wasteType: pickupForm.wasteType,
        notes: pickupForm.notes,
        scheduledDate: pickupForm.scheduledDate,
      })

      if (response.success) {
        toast({
          title: "Pickup Requested",
          description: "Your waste pickup request has been submitted successfully.",
        })
        setPickupRequests((prev) => [response.data, ...prev])
        setPickupDialogOpen(false)
        setPickupForm({ address: "", wasteType: "general", notes: "", scheduledDate: "" })
      }
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Could not submit pickup request.",
        variant: "destructive",
      })
    } finally {
      setIsRequestingPickup(false)
    }
  }

  const handleFileComplaint = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFilingComplaint(true)

    try {
      const response = await complaintsApi.create({
        title: complaintForm.title,
        description: complaintForm.description,
        location: complaintForm.location,
        area: complaintForm.area,
      })

      if (response.success) {
        toast({
          title: "Complaint Filed",
          description: "Your complaint has been submitted successfully.",
        })
        setComplaints((prev) => [response.data, ...prev])
        setComplaintDialogOpen(false)
        setComplaintForm({ title: "", description: "", location: "", area: "" })
      }
    } catch (error: any) {
      toast({
        title: "Filing Failed",
        description: error.message || "Could not submit complaint.",
        variant: "destructive",
      })
    } finally {
      setIsFilingComplaint(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success" />
      case "on-the-way":
      case "assigned":
        return <Clock className="w-5 h-5 text-info" />
      case "in-progress":
        return <TrendingUp className="w-5 h-5 text-warning" />
      case "cancelled":
      case "rejected":
        return <XCircle className="w-5 h-5 text-danger" />
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getBinStatusColor = (fillLevel: number) => {
    if (fillLevel >= 80) return "danger"
    if (fillLevel >= 50) return "warning"
    return "success"
  }

  const segregationGuide = [
    { type: "Biodegradable", items: "Food waste, Garden waste, Paper", color: "success", icon: Leaf },
    { type: "Recyclable", items: "Plastic, Glass, Metal, Cardboard", color: "info", icon: Recycle },
    { type: "Hazardous", items: "Batteries, Electronics, Chemicals", color: "danger", icon: AlertCircle },
    { type: "Non-Recyclable", items: "Mixed waste, Styrofoam, Diapers", color: "muted", icon: Trash2 },
  ]

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name || "Citizen"}!</h1>
            <p className="text-muted-foreground">Manage your waste, track pickups, and earn rewards</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rewardPoints}</p>
                  <p className="text-sm text-muted-foreground">Reward Points</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pickupsCompleted}</p>
                  <p className="text-sm text-muted-foreground">Pickups Done</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.recyclingRate}%</p>
                  <p className="text-sm text-muted-foreground">Recycling Rate</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-2 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeComplaints}</p>
                  <p className="text-sm text-muted-foreground">Active Complaints</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Nearby Bins */}
              <Card className="p-6 border-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Nearby Smart Bins</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate("/bin-map")}>
                    View Map
                  </Button>
                </div>
                <div className="space-y-4">
                  {nearbyBins.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No bins found nearby</p>
                  ) : (
                    nearbyBins.map((bin) => (
                      <div
                        key={bin.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-${getBinStatusColor(bin.currentFillLevel)}/10 flex items-center justify-center`}
                        >
                          <Trash2 className={`w-6 h-6 text-${getBinStatusColor(bin.currentFillLevel)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{bin.location}</h3>
                            <Badge
                              variant={
                                bin.currentFillLevel >= 80
                                  ? "destructive"
                                  : bin.currentFillLevel >= 50
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {bin.currentFillLevel}% Full
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{bin.area}</span>
                          </div>
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${getBinStatusColor(bin.currentFillLevel)}`}
                            style={{ width: `${bin.currentFillLevel}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Pickup Requests */}
              <Card className="p-6 border-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Pickup Status</h2>
                  <Dialog open={pickupDialogOpen} onOpenChange={setPickupDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="hero" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Request Pickup
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Waste Pickup</DialogTitle>
                        <DialogDescription>Schedule a waste collection from your location</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleRequestPickup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pickup-address">Pickup Address</Label>
                          <Input
                            id="pickup-address"
                            placeholder="Enter your address"
                            value={pickupForm.address}
                            onChange={(e) => setPickupForm((prev) => ({ ...prev, address: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="waste-type">Waste Type</Label>
                          <select
                            id="waste-type"
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            value={pickupForm.wasteType}
                            onChange={(e) => setPickupForm((prev) => ({ ...prev, wasteType: e.target.value }))}
                          >
                            <option value="general">General Waste</option>
                            <option value="recyclable">Recyclable</option>
                            <option value="biodegradable">Biodegradable</option>
                            <option value="hazardous">Hazardous</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scheduled-date">Preferred Date</Label>
                          <Input
                            id="scheduled-date"
                            type="date"
                            value={pickupForm.scheduledDate}
                            onChange={(e) => setPickupForm((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pickup-notes">Notes (Optional)</Label>
                          <Textarea
                            id="pickup-notes"
                            placeholder="Any special instructions..."
                            value={pickupForm.notes}
                            onChange={(e) => setPickupForm((prev) => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                        <Button type="submit" variant="hero" className="w-full" disabled={isRequestingPickup}>
                          {isRequestingPickup ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Request"
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-4">
                  {pickupRequests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No pickup requests yet</p>
                  ) : (
                    pickupRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        {getStatusIcon(request.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold capitalize">{request.status.replace("-", " ")}</h3>
                            <span className="text-sm text-muted-foreground">
                              • {new Date(request.scheduledDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {request.wasteType} waste • {request.address}
                          </p>
                        </div>
                        <Badge variant="outline">{request.wasteType}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Complaints */}
              <Card className="p-6 border-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">My Complaints</h2>
                  <Dialog open={complaintDialogOpen} onOpenChange={setComplaintDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        File New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>File a Complaint</DialogTitle>
                        <DialogDescription>Report an issue with waste management services</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleFileComplaint} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="complaint-title">Title</Label>
                          <Input
                            id="complaint-title"
                            placeholder="Brief description of the issue"
                            value={complaintForm.title}
                            onChange={(e) => setComplaintForm((prev) => ({ ...prev, title: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complaint-description">Description</Label>
                          <Textarea
                            id="complaint-description"
                            placeholder="Detailed description of the issue..."
                            value={complaintForm.description}
                            onChange={(e) => setComplaintForm((prev) => ({ ...prev, description: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complaint-location">Location</Label>
                          <Input
                            id="complaint-location"
                            placeholder="Where is the issue?"
                            value={complaintForm.location}
                            onChange={(e) => setComplaintForm((prev) => ({ ...prev, location: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complaint-area">Area/Zone</Label>
                          <Input
                            id="complaint-area"
                            placeholder="e.g., North Zone"
                            value={complaintForm.area}
                            onChange={(e) => setComplaintForm((prev) => ({ ...prev, area: e.target.value }))}
                            required
                          />
                        </div>
                        <Button type="submit" variant="hero" className="w-full" disabled={isFilingComplaint}>
                          {isFilingComplaint ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Complaint"
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-4">
                  {complaints.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No complaints filed</p>
                  ) : (
                    complaints.slice(0, 3).map((complaint) => (
                      <div key={complaint.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <AlertCircle
                          className={`w-5 h-5 ${complaint.status === "resolved" ? "text-success" : "text-warning"}`}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{complaint.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={complaint.status === "resolved" ? "default" : "secondary"}>
                          {complaint.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Rewards Card */}
              <Card className="p-6 border-2 bg-gradient-primary text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Rewards</h3>
                </div>
                <p className="text-3xl font-bold mb-2">{stats.rewardPoints} Points</p>
                <p className="text-white/80 mb-4 text-sm">
                  Keep recycling to earn more rewards and unlock exclusive benefits!
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90">Redeem Rewards</Button>
              </Card>

              {/* Segregation Guide */}
              <Card className="p-6 border-2">
                <h3 className="text-lg font-bold mb-4">Waste Segregation Guide</h3>
                <div className="space-y-3">
                  {segregationGuide.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg bg-${item.color}/10 border border-${item.color}/20`}>
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className={`w-5 h-5 text-${item.color}`} />
                        <h4 className="font-semibold">{item.type}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.items}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
