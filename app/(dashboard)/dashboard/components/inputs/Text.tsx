"use client";

import { Input } from "@heroui/react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="mb-4">
      <Input
        label={label}
        value={value}
        // @ts-ignore
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        className="w-full max-w-xs"
      />
    </div>
  );
}
