export default function InlineCode({ text }: { text: string }) {
  return (
    <code className="bg-[#2f3136] text-gray-200 font-mono text-sm px-1 py-0.5 rounded">
      {text}
    </code>
  );
}