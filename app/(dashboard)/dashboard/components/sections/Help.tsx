import { BookOpen } from "lucide-react";
import helpData from "@/app/(dashboard)/dashboard/data/helpData";

export default function HelpArticles() {
  return (
    <section className="bg-[#181b25] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6 text-[var(--primary-color)]" />
        <h2 className="text-lg font-semibold">Help Articles</h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {helpData.map((article) => (
          <a
            key={article.title}
            href={article.link}
            className="bg-[#0d0f13] p-4 rounded-lg hover:bg-[#252836] transition-colors flex flex-col gap-2 shadow-sm "
          >
            <h3 className="text-white font-semibold">{article.title}</h3>
            <p className="text-gray-400 text-sm">{article.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
