"use client";

import ModuleCard from "@/app/(dashboard)/dashboard/components/cards/ModuleCard";
import modules from "@/app/(dashboard)/dashboard/data/modules";
import { Package } from "lucide-react";
import {useState} from "react";
import TextInput from "@/app/(dashboard)/dashboard/components/inputs/Text";

export default function ModuleSection() {
  const [search, setSearch] = useState("");

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(search.toLowerCase()) && module.enabled
  );

  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-6 h-6 text-[var(--primary-color)]" />

        <h2 className="text-lg font-semibold">Modules</h2>
      </div>

      <TextInput
        label=""
        placeholder="Search..."
        value={search}
        onChange={setSearch}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => (
          // @ts-ignore
          <ModuleCard key={module.name} {...module} />
        ))}
      </div>
    </section>
  );
}