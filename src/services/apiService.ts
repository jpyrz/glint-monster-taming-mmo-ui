const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

class ApiService {
  private static instance: ApiService;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async register(
    email: string,
    password: string,
    customClaims = {}
  ): Promise<ApiResponse> {
    return this.makeRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, customClaims }),
    });
  }

  async validateToken(token: string): Promise<ApiResponse> {
    return this.makeRequest(
      "/api/auth/validate",
      {
        method: "GET",
      },
      token
    );
  }

  // FCM endpoints
  async registerFCMToken(
    fcmToken: string,
    authToken: string,
    metadata = {}
  ): Promise<ApiResponse> {
    return this.makeRequest(
      "/api/fcm/tokens",
      {
        method: "POST",
        body: JSON.stringify({ fcmToken, metadata }),
      },
      authToken
    );
  }

  async updateFCMToken(
    fcmToken: string,
    authToken: string,
    metadata = {}
  ): Promise<ApiResponse> {
    return this.makeRequest(
      "/api/fcm/tokens",
      {
        method: "PUT",
        body: JSON.stringify({ fcmToken, metadata }),
      },
      authToken
    );
  }

  async getUserTokens(authToken: string, userId: string): Promise<ApiResponse> {
    return this.makeRequest(
      `/api/fcm/users/${userId}/tokens`,
      {
        method: "GET",
      },
      authToken
    );
  }

  async sendNotificationToTokens(
    authToken: string,
    tokens: Array<{ token: string; userId?: string; username?: string }>,
    messageType: string,
    messageData: { title: string; body: string; data?: any }
  ): Promise<ApiResponse> {
    return this.makeRequest(
      "/api/fcm/notify",
      {
        method: "POST",
        body: JSON.stringify({
          tokens,
          messageType,
          messageData,
        }),
      },
      authToken
    );
  }

  // Convenience method to send test notification using a known FCM token
  async sendTestNotificationToToken(
    authToken: string,
    fcmToken: string,
    userId: string,
    username: string,
    title: string,
    message: string,
    data = {}
  ): Promise<ApiResponse> {
    const tokens = [
      {
        token: fcmToken,
        userId: userId,
        username: username,
      },
    ];

    return this.sendNotificationToTokens(authToken, tokens, "NOTIFICATION", {
      title,
      body: message,
      data,
    });
  }

  // User profile endpoints (if needed)
  async getUserProfile(authToken: string): Promise<ApiResponse> {
    return this.makeRequest(
      "/api/auth/profile",
      {
        method: "GET",
      },
      authToken
    );
  }

  async updateUserProfile(
    authToken: string,
    profileData: any
  ): Promise<ApiResponse> {
    return this.makeRequest(
      "/api/auth/profile",
      {
        method: "PUT",
        body: JSON.stringify(profileData),
      },
      authToken
    );
  }
}

export const apiService = ApiService.getInstance();
