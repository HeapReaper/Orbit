"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
}

export default function SelectInput({ label, value, onChange, options }: SelectInputProps) {
  return (
    <div className="mb-4 w-full max-w-xs">
      <Autocomplete
        label={label}
        placeholder="Search..."
        value={value} // selected ID
        onChange={(val) => onChange(val)}
        displayValue={(val) => options.find((opt) => opt.value === val)?.label || ""}
        className="w-full"
        popoverClassName="border border-gray-700 shadow-md"
      >
        {options.map((opt) => (
          <AutocompleteItem key={opt.value} value={opt.value}>
            {opt.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>

    </div>
  );
}
