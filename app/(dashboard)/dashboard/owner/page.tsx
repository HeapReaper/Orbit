"use client";

import MarkdownEditor from "@/app/(dashboard)/dashboard/components/MarkdownEditor";
import { useState } from "react";
import { useSession } from "next-auth/react";
import MessagePreview from "@/app/(dashboard)/dashboard/components/previews/Message";
import { Send } from "lucide-react";

export default function Page() {
  const [updateMessage, setUpdateMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const session = useSession();

  if (!session) return null;

  if (session.data?.user.id !== "632677231113666601") return null;

  const handleSend = async () => {
    if (!updateMessage.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updateMessage }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Message sent successfully!");
        setUpdateMessage(""); // reset editor
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-[#181b25] p-6 rounded-lg max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
        Owner page
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

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}

      <button
        onClick={handleSend}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary-color)] hover:bg-[var(--hover-color)]
          text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <Send size={16} />
        {loading ? "Sending..." : "Send"}
      </button>
    </section>
  );
}
