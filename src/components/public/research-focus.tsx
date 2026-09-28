import { 
  Dna, 
  Cpu, 
  Leaf, 
  Compass, 
  Atom, 
  BookMarked,
  ArrowUpRight 
} from "lucide-react";

const RESEARCH_CLUSTERS = [
  {
    icon: Dna,
    color: "from-rose-500 to-pink-600",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    title: "Bioteknologi & Kesehatan",
    description:
      "Riset genomik, pengembangan vaksin mandiri, fitofarmaka, dan diagnostik molekuler penyakit tropis terabaikan.",
    stats: "1.240+ Publikasi",
    tags: ["Genomika", "Vaksin", "Fitofarmaka", "Onkologi"],
  },
  {
    icon: Cpu,
    color: "from-blue-500 to-cyan-600",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Kecerdasan Buatan & Komputasi",
    description:
      "Pengembangan LLM Bahasa Daerah, computer vision pemetaan satelit, keamanan siber nasional, dan superkomputer riset.",
    stats: "980+ Riset AI",
    tags: ["NLP Indonesia", "Satellite Vision", "Cybersecurity", "HPC"],
  },
  {
    icon: Leaf,
    color: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Energi Bersih & Iklim",
    description:
      "Rantai pasok baterai kendaraan listrik nasional, sel surya efisiensi tinggi, biofuel generasi ketiga, dan dekarbonisasi industri.",
    stats: "1.450+ Kajian",
    tags: ["Baterai EV", "Biofuel", "Carbon Capture", "Solar Cell"],
  },
  {
    icon: Atom,
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    title: "Ketahanan Pangan Hayati",
    description:
      "Pemuliaan padi adaptif iklim ekstrem, protein alternatif dari mikroalga tropis, sensor IoT tanah presisi, dan perlindungan plasma nutfah.",
    stats: "1.820+ Inovasi",
    tags: ["Padi Tropis", "Mikroalga", "Smart Farming", "Plasma Nutfah"],
  },
  {
    icon: Compass,
    color: "from-indigo-500 to-violet-600",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "Kemaritiman & Kebumian",
    description:
      "Pemodelan zona subduksi megathrust, survei batimetri laut dalam KRI Rigel, konservasi terumbu karang, dan oseanografi terapan.",
    stats: "1.130+ Ekspedisi",
    tags: ["Megathrust", "Laut Dalam", "Mangrove", "Batimetri"],
  },
  {
    icon: BookMarked,
    color: "from-purple-500 to-fuchsia-600",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    title: "Sosial, Budaya & Kebijakan",
    description:
      "Advokasi evidence-based policy, perlindungan kearifan lokal Nusantara, transformasi digital masyarakat adat, dan ekonomi sirkular.",
    stats: "2.130+ Policy Brief",
    tags: ["Policy Brief", "Kearifan Lokal", "Ekonomi Sirkular", "Etnografi"],
  },
];

export function ResearchFocus() {
  return (
    <section id="program" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-4 backdrop-blur-md">
            🔬 Prioritas Riset Nasional
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            6 Klaster Riset Unggulan Indonesia
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            IPI mengonsolidasikan talenta riset lintas disiplin untuk menjawab tantangan strategis bangsa melalui agenda penelitian berdampak tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {RESEARCH_CLUSTERS.map((cluster) => {
            const Icon = cluster.icon;
            return (
              <div
                key={cluster.title}
                className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-xl bg-gradient-to-br ${cluster.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${cluster.badgeColor}`}
                    >
                      {cluster.stats}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3">
                    {cluster.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {cluster.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-700/60">
                    {cluster.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-900/60 text-slate-300 border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors">
                    Lihat roadmap klaster riset <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
