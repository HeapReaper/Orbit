import { Bot } from "lucide-react";

export default function BotInfo() {
  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Bot info</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Status: </span> Online
        </p>
        <p>
          <span className="font-semibold text-white">Uptime: </span> 12h 3m
        </p>
        <p>
          <span className="font-semibold text-white">Ping: </span> 69ms
        </p>
        <p>
          <span className="font-semibold text-white">Guilds: </span> 4
        </p>
        <p>
          <span className="font-semibold text-white">Users: </span> 30
        </p>
        <p>
          <span className="font-semibold text-white">Version:</span> v1.6.9
        </p>
      </div>
    </section>
  );
}
