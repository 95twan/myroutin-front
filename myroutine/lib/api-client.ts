const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface ApiError {
  status: number
  message: string
}

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  clearAccessToken() {
    this.accessToken = null
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options?: {
      body?: any
      params?: Record<string, any>
    }
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    // Add query parameters
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Add authorization header
    let token = this.accessToken
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("accessToken")
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || "An error occurred",
      } as ApiError
    }

    return data as T
  }

  async get<T>(
    endpoint: string,
    options?: { params?: Record<string, any> }
  ): Promise<T> {
    return this.request<T>("GET", endpoint, options)
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: { params?: Record<string, any> }
  ): Promise<T> {
    return this.request<T>("POST", endpoint, { body, ...options })
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: { params?: Record<string, any> }
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, { body, ...options })
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: { params?: Record<string, any> }
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, { body, ...options })
  }

  async delete<T>(
    endpoint: string,
    options?: { params?: Record<string, any> }
  ): Promise<T> {
    return this.request<T>("DELETE", endpoint, options)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Auth API
export const authApi = {
  oauthLogin: (provider: string, providerCode: string) =>
    apiClient.post<{
      id: string
      memberName: string
      memberStatus: string
      loginStatus: string
      temporaryToken?: string
      accessToken?: string
      refreshToken?: string
    }>("/member-service/api/v1/auth/oauth/login", {
      provider,
      providerCode,
    }),
  oauthRegister: (data: {
    temporaryToken: string
    email: string
    name: string
    phoneNumber: string
    address: string
  }) =>
    apiClient.post<{
      accessToken: string
      refreshToken: string
      memberId: string
    }>("/member-service/api/v1/auth/oauth/register", data),
  sendEmailVerification: (email: string, temporaryToken?: string) =>
    apiClient.post<void>("/member-service/api/v1/auth/email/send", {
      email,
      ...(temporaryToken && { temporaryToken }),
    }),
  verifyEmail: (email: string, verificationCode: string) =>
    apiClient.post<void>("/member-service/api/v1/auth/email/verify", {
      email,
      verificationCode,
    }),
  logout: () => apiClient.post<void>("/member-service/api/v1/auth/logout"),
}

// Member API
export const memberApi = {
  getMe: () => apiClient.get("/member-service/api/v1/members/me"),
  updateMe: (data: any) =>
    apiClient.put("/member-service/api/v1/members/me", data),
  deleteMe: () => apiClient.delete("/member-service/api/v1/members/me"),
}

// Product API
export const productApi = {
  searchProducts: (params: {
    keyword?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
    page?: number
    size?: number
  }) => apiClient.get("/catalog-service/api/v1/search/products", { params }),
  getProductDetail: (id: string) =>
    apiClient.get(`/catalog-service/api/v1/products/${id}`),
  createProduct: (data: any) =>
    apiClient.post("/catalog-service/api/v1/products", data),
}

// Cart API
export const cartApi = {
  getCart: (memberId: string) =>
    apiClient.get("/catalog-service/api/v1/carts", {
      params: { memberId },
    }),
  addToCart: (data: {
    memberId: string
    productId: string
    quantity: number
  }) => apiClient.post("/catalog-service/api/v1/carts", data),
  updateCartItem: (cartItemId: string, quantity: number) =>
    apiClient.patch(`/catalog-service/api/v1/carts/${cartItemId}`, {
      quantity,
    }),
  removeCartItem: (cartItemId: string) =>
    apiClient.delete(`/catalog-service/api/v1/carts/${cartItemId}`),
  clearCart: (memberId: string) =>
    apiClient.delete("/catalog-service/api/v1/carts", {
      params: { memberId },
    }),
}

// Subscription API
export const subscriptionApi = {
  getSubscriptions: (memberId: string, page = 0) =>
    apiClient.get("/subscription-service/api/v1/subscriptions", {
      params: { memberId, page },
    }),
  createSubscription: (data: any) =>
    apiClient.post("/subscription-service/api/v1/subscriptions", data),
  pauseSubscription: (id: string) =>
    apiClient.patch(`/subscription-service/api/v1/subscriptions/${id}/pause`),
  resumeSubscription: (id: string) =>
    apiClient.put(`/subscription-service/api/v1/subscriptions/${id}/resume`),
  cancelSubscription: (id: string) =>
    apiClient.delete(`/subscription-service/api/v1/subscriptions/${id}`),
}

// Shop API
export const shopApi = {
  getMyShops: () => apiClient.get("/shop-service/api/v1/shops"),
  createShop: (data: any) => apiClient.post("/shop-service/api/v1/shops", data),
}

// Wallet API
export const walletApi = {
  getWallet: (memberId: string) =>
    apiClient.get(`/billing-service/api/v1/wallets/${memberId}`),
  createWallet: (memberId: string) =>
    apiClient.post(`/billing-service/api/v1/wallets/${memberId}`),
  chargeWallet: (
    memberId: string,
    data: {
      paymentKey: string
      amount: number
    }
  ) =>
    apiClient.put(`/billing-service/api/v1/wallets/${memberId}/charge`, data),
  getDeposits: (memberId: string) =>
    apiClient.get(`/billing-service/api/v1/wallets/${memberId}/deposits`),
  getWithdraws: (memberId: string) =>
    apiClient.get(`/billing-service/api/v1/wallets/${memberId}/withdraws`),
}
