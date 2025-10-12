import ServerInfo from "@/app/(dashboard)/dashboard/components/sections/ServerInfo";
import ModuleSection from "./components/sections/ModuleSection";
import UserInfo from "./components/sections/UserInfo";
import BotInfo from "@/app/(dashboard)/dashboard/components/sections/BotInfo";
import HelpArticles from "@/app/(dashboard)/dashboard/components/sections/Help";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <title>Dashboard</title>
      <BotInfo />

      <HelpArticles />

      <ModuleSection />
    </div>
  );
}
