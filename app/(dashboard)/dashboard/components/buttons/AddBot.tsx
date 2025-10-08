export default function AddBot() {
  return (
    <div className="mt-4 ">
      <a
        href="https://discord.com/oauth2/authorize?client_id=1424327630706184343&scope=bot%20applications.commands&permissions=8"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full py-1 bg-[var(--primary-color)] hover:bg-[var(--hover-color)] text-white font-semibold rounded-lg transition text-center"
      >
        Add bot
      </a>
    </div>
  );
}