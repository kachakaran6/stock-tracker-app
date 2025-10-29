// src/components/ClockAndStatus.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const ClockAndStatus: React.FC = () => {
  const [time, setTime] = useState("");
  const [marketStatus, setMarketStatus] = useState<"Open" | "Closed">("Closed");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Update Time
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      // --- Simple Market Status Logic (Example: Assume Indian market hours) ---
      // A simple mock check: Market is open between 9:15 AM and 3:30 PM IST (15:30)
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours >= 9 && (hours < 15 || (hours === 15 && minutes < 30))) {
        setMarketStatus("Open");
      } else {
        setMarketStatus("Closed");
      }
    };

    updateTime(); // Initial run
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId); // Cleanup
  }, []);

  const StatusIcon = marketStatus === "Open" ? CheckCircleIcon : XCircleIcon;
  const statusColor =
    marketStatus === "Open"
      ? "text-green-500 bg-green-900/20"
      : "text-red-500 bg-red-900/20";

  return (
    <div className="flex items-center space-x-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md">
      {/* Live Clock */}
      <div className="flex items-center space-x-2 text-lg sm:text-xl font-mono text-gray-800 dark:text-gray-100">
        <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
        <span className="tabular-nums">{time}</span>
      </div>

      {/* Market Status Pill */}
      <div
        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColor} transition-colors duration-300`}
      >
        <StatusIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Market: </span>
        <span>{marketStatus}</span>
      </div>
    </div>
  );
};

export default ClockAndStatus;
