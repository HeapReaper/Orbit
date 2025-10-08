"use client";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
      />
    </div>
  );
}
