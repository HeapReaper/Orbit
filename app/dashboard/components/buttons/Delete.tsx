import { Trash } from "lucide-react";

interface SaveButtonProps {
  onClick?: () => void;
}

export default function DeleteButton({ onClick }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[var(--primary-color)] hover:text-[var(--hover-color)] transition-colors duration-200"
      aria-label="Settings"
    >
      <Trash className="w-6 h-6" />
    </button>
  );
}
