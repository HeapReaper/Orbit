import Sidebar from "@/app/dashboard/components/Sidebar";
import Header from "@/app/dashboard/components/Header";
import { NotificationProvider } from "@/app/context/NotificationContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Provider from "@/app/providers/SessionProvider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login`);
  }

  return (
    <Provider>
      <NotificationProvider>
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col">
            <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </Provider>
  );
}
