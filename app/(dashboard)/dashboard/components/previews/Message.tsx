import Image from "next/image";
import Markdown from 'react-markdown'
import rehypeRaw from "rehype-raw";

interface MessagePreviewProps {
  username: string;
  message: string;
}

export default function MessagePreview( { username, message }: MessagePreviewProps ) {
  return (
    <div className="bg-[#2b2d31] p-6 rounded-lg shadow-md border border-[#202225]  max-w-2xl mt-3 mb-3">
      <div className="flex items-start gap-3">
        <Image
          src="/logo-medium-.png"
          alt="Bot avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{username}</span>
            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">BOT</span>
            <span className="text-xs text-gray-400">Today at{" "}
              {new Date().toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})} {/* nl-NL */}
            </span>
          </div>
          <p className="text-gray-200 mt-1">
            <Markdown rehypePlugins={[rehypeRaw]} >{message}</Markdown>
          </p>
        </div>
      </div>
    </div>
  );
}