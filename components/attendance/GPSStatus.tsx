"use client";

import React from "react";
import {
  MapPin,
  AlertTriangle,
  RotateCw,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GeolocationStatus } from "@/hooks/useGeolocation";
import { GPSCoordinates, OfficeSettings } from "@/services/attendance.service";

interface GPSStatusProps {
  status: GeolocationStatus;
  coords: GPSCoordinates | null;
  officeSettings?: OfficeSettings;
  isLoading?: boolean;
  onRefreshLocation?: () => void;
  serverAccuracyError?: string | null;
  serverDistanceError?: string | null;
}

export function GPSStatus({
  status,
  coords,
  officeSettings,
  isLoading,
  onRefreshLocation,
  serverDistanceError,
}: GPSStatusProps) {
  const maxAllowedAccuracy = officeSettings?.maxAccuracyThresholdMeters || 150;
  const isAccuracyLow =
    coords && coords.accuracy > maxAllowedAccuracy;

  if (status === "unsupported") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
        <span>Browser does not support GPS Geolocation.</span>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <strong className="font-semibold">Location Permission Required:</strong>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
              Please grant browser location access to verify office presence.
            </p>
          </div>
        </div>
        {onRefreshLocation && (
          <button
            type="button"
            onClick={onRefreshLocation}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
          >
            <RotateCw className="h-3 w-3" />
            Enable & Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <MapPin className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">
              Office Geofence Status
            </span>
            {status === "getting" || isLoading ? (
              <Badge variant="outline" className="animate-pulse">
                Getting GPS Signal...
              </Badge>
            ) : coords ? (
              isAccuracyLow ? (
                <Badge variant="warning">Location Accuracy Low</Badge>
              ) : serverDistanceError ? (
                <Badge variant="destructive">Outside Office Boundary</Badge>
              ) : (
                <Badge variant="success">Location Verified</Badge>
              )
            ) : (
              <Badge variant="default">Ready to Verify</Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {coords
              ? `Signal accuracy: ±${Math.round(coords.accuracy)}m (Allowed limit: ${maxAllowedAccuracy}m)`
              : "GPS position will be checked upon clock-in and clock-out."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onRefreshLocation && (
          <button
            type="button"
            onClick={onRefreshLocation}
            disabled={isLoading || status === "getting"}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`h-3 w-3 ${isLoading || status === "getting" ? "animate-spin" : ""}`} />
            Refresh GPS
          </button>
        )}
      </div>
    </div>
  );
}
