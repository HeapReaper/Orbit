export default function ServerInfo() {
  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Server Info</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Members:</span> 3
        </p>
        <p>
          <span className="font-semibold text-white">Categories:</span> 3
        </p>
        <p>
          <span className="font-semibold text-white">Text Channels:</span> 14
        </p>
        <p>
          <span className="font-semibold text-white">Voice Channels:</span> 0
        </p>
        <p>
          <span className="font-semibold text-white">Roles:</span> 2
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="text-sm text-red-400 hover:text-red-500 transition">
          📋 Copy Server ID
        </button>
        <button className="text-sm text-red-400 hover:text-red-500 transition">
          ❓ Need Help?
        </button>
      </div>
    </section>
  );
}
