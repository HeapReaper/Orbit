import Image from "next/image";

interface Props {
  username: string;
  title: string;
  description: string;
  content: string;
  color: string;
}

export default function EmbedPreview({ username, title, description, content, color }: Props) {
  return (
    <section className="px-6 md:px-20 py-16 bg-[#101218]">
      <div className="grid md:grid-cols-2 gap-10 items-center mt-16">
        <div className="order-2 md:order-1 bg-[#2b2d31] p-6 rounded-lg shadow-md border border-[#202225]">
          <div className="flex items-start gap-3">
            <Image
              src="/screenshots/orbit_avatar.png"
              alt="Orbit Bot Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="w-full">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Orbit</span>
                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">BOT</span>
                <span className="text-xs text-gray-400">Today at{" "}
                  {new Date().toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})} {/* nl-NL */}
                </span>
              </div>

              <div className="mt-3 border-l-4 bg-[#1e2124] p-4 rounded-r-lg" style={{ borderColor: color }}>
                <h4 className="text-white font-semibold text-lg mb-1">Server Announcement</h4>
                <p className="text-gray-300 text-sm">
                  Hey everyone! Don’t forget our weekly game night starts in 1 hour 🎮
                  Make sure to join the voice channel and have fun!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 space-y-4">
          <h3 className="text-2xl font-semibold">Embed Preview</h3>
          <p className="text-gray-400">
            Send beautifully formatted embed messages automatically.
            Perfect for announcements, events, or reminders — fully customizable and coming soon to Orbit!
          </p>
        </div>
      </div>
    </section>
  );
}