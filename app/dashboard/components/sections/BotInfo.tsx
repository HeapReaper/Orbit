import { Bot } from "lucide-react";

async function getBotInfo() {
  const res = await fetch("https://lumix.heapreaper.nl/api/bot-info")
  return await res.json();
}

export default async function BotInfo() {
  const data = await getBotInfo();

  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Bot info</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Status: </span> {data.status}
        </p>
        <p>
          <span className="font-semibold text-white">Uptime: </span> {data.uptime}
        </p>
        <p>
          <span className="font-semibold text-white">Ping: </span> {data.ping}ms
        </p>
        <p>
          <span className="font-semibold text-white">Guilds: </span> {data.guilds}
        </p>
        <p>
          <span className="font-semibold text-white">Users: </span> {data.users}
        </p>
        <p>
          <span className="font-semibold text-white">Version:</span> v1.6.9 {/* TODO: add Gb version */}
        </p>
      </div>
    </section>
  );
}
