import Image from "next/image";
import {JSX} from "react";

interface MessagePreviewProps {
  username: string;
  message: string;
}


export default function MessagePreview( { username, message }: MessagePreviewProps ) {
  return (
    <section className="px-6 md:px-20 py-16 bg-[#101218]">
        <div className="bg-[#2b2d31] p-6 rounded-lg shadow-md border border-[#202225]  max-w-2xl">
          <div className="flex items-start gap-3">
            <Image
              src="/logo.png"
              alt="Bot avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{username}</span>
                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">BOT</span>
                <span className="text-xs text-gray-400">Today at 15:42</span>
              </div>
              <p className="text-gray-200 mt-1">
                {message}
              </p>
            </div>
          </div>
        </div>
    </section>
  );
}