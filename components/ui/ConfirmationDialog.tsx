"use client";

import React from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  const icon =
    variant === "danger" ? (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-5 w-5" />
      </div>
    ) : variant === "warning" ? (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <AlertCircle className="h-5 w-5" />
      </div>
    ) : (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <Info className="h-5 w-5" />
      </div>
    );

  const confirmButtonVariant =
    variant === "danger" ? "destructive" : variant === "warning" ? "secondary" : "primary";

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {icon}
          <p className="text-xs leading-relaxed text-slate-600">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmButtonVariant}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
