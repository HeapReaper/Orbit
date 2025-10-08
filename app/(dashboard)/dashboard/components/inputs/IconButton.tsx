"use client";

import { Icon as LucideIcon } from "lucide-react";
import { ComponentType, SVGProps } from "react";

interface IconButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}

export default function IconButton({
  icon: Icon,
  label,
  size = 24,
  onClick,
  className = "",
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[var(--primary-color)] hover:text-[var(--hover-color)] transition-colors duration-200 ${className}`}
      aria-label={label}
    >
      <Icon className={`w-${size} h-${size}`} />
    </button>
  );
}
