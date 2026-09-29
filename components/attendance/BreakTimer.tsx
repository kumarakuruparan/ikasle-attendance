"use client";

import React, { useState, useEffect } from "react";
import { Coffee, Clock } from "lucide-react";

interface BreakTimerProps {
  startedAt: string;
}

export function BreakTimer({ startedAt }: BreakTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startTime = new Date(startedAt).getTime();
    const update = () => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diffSec);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono font-bold text-sm bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-900/50">
      <Coffee className="h-4 w-4 animate-bounce" />
      <span>{formatted}</span>
    </div>
  );
}
