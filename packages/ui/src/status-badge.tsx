"use client";

import { ReactNode } from "react";

interface StatusBadgeProps {
  status: "SPEAKING" | "LISTENING" | "MUTED" | "ONLINE";
}

const statusConfig = {
  SPEAKING: {
    label: "Speaking",
    dotClass: "bg-primary animate-pulse",
    textClass: "text-primary",
  },
  LISTENING: {
    label: "Listening",
    dotClass: "bg-tertiary",
    textClass: "text-tertiary",
  },
  MUTED: {
    label: "Muted",
    dotClass: "bg-outline",
    textClass: "text-outline",
  },
  ONLINE: {
    label: "Online",
    dotClass: "bg-green-400",
    textClass: "text-green-400",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span
        className={`text-[10px] font-bold uppercase tracking-wider ${config.textClass}`}
      >
        {config.label}
      </span>
    </div>
  );
};
