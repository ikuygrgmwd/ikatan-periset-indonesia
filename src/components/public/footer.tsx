import { FlaskConical, Mail, Phone, MapPin, Globe, Share2, ExternalLink } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-base">
                Ikatan Periset Indonesia
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Organisasi profesi yang mewadahi para periset dan ilmuwan
              Indonesia untuk berkolaborasi, berinovasi, dan berkontribusi bagi
              kemajuan bangsa.
            </p>
            <div className="flex gap-3 mt-5">
              {[Globe, Share2, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              {["Beranda", "Berita", "Tentang Kami", "Program Kerja", "Kontak"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                <span>Jl. Gatot Subroto No. 10, Jakarta Selatan 12930</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>info@periset.or.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>(021) 5555-1234</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <p>© 2026 Ikatan Periset Indonesia. Hak Cipta Dilindungi.</p>
          <p>Dibuat dengan ❤️ untuk kemajuan riset Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
