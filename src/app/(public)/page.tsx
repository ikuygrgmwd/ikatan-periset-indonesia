import { IndonesiaEarthBackground } from "@/components/public/indonesia-earth";
import Link from "next/link";
import { MOCK_NEWS } from "@/lib/mock-data";
import { Calendar, ArrowRight, Users, BookOpen, Award, TrendingUp, ChevronRight } from "lucide-react";

function NewsCard({ news }: { news: (typeof MOCK_NEWS)[0] }) {
  const categoryColors: Record<string, string> = {
    Acara: "bg-purple-100 text-purple-700",
    Prestasi: "bg-yellow-100 text-yellow-700",
    Program: "bg-green-100 text-green-700",
    Kolaborasi: "bg-blue-100 text-blue-700",
    Workshop: "bg-orange-100 text-orange-700",
    Publikasi: "bg-red-100 text-red-700",
  };

  return (
    <Link
      href={`/berita/${news.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
            categoryColors[news.category] || "bg-slate-100 text-slate-700"
          }`}
        >
          {news.category}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {news.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {news.summary}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(news.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Baca <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

const stats = [
  { icon: Users, label: "Anggota Aktif", value: "2.400+", color: "text-blue-600" },
  { icon: BookOpen, label: "Publikasi Riset", value: "8.750+", color: "text-indigo-600" },
  { icon: Award, label: "Penghargaan", value: "320+", color: "text-purple-600" },
  { icon: TrendingUp, label: "Program Aktif", value: "45", color: "text-green-600" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section — Earth visual is integrated as background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white min-h-[520px] flex items-center">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold border border-blue-500/30 mb-6">
              🔬 Portal Resmi Ikatan Periset Indonesia
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Mendorong{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Inovasi Riset
              </span>{" "}
              untuk Indonesia Maju
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl">
              Ikatan Periset Indonesia (IPI) adalah organisasi profesi yang
              mewadahi para periset dan ilmuwan Indonesia. Kami berkomitmen
              membangun ekosistem riset yang kuat demi kemajuan bangsa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#berita"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-900/40 transition-all active:scale-95 flex items-center gap-2"
              >
                Lihat Berita <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#tentang"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-white border border-white/20 transition-all"
              >
                Tentang Kami
              </Link>
            </div>
          </div>
          <IndonesiaEarthBackground />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Kami */}
      <section id="tentang" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Tentang Kami
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
                Bersatu untuk Memajukan Riset Indonesia
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Didirikan pada tahun 1985, Ikatan Periset Indonesia telah menjadi
                rumah bagi lebih dari 2.400 periset aktif dari berbagai bidang
                ilmu. Kami menyediakan platform kolaborasi, program pengembangan
                kapasitas, dan advokasi kebijakan riset nasional.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Memfasilitasi kolaborasi riset antar lembaga",
                  "Program beasiswa dan pengembangan periset muda",
                  "Penerbitan jurnal ilmiah terindeks internasional",
                  "Advokasi kebijakan riset dan inovasi nasional",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://picsum.photos/seed/research-lab/600/400"
                alt="Lab Riset Indonesia"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-bold text-lg">Laboratorium Riset IPI</p>
                <p className="text-sm text-blue-200">Fasilitas riset kelas dunia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita */}
      <section id="berita" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Terbaru
              </span>
              <h2 className="mt-1 text-3xl md:text-4xl font-extrabold text-slate-800">
                Berita &amp; Informasi
              </h2>
            </div>
            <Link
              href="/#berita"
              className="hidden md:flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:gap-2.5 transition-all"
            >
              Lihat semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_NEWS.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Bergabunglah dengan IPI
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari komunitas periset Indonesia terbesar. Akses
            ribuan sumber daya riset, program beasiswa, dan jaringan global.
          </p>
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-xl transition-all active:scale-95"
          >
            Daftar Sekarang <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
