import ModuleSection from "./components/sections/ModuleSection";
import BotInfo from "@/app/(dashboard)/dashboard/components/sections/BotInfo";
import HelpArticles from "@/app/(dashboard)/dashboard/components/sections/Help";
import {Input} from "@heroui/input";

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
