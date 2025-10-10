"use client";

export default function PageLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg z-10">
      <div className="w-12 h-12 border-4 border-t-[var(--primary-color)] border-white rounded-full animate-spin"></div>
    </div>
  );
}
