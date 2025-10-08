import { Bot } from "lucide-react";
import InlineCode from "@/app/(dashboard)/dashboard/components/ui/InlineCode";

async function getBotInfo() {
  const res = await fetch("https://lumix.heapreaper.nl/api/bot-info")
  return await res.json();
}

async function getRepoInfo() {
  const res = await fetch("https://api.github.com/repos/HeapReaper/Orbit-bot/releases/latest")

  return await res.json();
}


export default async function BotInfo() {
  const data = await getBotInfo();
  const repoInfo = await getRepoInfo();

  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Bot info</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Status: </span> <InlineCode text={data.status} />
        </p>
        <p>
          <span className="font-semibold text-white">Uptime: </span> <InlineCode text={data.uptime} />
        </p>
        <p>
          <span className="font-semibold text-white">Ping: </span> <InlineCode text={data.ping} />ms
        </p>
        <p>
          <span className="font-semibold text-white">Guilds: </span> <InlineCode text={data.guilds} />
        </p>
        <p>
          <span className="font-semibold text-white">Users: </span>  <InlineCode text={data.users} />
        </p>
        <p>
          <span className="font-semibold text-white">Version:</span> <InlineCode text={repoInfo.tag_name.replace("v", "")} />
        </p>
      </div>
    </section>
  );
}
