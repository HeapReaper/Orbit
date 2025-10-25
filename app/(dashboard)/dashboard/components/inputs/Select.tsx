"use client";

import { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
}

export default function SelectInput({
  label,
  value,
  onChange,
  options,
}: SelectInputProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="mb-4 w-full max-w-xs ">
      <Autocomplete
        label={label}
        placeholder="Search..."
        value={query}
        onChange={(val) => {
          // @ts-ignore
          setQuery(val);
          // @ts-ignore
          onChange(val);
        }}
        className="w-full"
        // @ts-ignore
        popoverClassName="border border-gray-700 shadow-md"
      >
        {options.map((opt) => (
          <AutocompleteItem
            key={opt.value}
            // @ts-ignore
            value={opt.value}
          >
            {opt.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>

    </div>
  );
}
