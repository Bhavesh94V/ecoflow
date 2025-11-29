// API Configuration and Service for EcoSmart Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Types
export interface User {
  id: string | number
  name: string
  email: string
  phone?: string
  address?: string
  role: "citizen" | "admin"
  reward_points?: number
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: User
  }
}

export interface Bin {
  id: string
  binId: string
  location: string
  area: string
  latitude: number
  longitude: number
  capacity: number
  currentFillLevel: number
  temperature: number
  humidity: number
  weight: number
  batteryLevel: number
  signalStrength: string
  status: string
  lastUpdate: string
  createdAt: string
}

export interface Collector {
  id: string
  collectorId: string
  name: string
  email: string
  phone: string
  vehicleId: string
  area: string
  status: string
  shiftsCompleted: number
  rating: number
  currentRouteId?: string
  createdAt: string
}

export interface Complaint {
  id: string
  title: string
  description: string
  citizenId: string
  citizenName?: string
  location: string
  area: string
  status: string
  priority: string
  assignedTo?: string
  assignedCollectorName?: string
  resolutionNotes?: string
  createdAt: string
  updatedAt: string
}

export interface Route {
  id: string
  routeId: string
  name: string
  collectorId?: string
  collectorName?: string
  vehicleId?: string
  bins: string[]
  binCount: number
  totalDistance: number
  estimatedDuration: number
  efficiency: number
  fuelSaved: number
  status: string
  scheduledDate: string
  createdAt: string
}

export interface PickupRequest {
  id: string
  citizenId: string
  address: string
  wasteType: string
  notes?: string
  scheduledDate: string
  status: string
  assignedCollectorId?: string
  collectorName?: string
  createdAt: string
}

export interface Alert {
  id: string
  binId: string
  binLocation?: string
  type: string
  message: string
  severity: string
  isRead: boolean
  createdAt: string
}

export interface DashboardStats {
  totalBins: number
  totalCollectors: number
  totalComplaints: number
  pendingComplaints: number
  todayCollection: number
  activeCollectors: number
  pendingAlerts: number
  wasteCollectionData: { day: string; waste: number; predicted: number }[]
  areaWiseData: { area: string; waste: number }[]
  wasteTypeData: { name: string; value: number; color: string }[]
}

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem("ecosmart_token")
}

const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || `HTTP ${response.status}`)
      ;(error as any).status = response.status
      ;(error as any).data = data
      throw error
    }

    return data
  } catch (error: any) {
    console.error("[v0] API Error:", error)
    throw error
  }
}

// Auth API
export const authApi = {
  register: async (userData: {
    name: string
    email: string
    password: string
    phone: string
    address: string
  }): Promise<AuthResponse> => {
    return apiRequest("/auth/citizen/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  citizenLogin: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest("/auth/citizen/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  adminLogin: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  // Get Current User
  getMe: async (): Promise<{ success: boolean; data: User }> => {
    return apiRequest("/auth/me")
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem("ecosmart_token")
    localStorage.removeItem("ecosmart_user")
  },
}

// Bins API
export const binsApi = {
  getAll: async (params?: {
    area?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: Bin[]; pagination: any }> => {
    const queryParams = new URLSearchParams()
    if (params?.area) queryParams.append("area", params.area)
    if (params?.status) queryParams.append("status", params.status)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    return apiRequest(`/bins?${queryParams.toString()}`)
  },

  getById: async (id: string): Promise<{ success: boolean; data: Bin }> => {
    return apiRequest(`/bins/${id}`)
  },

  create: async (binData: {
    binId: string
    location: string
    area: string
    latitude: number
    longitude: number
    capacity: number
  }): Promise<{ success: boolean; data: Bin }> => {
    return apiRequest("/bins", {
      method: "POST",
      body: JSON.stringify(binData),
    })
  },

  update: async (id: string, binData: Partial<Bin>): Promise<{ success: boolean; data: Bin }> => {
    return apiRequest(`/bins/${id}`, {
      method: "PUT",
      body: JSON.stringify(binData),
    })
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/bins/${id}`, {
      method: "DELETE",
    })
  },

  updateSensorData: async (
    binId: string,
    sensorData: {
      fillLevel?: number
      temperature?: number
      humidity?: number
      weight?: number
      batteryLevel?: number
      gasLevel?: number
    },
  ): Promise<{ success: boolean; data: Bin }> => {
    return apiRequest(`/bins/${binId}/sensor`, {
      method: "POST",
      body: JSON.stringify(sensorData),
    })
  },

  getNearby: async (lat: number, lng: number, radius?: number): Promise<{ success: boolean; data: Bin[] }> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      ...(radius && { radius: radius.toString() }),
    })
    return apiRequest(`/bins/nearby?${params.toString()}`)
  },
}

// Collectors API
export const collectorsApi = {
  getAll: async (params?: {
    area?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: Collector[]; pagination: any }> => {
    const queryParams = new URLSearchParams()
    if (params?.area) queryParams.append("area", params.area)
    if (params?.status) queryParams.append("status", params.status)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    return apiRequest(`/collectors?${queryParams.toString()}`)
  },

  getById: async (id: string): Promise<{ success: boolean; data: Collector }> => {
    return apiRequest(`/collectors/${id}`)
  },

  create: async (collectorData: {
    name: string
    email: string
    phone: string
    vehicleId: string
    area: string
    licenseNumber: string
  }): Promise<{ success: boolean; data: Collector }> => {
    return apiRequest("/collectors", {
      method: "POST",
      body: JSON.stringify(collectorData),
    })
  },

  update: async (id: string, collectorData: Partial<Collector>): Promise<{ success: boolean; data: Collector }> => {
    return apiRequest(`/collectors/${id}`, {
      method: "PUT",
      body: JSON.stringify(collectorData),
    })
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/collectors/${id}`, {
      method: "DELETE",
    })
  },

  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: Collector }> => {
    return apiRequest(`/collectors/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },

  assignRoute: async (collectorId: string, routeId: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/collectors/${collectorId}/assign-route`, {
      method: "POST",
      body: JSON.stringify({ routeId }),
    })
  },
}

// Complaints API
export const complaintsApi = {
  getAll: async (params?: {
    status?: string
    priority?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: Complaint[]; pagination: any }> => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.priority) queryParams.append("priority", params.priority)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    return apiRequest(`/complaints?${queryParams.toString()}`)
  },

  getById: async (id: string): Promise<{ success: boolean; data: Complaint }> => {
    return apiRequest(`/complaints/${id}`)
  },

  create: async (complaintData: {
    title: string
    description: string
    location: string
    area: string
    priority?: string
  }): Promise<{ success: boolean; data: Complaint }> => {
    return apiRequest("/citizen/complaint", {
      method: "POST",
      body: JSON.stringify(complaintData),
    })
  },

  updateStatus: async (
    id: string,
    status: string,
    resolutionNotes?: string,
  ): Promise<{ success: boolean; data: Complaint }> => {
    return apiRequest(`/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, resolutionNotes }),
    })
  },

  assign: async (id: string, collectorId: string): Promise<{ success: boolean; data: Complaint }> => {
    return apiRequest(`/complaints/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ collectorId }),
    })
  },

  getMyCitizen: async (): Promise<{ success: boolean; data: Complaint[] }> => {
    return apiRequest("/citizen/complaints/my")
  },
}

// Pickup Requests API
export const pickupApi = {
  getAll: async (params?: {
    status?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: PickupRequest[]; pagination: any }> => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    return apiRequest(`/citizen/pickup-status?${queryParams.toString()}`)
  },

  create: async (pickupData: {
    address: string
    wasteType: string
    notes?: string
    scheduledDate: string
  }): Promise<{ success: boolean; data: PickupRequest }> => {
    return apiRequest("/citizen/pickup", {
      method: "POST",
      body: JSON.stringify(pickupData),
    })
  },

  getMy: async (): Promise<{ success: boolean; data: PickupRequest[] }> => {
    return apiRequest("/citizen/pickup-status")
  },

  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: PickupRequest }> => {
    return apiRequest(`/pickup/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },

  assign: async (id: string, collectorId: string): Promise<{ success: boolean; data: PickupRequest }> => {
    return apiRequest(`/pickup/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ collectorId }),
    })
  },
}

// Routes API
export const routesApi = {
  getAll: async (params?: {
    status?: string
    collectorId?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: Route[]; pagination: any }> => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append("status", params.status)
    if (params?.collectorId) queryParams.append("collectorId", params.collectorId)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    return apiRequest(`/routes?${queryParams.toString()}`)
  },

  getById: async (id: string): Promise<{ success: boolean; data: Route }> => {
    return apiRequest(`/routes/${id}`)
  },

  create: async (routeData: {
    name: string
    bins: string[]
    scheduledDate: string
  }): Promise<{ success: boolean; data: Route }> => {
    return apiRequest("/routes", {
      method: "POST",
      body: JSON.stringify(routeData),
    })
  },

  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: Route }> => {
    return apiRequest(`/routes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },

  optimize: async (
    binIds: string[],
  ): Promise<{ success: boolean; data: { optimizedRoute: string[]; distance: number; duration: number } }> => {
    return apiRequest("/routes/optimize", {
      method: "POST",
      body: JSON.stringify({ binIds }),
    })
  },
}

// Alerts API
export const alertsApi = {
  getAll: async (params?: {
    type?: string
    isRead?: boolean
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: Alert[]; pagination: any }> => {
    const queryParams = new URLSearchParams()
    if (params?.type) queryParams.append("type", params.type)
    if (params?.isRead !== undefined) queryParams.append("isRead", params.isRead.toString())
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    return apiRequest(`/admin/alerts?${queryParams.toString()}`)
  },

  markAsRead: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/alerts/${id}/read`, {
      method: "PATCH",
    })
  },

  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    return apiRequest("/alerts/read-all", {
      method: "PATCH",
    })
  },
}

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    return apiRequest("/dashboard/admin-stats")
  },

  getCitizenStats: async (): Promise<{
    success: boolean
    data: {
      rewardPoints: number
      pickupsCompleted: number
      recyclingRate: number
      activeComplaints: number
    }
  }> => {
    return apiRequest("/dashboard/citizen-stats")
  },
}

export default {
  auth: authApi,
  bins: binsApi,
  collectors: collectorsApi,
  complaints: complaintsApi,
  routes: routesApi,
  pickup: pickupApi,
  alerts: alertsApi,
  dashboard: dashboardApi,
}
