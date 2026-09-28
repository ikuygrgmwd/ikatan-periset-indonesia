import { MOCK_NEWS, type NewsItem } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, User, Tag } from "lucide-react";

export async function generateStaticParams() {
  return MOCK_NEWS.map((news: NewsItem) => ({ id: news.id }));
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = MOCK_NEWS.find((n: NewsItem) => n.id === id);

  if (!news) {
    notFound();
  }

  const categoryColors: Record<string, string> = {
    Acara: "bg-purple-100 text-purple-700 border-purple-200",
    Prestasi: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Program: "bg-green-100 text-green-700 border-green-200",
    Kolaborasi: "bg-blue-100 text-blue-700 border-blue-200",
    Workshop: "bg-orange-100 text-orange-700 border-orange-200",
    Publikasi: "bg-red-100 text-red-700 border-red-200",
  };

  const otherNews = MOCK_NEWS.filter((n: NewsItem) => n.id !== id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${
              categoryColors[news.category] || "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            {news.category}
          </span>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight mb-4">
            {news.title}
          </h1>

          <div className="flex items-center gap-5 text-slate-500 text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(news.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {news.author}
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>

          {/* Article body */}
          <div className="prose prose-slate max-w-none">
            {news.content.split("\n\n").map((paragraph: string, i: number) => (
              <p key={i} className="text-slate-700 leading-relaxed mb-4 text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Berita Lainnya
            </h3>
            <div className="space-y-4">
              {otherNews.map((item: NewsItem) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.id}`}
                  className="flex gap-3 group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 line-clamp-2 transition-colors leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
            <h3 className="font-bold text-lg mb-2">Bergabung dengan IPI</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Akses ribuan sumber daya riset dan program beasiswa eksklusif.
            </p>
            <Link
              href="/login"
              className="block w-full text-center py-2.5 px-4 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
            >
              Login Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
