import ServerInfo from "@/app/dashboard/components/sections/ServerInfo";
import BotSettings from "@/app/dashboard/components/sections/BotSettings";
import ModuleSection from "./components/sections/ModuleSection";
import UserInfo from "./components/sections/UserInfo";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <UserInfo />

      <ServerInfo />
      
      <BotSettings />

      <ModuleSection />
    </div>
  );
}
