"use client";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  if (!session || !session.user) return;

  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">User Info</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Username:</span> {session.user.name}
        </p>
        <p>
          <span className="font-semibold text-white">Servers joined:</span> 3
        </p>
        <p>
          <span className="font-semibold text-white">Account age:</span> 6 years
        </p>
      </div>
    </section>
  );
}
