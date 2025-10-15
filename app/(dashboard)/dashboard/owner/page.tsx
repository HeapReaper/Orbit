"use client";

import MarkdownEditor from "@/app/(dashboard)/dashboard/components/MarkdownEditor";
import {useState} from "react";
import {useSession} from "next-auth/react";
import InfoTooltip from "@/app/(dashboard)/dashboard/components/ui/InfoToolTip";
import MessagePreview from "@/app/(dashboard)/dashboard/components/previews/Message";
import SaveButton from "@/app/(dashboard)/dashboard/components/buttons/Save";

export default function Page() {
  const [updateMessage, setUpdateMessage] = useState<string>("");
  const session = useSession();

  if (!session) return;

  if (session.data?.user.id !== "632677231113666601") return;

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Bump Reminder Settings
        <InfoTooltip text="Work in progress" />
      </h1>

      <div className="mb-6">
        <label className="block text-gray-400 mb-2">Send update message</label>
        <div className="rounded-lg border border-gray-700 bg-[#1f2330]">
          <MarkdownEditor
            value={updateMessage}
            onChange={setUpdateMessage}
            placeholder=""
          />
        </div>
      </div>

      <MessagePreview username="Orbit" message={updateMessage} />

    </section>
  );
}