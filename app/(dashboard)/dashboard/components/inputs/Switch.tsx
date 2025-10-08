"use client";

import { useState } from "react";

interface ToggleSwitchProps {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
  className?: string;
}

export default function ToggleSwitch({
  enabled: initialEnabled = false,
  onChange,
  className = "",
}: ToggleSwitchProps) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-[var(--primary-color)]" : "bg-gray-700"
      } ${className}`}
      aria-pressed={enabled}
      aria-label="Toggle switch"
    >
      <span
        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
