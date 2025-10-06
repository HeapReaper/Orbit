import Image from "next/image";

export default function LoaderSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin-slow transition-opacity duration-500 opacity-80 hover:opacity-100 h-32 w-32">
          <Image
            src="/logo-small.png"
            alt="Logo"
            width={128}
            height={128}
            className="object-contain rounded-full"
          />
        </div>
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    </div>
  );
}
