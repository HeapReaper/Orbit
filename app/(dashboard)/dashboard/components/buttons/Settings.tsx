import { Settings } from "lucide-react";

export default function SettingsButton() {
  return (
    <button
      type="button"
      className="text-[var(--primary-color)] hover:text-[var(--hover-color)] transition-colors duration-200"
      aria-label="Settings"
    >
      <Settings className="w-6 h-6" />
    </button>
  );
}
