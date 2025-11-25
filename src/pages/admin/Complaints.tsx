"use client"

import { AdminSidebar } from "@/components/AdminSidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { complaintsApi, type Complaint } from "@/lib/api"

export default function AdminComplaints() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isResolving, setIsResolving] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/admin-login")
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const fetchComplaints = async () => {
    setIsLoading(true)
    try {
      const response = await complaintsApi.getAll({ limit: 100 })
      if (response.success) {
        setComplaints(response.data)
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
      toast({
        title: "Error",
        description: "Failed to load complaints data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchComplaints()
    }
  }, [isAuthenticated, user])

  const stats = [
    { label: "Total Complaints", value: complaints.length.toString(), icon: MessageSquare, color: "primary" },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status === "pending").length.toString(),
      icon: Clock,
      color: "warning",
    },
    {
      label: "In Progress",
      value: complaints.filter((c) => c.status === "in-progress").length.toString(),
      icon: AlertCircle,
      color: "info",
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "resolved").length.toString(),
      icon: CheckCircle,
      color: "success",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "in-progress":
        return "info"
      case "resolved":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "danger"
      case "medium":
        return "warning"
      case "low":
        return "success"
      default:
        return "muted"
    }
  }

  const handleResolve = async () => {
    if (!selectedComplaint) return

    setIsResolving(true)
    try {
      const response = await complaintsApi.updateStatus(selectedComplaint.id, "resolved", resolutionNotes)

      if (response.success) {
        toast({
          title: "Complaint Resolved",
          description: "The complaint has been marked as resolved.",
        })
        setComplaints((prev) => prev.map((c) => (c.id === selectedComplaint.id ? response.data : c)))
        setSelectedComplaint(null)
        setResolutionNotes("")
      }
    } catch (error: any) {
      toast({
        title: "Failed to Resolve",
        description: error.message || "Could not resolve the complaint.",
        variant: "destructive",
      })
    } finally {
      setIsResolving(false)
    }
  }

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchQuery.toLowerCase()),
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
            <h1 className="text-3xl font-bold mb-2">Complaints Management</h1>
            <p className="text-muted-foreground">Track and resolve citizen complaints</p>
          </div>
          <Button variant="outline" onClick={fetchComplaints}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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

        {/* Search and Filter */}
        <Card className="p-6 border-2 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
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

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No complaints found</Card>
          ) : (
            filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="p-6 border-2 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{complaint.title}</h3>
                      <Badge variant={getStatusColor(complaint.status) as any}>{complaint.status}</Badge>
                      <Badge
                        variant="outline"
                        className={`border-${getPriorityColor(complaint.priority)}/50 text-${getPriorityColor(complaint.priority)}`}
                      >
                        {complaint.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{complaint.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{complaint.citizenName || "Unknown Citizen"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{complaint.location}</span>
                        <Badge variant="outline" className="ml-1">
                          {complaint.area}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {complaint.assignedCollectorName && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg inline-block">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Assigned to:</span>{" "}
                          <span className="font-medium">{complaint.assignedCollectorName}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Complaint Details</DialogTitle>
                          <DialogDescription>ID: {selectedComplaint?.id}</DialogDescription>
                        </DialogHeader>
                        {selectedComplaint && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">{selectedComplaint.title}</h4>
                              <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                              <div>
                                <Label className="text-muted-foreground">Citizen</Label>
                                <p className="font-medium">{selectedComplaint.citizenName || "Unknown"}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Location</Label>
                                <p className="font-medium">{selectedComplaint.location}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Date & Time</Label>
                                <p className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Priority</Label>
                                <Badge variant="outline" className="mt-1">
                                  {selectedComplaint.priority}
                                </Badge>
                              </div>
                            </div>

                            {selectedComplaint.status !== "resolved" && selectedComplaint.status !== "rejected" && (
                              <div className="space-y-3 pt-4 border-t">
                                <Label>Resolution Notes</Label>
                                <Textarea
                                  placeholder="Add resolution notes..."
                                  rows={3}
                                  value={resolutionNotes}
                                  onChange={(e) => setResolutionNotes(e.target.value)}
                                />
                                <div className="flex gap-3">
                                  <Button
                                    variant="hero"
                                    onClick={handleResolve}
                                    className="flex-1"
                                    disabled={isResolving}
                                  >
                                    {isResolving ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Resolving...
                                      </>
                                    ) : (
                                      "Mark as Resolved"
                                    )}
                                  </Button>
                                  <Button variant="outline" className="flex-1 bg-transparent">
                                    Reassign
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {complaint.status === "pending" && (
                      <Button variant="hero" size="sm">
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
