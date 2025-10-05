import Sidebar from "@/app/dashboard/components/Sidebar";
import Header from "@/app/dashboard/components/Header";
import { NotificationProvider } from "@/app/context/NotificationContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">

        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </main>
      </div>
    </div>
  );
}
