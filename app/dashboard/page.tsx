import ServerInfo from "@/app/dashboard/components/sections/ServerInfo";
import ModuleSection from "./components/sections/ModuleSection";
import UserInfo from "./components/sections/UserInfo";
import BotInfo from "@/app/dashboard/components/sections/BotInfo";
import HelpArticles from "@/app/dashboard/components/sections/Help";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <UserInfo />

      <BotInfo />

      <HelpArticles />

      <ModuleSection />
    </div>
  );
}
