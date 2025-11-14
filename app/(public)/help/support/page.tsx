"use client";

import { useEffect} from "react";

export default function Page() {
  useEffect(() => {
    document.title = "Support";
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0f13] text-gray-300 px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Support
        </h1>

        <p className="text-gray-400 mb-10">
          Last updated: 14-11-2025
        </p>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-white mb-3">W.i.p</h2>
          <p>
            W.i.p
          </p>
        </section>
      </div>
    </main>
  );
}