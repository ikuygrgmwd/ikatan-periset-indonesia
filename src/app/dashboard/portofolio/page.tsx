"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  PORTFOLIO_LABELS,
  type PortfolioKind,
  type PortfolioEntry,
  type EntryInput,
} from "@/lib/research-store";
import { Field, Notice } from "@/components/research/profile-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, BookOpen, Pencil, Trash2, ExternalLink } from "lucide-react";
const emptyEntry = (): EntryInput => ({
  title: "",
  year: new Date().getFullYear(),
  description: "",
  publisher: "",
  identifier: "",
  url: "",
});
export default function PortfolioPage() {
  const { user, database, mutate } = useAuth();
  const [kind, setKind] = useState<PortfolioKind>("publications");
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<PortfolioEntry | null>(null);
  const [deleting, setDeleting] = useState<PortfolioEntry | null>(null);
  const [form, setForm] = useState<EntryInput>(emptyEntry);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  if (!user) return null;
  const entries = database[kind]
    .filter((e) => e.userId === user.id)
    .sort((a, b) => b.year - a.year);
  function edit(entry: PortfolioEntry | null) {
    setTarget(entry);
    setForm(
      entry
        ? {
            title: entry.title,
            year: entry.year,
            description: entry.description,
            publisher: entry.publisher,
            identifier: entry.identifier,
            url: entry.url,
          }
        : emptyEntry(),
    );
    setError("");
    setMessage("");
    setOpen(true);
  }
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Portofolio Saya</h1>
        <p className="mt-1 text-sm text-slate-600">
          Catat kontribusi riset, kekayaan intelektual, dan proyek Anda.
        </p>
      </div>
      <div aria-label="Kategori portofolio" className="flex flex-wrap gap-2">
        {(Object.keys(PORTFOLIO_LABELS) as PortfolioKind[]).map((k) => (
          <Button
            key={k}
            aria-pressed={kind === k}
            variant={kind === k ? "default" : "outline"}
            onClick={() => {
              setKind(k);
              setError("");
              setMessage("");
            }}
          >
            {PORTFOLIO_LABELS[k]}{" "}
            <span className="opacity-70">
              ({database[k].filter((e) => e.userId === user.id).length})
            </span>
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          {PORTFOLIO_LABELS[kind]}
        </h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => edit(null)}
        >
          <Plus />
          Tambah {PORTFOLIO_LABELS[kind]}
        </Button>
      </div>
      {!open && !deleting && <Notice error={error} message={message} />}
      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-slate-500">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-blue-500" />
          <p>Belum ada {PORTFOLIO_LABELS[kind].toLowerCase()}.</p>
          <p className="mt-1 text-sm">
            Tambahkan karya pertama Anda melalui tombol di atas.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <article
              className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm"
              key={entry.id}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {entry.year}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${entry.title}`}
                    onClick={() => edit(entry)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label={`Hapus ${entry.title}`}
                    onClick={() => {
                      setError("");
                      setDeleting(entry);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <h3 className="break-words font-bold text-slate-900">
                {entry.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {entry.publisher}
                {entry.identifier && ` · ${entry.identifier}`}
              </p>
              <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
                {entry.description}
              </p>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700"
                >
                  Lihat karya <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogTitle>
            {target ? "Edit" : "Tambah"} {PORTFOLIO_LABELS[kind]}
          </DialogTitle>
          <DialogDescription>
            Judul dan tahun wajib diisi. Karya disimpan pada akun Anda.
          </DialogDescription>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const result = mutate({
                type: "entry.save",
                kind,
                id: target?.id,
                input: form,
              });
              setError(result.error || "");
              if (!result.error) {
                setOpen(false);
                setMessage("Karya berhasil disimpan.");
              }
            }}
          >
            <Field label="Judul">
              <Input
                required
                minLength={3}
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </Field>
            <Field label="Tahun">
              <Input
                required
                type="number"
                min={1900}
                max={new Date().getFullYear() + 1}
                value={form.year || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, year: Number(e.target.value) }))
                }
              />
            </Field>
            <Field
              label={
                kind === "publications"
                  ? "Jurnal / Penerbit"
                  : kind === "copyrights"
                    ? "Lembaga / Pemegang hak"
                    : "Organisasi / Mitra"
              }
            >
              <Input
                value={form.publisher}
                onChange={(e) =>
                  setForm((f) => ({ ...f, publisher: e.target.value }))
                }
              />
            </Field>
            <Field
              label={
                kind === "publications"
                  ? "DOI / ISBN"
                  : kind === "copyrights"
                    ? "Nomor hak cipta / paten"
                    : "Kode proyek (opsional)"
              }
            >
              <Input
                value={form.identifier}
                onChange={(e) =>
                  setForm((f) => ({ ...f, identifier: e.target.value }))
                }
              />
            </Field>
            <Field label="Tautan karya (opsional)">
              <Input
                type="url"
                placeholder="https://..."
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
              />
            </Field>
            <Field label="Deskripsi">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <Notice error={error} />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan Karya</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleting}
        onOpenChange={(value) => {
          if (!value) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Hapus karya?</DialogTitle>
          <DialogDescription>
            Hapus “{deleting?.title}” dari portofolio Anda?
          </DialogDescription>
          <Notice error={error} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleting) return;
                const result = mutate({
                  type: "entry.delete",
                  kind,
                  id: deleting.id,
                });
                setError(result.error || "");
                if (!result.error) {
                  setDeleting(null);
                  setMessage("Karya berhasil dihapus.");
                }
              }}
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
