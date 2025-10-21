import {Save} from "lucide-react";

interface SaveButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export default function SaveButton({ onClick, loading = false }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`
          flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary-color)] hover:bg-[var(--hover-color)]
          text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        `}
    >
      <Save size={18}  />
      Save
    </button>
  );
}
