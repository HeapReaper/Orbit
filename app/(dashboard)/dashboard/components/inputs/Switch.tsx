"use client";

import { Switch } from "@heroui/react";

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
  return (
    <Switch
      checked={initialEnabled}
      // @ts-ignore
      onCheckedChange={(val) => onChange?.(val)}
      className={className}
    />
  );
}
