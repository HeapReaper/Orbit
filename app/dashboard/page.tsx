import ServerInfo from "@/app/dashboard/components/ServerInfo";
import BotSettings from "@/app/dashboard/components/BotSettings";
import ModuleCard from "@/app/dashboard/components/cards/ModuleCard";
import modules from "@/app/dashboard/data/modules";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <ServerInfo />
      <BotSettings />

      <section>
        <h2 className="text-xl font-semibold mb-4">Modules</h2>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-white mb-6"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <ModuleCard key={m.name} {...m} />
          ))}
        </div>
      </section>
    </div>
  );
}
