import { API_CONFIG } from './config';

export interface ApiResponse<T = any> {
  status: number;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: number;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;

  constructor(baseURL = API_CONFIG.baseURL, timeout = API_CONFIG.timeout, retries = API_CONFIG.retries) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.retries = retries;
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        status: response.status,
        data,
        timestamp: Date.now(),
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (attempt < this.retries) {
        return this.fetchWithRetry<T>(url, options, attempt + 1);
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        status: 0,
        error: errorMessage,
        timestamp: Date.now(),
      };
    }
  }

  public async get<T>(path: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(`${this.baseURL}${path}`, { 
      method: 'GET',
      headers,
    });
  }

  public async post<T>(path: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(`${this.baseURL}${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public async put<T>(path: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(`${this.baseURL}${path}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public async delete<T>(path: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<T>(`${this.baseURL}${path}`, {
      method: 'DELETE',
      headers,
    });
  }
}

export const apiClient = new ApiClient();
