import { Gem } from "lucide-react";

export default function PremiumLabel() {
  return (
    <div className="mt-2">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-semibold text-white bg-red-600 rounded-full">
        <Gem />
        Premium
    </span>
    </div>
);
}