import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * API configuration placeholder
 * When the backend is ready, base URL and endpoint configurations can be set here.
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  endpoints: {
    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      me: "/auth/me",
    },
    attendance: {
      checkIn: "/attendance/check-in",
      checkOut: "/attendance/check-out",
      history: "/attendance/history",
      summary: "/attendance/summary",
    },
    users: {
      profile: "/users/profile",
    },
  },
};
