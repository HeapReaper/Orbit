import { MessageCircle } from "lucide-react";

export default function ServerInfo() {
  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Server info</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Guild:</span> RC Garage
        </p>
        <p>
          <span className="font-semibold text-white">Members:</span> 3
        </p>
        <p>
          <span className="font-semibold text-white">Categories:</span> 3
        </p>
        <p>
          <span className="font-semibold text-white">Text Channels:</span> 14
        </p>
        <p>
          <span className="font-semibold text-white">Voice Channels:</span> 0
        </p>
        <p>
          <span className="font-semibold text-white">Roles:</span> 2
        </p>
      </div>
    </section>
  );
}
