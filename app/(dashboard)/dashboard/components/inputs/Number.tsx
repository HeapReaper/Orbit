"use client";

import { Input } from "@heroui/react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export default function NumberInput({ label, value, onChange, min, max, step, placeholder }: NumberInputProps) {
  return (
    <div className="mb-4">
      <Input
        type="number"
        label={label}
        // @ts-ignore
        value={value}
        onChange={(val) => onChange(Number(val))}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full max-w-xs"
      />
    </div>
  );
}
