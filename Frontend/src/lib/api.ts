const API_BASE_URL = import.meta.env.VITE_API_URL;

const STORAGE_KEYS = {
  ACCESS_TOKEN: "hd_access_token",
  REFRESH_TOKEN: "hd_refresh_token",
  USER: "hd_user",
} as const;

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private saveTokensToStorage(accessToken?: string, refreshToken?: string) {
    if (accessToken) {
      this.accessToken = accessToken;
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  private clearTokensFromStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };
    if (this.accessToken && !endpoint.includes("/auth/")) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.accessToken}`,
      };
    }
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (response.status === 401 && data.message === "Token expired") {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${this.accessToken}`,
          };
          const retryResponse = await fetch(url, config);
          return await retryResponse.json();
        } else {
          this.clearTokensFromStorage();
          window.location.href = "/auth";
          throw new Error("Session expired. Please login again.");
        }
      }
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.accessToken) {
        this.saveTokensToStorage(data.accessToken);
        return true;
      }
    } catch (error) {}
    return false;
  }

  async signup(userData: { name: string; email: string; dateOfBirth: string }) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async verifySignup(userData: {
    name: string;
    email: string;
    dateOfBirth: string;
    otp: string;
  }) {
    const response = await this.request("/auth/verify-signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (response.success && response.accessToken) {
      this.saveTokensToStorage(response.accessToken, response.refreshToken);
      if (response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      }
    }
    return response;
  }

  async requestSigninOTP(email: string) {
    return this.request("/auth/request-signin-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async signin(credentials: {
    email: string;
    otp: string;
    keepLoggedIn?: boolean;
  }) {
    const response = await this.request("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (response.success && response.accessToken) {
      this.saveTokensToStorage(response.accessToken, response.refreshToken);
      if (response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      }
    }
    return response;
  }

  async logout() {
    try {
      if (this.refreshToken) {
        await this.request("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      }
    } catch (error) {
    } finally {
      this.clearTokensFromStorage();
    }
  }

  async getUserProfile() {
    return this.request("/user/profile");
  }

  async updateUserProfile(userData: { name?: string; dateOfBirth?: string }) {
    return this.request("/user/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async getNotes(page = 1, limit = 50) {
    return this.request(`/notes?page=${page}&limit=${limit}`);
  }

  async createNote(text: string) {
    return this.request("/notes", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  async updateNote(id: string, text: string) {
    return this.request(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ text }),
    });
  }

  async deleteNote(id: string) {
    return this.request(`/notes/${id}`, {
      method: "DELETE",
    });
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
