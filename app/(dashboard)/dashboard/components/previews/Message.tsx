import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MessagePreviewProps {
  username: string;
  message: string;
  channels?: Record<string, string>;
}

export default function MessagePreview({ username, message, channels = {} }: MessagePreviewProps) {
  // Function to replace <#> with channel name
  const renderMessage = (text: string) => {
    const parts = text.split(/(<#\d+>)/g);
    return parts.map((part, i) => {
      const match = part.match(/<#(\d+)>/);
      if (match) {
        const channelId = match[1];
        const channelName = `# ${channels[channelId]}` || `#unknown`;
        return (
          <span
            key={i}
            className="bg-[#35363a] text-blue-400 px-1.5 py-0.5 rounded font-semibold"
          >
            {channelName}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-[#2b2d31] p-6 rounded-lg shadow-md border border-[#202225] max-w-3xl mt-3 mb-3">
      <div className="flex items-start gap-3">
        <Image
          src="/logo-medium-.png"
          alt="Bot avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{username}</span>
            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">APP</span>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="mt-1 prose prose-invert break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // @ts-ignore
                code({ node, inline, className, children, ...props }) {
                  return inline ? (
                    <code className="bg-[#1e1f22] px-1 py-0.5 rounded text-sm font-mono text-gray-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    // @ts-ignore
                    <pre className="bg-[#1e1f22] p-2 rounded text-sm font-mono text-gray-300 overflow-x-auto" {...props}>
                      <code>{children}</code>
                    </pre>
                  );
                },
                p({ children }) {
                  // Wrap normale tekst zodat <#ID> kan worden vervangen
                  return <p>{renderMessage(children as string)}</p>;
                },
                h1({ children }) { return <h1 className="text-white text-xl font-semibold my-1">{children}</h1>; },
                h2({ children }) { return <h2 className="text-white text-lg font-semibold my-1">{children}</h2>; },
                h3({ children }) { return <h3 className="text-white text-base font-semibold my-1">{children}</h3>; },
                strong({ children }) { return <strong className="font-bold text-white">{children}</strong>; },
                em({ children }) { return <em className="italic text-white">{children}</em>; },
                del({ children }) { return <del className="line-through text-white">{children}</del>; },
                a({ href, children }) { return <a href={href} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{children}</a>; },
                blockquote({ children }) { return <blockquote className="border-l-2 border-gray-600 pl-3 text-gray-300 italic my-2">{children}</blockquote>; },
                ul({ children }) { return <ul className="list-disc ml-5 my-2">{children}</ul>; },
                ol({ children }) { return <ol className="list-decimal ml-5 my-2">{children}</ol>; },
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}