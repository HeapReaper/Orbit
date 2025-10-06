import Sidebar from "@/app/dashboard/components/Sidebar";
import { NotificationProvider } from "@/app/context/NotificationContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Provider from "@/app/providers/SessionProvider";
import { redirect } from "next/navigation";
import { GuildProvider } from "@/app/context/GuildContext";
import Script from "next/script"; // ← hier importeren

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Provider>
      <NotificationProvider>
        <GuildProvider>
          <div className="flex min-h-screen">
            {/* Plausible analytics */}
            <Script
              defer
              data-domain="orbit.heapreaper.nl"
              src="https://analytics.heapreaper.nl/js/script.outbound-links.js"
            />
            <Script id="plausible-init">
              {`
                window.plausible = window.plausible || function() { 
                  (window.plausible.q = window.plausible.q || []).push(arguments) 
                }
              `}
            </Script>

            <Sidebar />

            <div className="flex-1 flex flex-col">
              <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </GuildProvider>
      </NotificationProvider>
    </Provider>
  );
}
