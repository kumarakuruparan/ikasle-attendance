/**
 * IKASLE API Client
 * Centralized fetch wrapper communicating with IKASLE Backend REST API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: unknown;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach Clerk JWT authentication if not already provided and active in browser session
  if (!headers["Authorization"] && typeof window !== "undefined") {
    try {
      const clerk = (window as unknown as { Clerk?: { session?: { getToken: () => Promise<string | null> } } }).Clerk;
      if (clerk?.session) {
        const token = await clerk.session.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch {
      // Token lookup fallback
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(`Server responded with non-JSON (${res.status} ${res.statusText})`, res.status);
  }

  if (!res.ok || json.success === false) {
    let errorMsg = json.message || `Request failed with status ${res.status}`;
    if (res.status === 401) {
      errorMsg = "Authentication required. Please sign in to continue.";
    } else if (res.status === 403) {
      errorMsg = json.message || "Access forbidden: You do not have permission to perform this action.";
    } else if (res.status === 404) {
      errorMsg = json.message || "Resource not found.";
    } else if (res.status === 409) {
      errorMsg = json.message || "A conflicting record already exists.";
    } else if (res.status === 422 || res.status === 400) {
      errorMsg = json.message || "Invalid input provided. Please verify the form fields.";
    }

    throw new ApiError(errorMsg, res.status, json.errors);
  }

  return json;
}
