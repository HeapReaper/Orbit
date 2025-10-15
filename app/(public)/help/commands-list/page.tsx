"use client";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0d0f13] text-gray-300 px-6 md:px-20 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Commands List
        </h1>

        <p className="text-gray-400 mb-10">
          Last updated: 15-10-2025
        </p>

        <section className="space-y-6 text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">/birthday add</h2>
            <p>Add a new birthday to the server</p>
            <p className="ml-4">Options:</p>
            <ul className="ml-8 list-disc">
              <li>day (Integer, required) – Like 11</li>
              <li>month (Integer, required) – Like 05</li>
              <li>year (Integer, required) – Like 2001</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">/birthday delete</h2>
            <p>Delete your birthday</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">/birthday list</h2>
            <p>Birthday list (admin only)</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">/ticket admins</h2>
            <p>Open a ticket for the administration</p>
            <p className="ml-4">Options:</p>
            <ul className="ml-8 list-disc">
              <li>reason (String, required) – The reason for the ticket</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">/ticket confidential</h2>
            <p>Open a ticket that only the owner can see</p>
            <p className="ml-4">Options:</p>
            <ul className="ml-8 list-disc">
              <li>reason (String, required) – The reason for the ticket</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">/ticket close</h2>
            <p>Close a ticket</p>
          </div>
        </section>
      </div>
    </main>
  );
}
