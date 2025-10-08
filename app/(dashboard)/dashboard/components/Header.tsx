export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 md:p-8 border-b border-gray-800 bg-[#0d0f13] sticky top-0 z-20">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Reap the heap</h1>
        <p className="text-gray-400 text-sm">@heapreaper</p>
      </div>
      <img
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-700"
        src="https://placehold.co/50"
        alt="Avatar"
      />
    </header>
  );
}
