export default function UserInfo() {
  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">User Info</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <span className="font-semibold text-white">Username:</span> HeapReaper
        </p>
        <p>
          <span className="font-semibold text-white">Servers joined:</span> 3
        </p>
        <p>
          <span className="font-semibold text-white">Test:</span> 14
        </p>
      </div>
    </section>
  );
}
