"use client";

import { ReactNode } from "react";

interface AvatarProps {
  name: string;
  src?: string;
  /** Hex color for the fallback background */
  color?: string;
  size?: "sm" | "md" | "lg";
  /** Whether to show the speaking glow ring */
  speaking?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-14 h-14 text-base",
};

export const Avatar = ({
  name,
  src,
  color = "#5e2c91",
  size = "md",
  speaking = false,
  className = "",
}: AvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {/* Glow ring for speaking state */}
      {speaking && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: "0 0 20px 4px rgba(186, 158, 255, 0.5)",
          }}
        />
      )}
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white select-none ${speaking ? "ring-2 ring-primary" : ""}`}
        style={{ backgroundColor: src ? "transparent" : color }}
      >
        {src ? (
          <img
            alt={name}
            className="w-full h-full rounded-full object-cover"
            src={src}
          />
        ) : (
          initials
        )}
      </div>
    </div>
  );
};
