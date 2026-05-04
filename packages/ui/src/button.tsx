"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "gradient";
  onClick?: () => void;
}

export const Button = ({
  children,
  className,
  variant = "primary",
  onClick,
}: ButtonProps) => {
  const baseClasses =
    "py-4 rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2";

  const variantClasses = {
    primary:
      "bg-surface-container-highest text-on-surface border border-transparent hover:bg-surface-bright",
    secondary:
      "bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container",
    gradient: "gradient-button text-on-primary shadow-primary/10",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
