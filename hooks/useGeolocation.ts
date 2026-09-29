"use client";

import { useState, useCallback, useEffect } from "react";
import { GPSCoordinates } from "@/services/attendance.service";

export type GeolocationStatus =
  | "idle"
  | "prompt"
  | "getting"
  | "available"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported";

export interface GeolocationState {
  coords: GPSCoordinates | null;
  status: GeolocationStatus;
  errorMessage: string | null;
  isSupported: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() => {
    const isSupported = typeof window !== "undefined" && Boolean(navigator.geolocation);
    return {
      coords: null,
      status: isSupported ? "idle" : "unsupported",
      errorMessage: isSupported ? null : "Geolocation is not supported by your browser.",
      isSupported,
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  // Check initial permission status if available
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === "denied") {
            setState((prev) => ({
              ...prev,
              status: "denied",
              errorMessage:
                "Location permission has been denied. Please allow location access in your browser settings.",
            }));
          } else if (permissionStatus.state === "prompt") {
            setState((prev) => ({ ...prev, status: "prompt" }));
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === "denied") {
              setState((prev) => ({
                ...prev,
                status: "denied",
                errorMessage: "Location permission has been denied.",
              }));
            }
          };
        })
        .catch(() => {
          // Permissions API query not supported on all browsers, fallback to default
        });
    }
  }, []);

  const requestPosition = useCallback((): Promise<GPSCoordinates> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        const msg = "Geolocation is not supported by this browser.";
        setState((prev) => ({ ...prev, status: "unsupported", errorMessage: msg }));
        return reject(new Error(msg));
      }

      setIsLoading(true);
      setState((prev) => ({ ...prev, status: "getting", errorMessage: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GPSCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setState({
            coords,
            status: "available",
            errorMessage: null,
            isSupported: true,
          });
          setIsLoading(false);
          resolve(coords);
        },
        (error) => {
          let errorStatus: GeolocationStatus = "unavailable";
          let message = "Unable to determine your GPS location.";

          if (error.code === error.PERMISSION_DENIED) {
            errorStatus = "denied";
            message =
              "Location permission was denied. Please enable location access in your browser permissions and try again.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorStatus = "unavailable";
            message =
              "GPS position unavailable. Please ensure your device location services are enabled.";
          } else if (error.code === error.TIMEOUT) {
            errorStatus = "timeout";
            message =
              "Location request timed out. Please check your signal and try again.";
          }

          setState({
            coords: null,
            status: errorStatus,
            errorMessage: message,
            isSupported: true,
          });
          setIsLoading(false);
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    ...state,
    isLoading,
    requestPosition,
  };
}
