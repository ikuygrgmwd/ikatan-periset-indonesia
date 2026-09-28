"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { LOCATIONS, type Profile } from "@/lib/research-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}
export function Notice({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  return error ? (
    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {error}
    </p>
  ) : message ? (
    <p
      role="status"
      className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
    >
      {message}
    </p>
  ) : null;
}
export function LocationSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border px-3 text-sm"
    >
      {LOCATIONS.map((l) => (
        <option key={l.id} value={l.id}>
          {l.name} — {l.region}
        </option>
      ))}
    </select>
  );
}
export function ProfileEditor({ userId }: { userId: string }) {
  const { database, mutate } = useAuth();
  const account = database.accounts.find((a) => a.id === userId)!;
  const initial = database.profiles.find((p) => p.userId === userId)!;
  const [profile, setProfile] = useState<Profile>(initial);
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reading, setReading] = useState(false);
  async function upload(file?: File) {
    setError("");
    setMessage("");
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 500 * 1024
    ) {
      setError("Gunakan JPG, PNG, atau WebP maksimal 500 KB.");
      return;
    }
    setReading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve();
        image.onerror = reject;
        image.src = data;
      });
      setProfile((p) => ({ ...p, avatar: data }));
    } catch {
      setError("Foto tidak dapat dibaca. Pilih berkas gambar yang valid.");
    } finally {
      setReading(false);
    }
  }
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage("");
        const result = mutate({
          type: "profile.save",
          userId,
          input: profile,
          name,
          email,
        });
        setError(result.error || "");
        if (!result.error) setMessage("Profil berhasil disimpan.");
      }}
    >
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-100 text-3xl font-bold text-blue-700">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`Foto ${name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            name.charAt(0)
          )}
        </div>
        <div className="space-y-2">
          <Field label="Foto profil">
            <Input
              type="file"
              disabled={reading}
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                void upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </Field>
          <p className="text-xs text-slate-500">
            JPG, PNG, WebP · Maks. 500 KB. Simpan profil untuk menerapkan.
          </p>
          {profile.avatar && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setProfile((p) => ({ ...p, avatar: "" }))}
            >
              Hapus foto
            </Button>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama lengkap">
          <Input
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Email">
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Lokasi riset">
          <LocationSelect
            value={profile.locationId}
            onChange={(locationId) => setProfile((p) => ({ ...p, locationId }))}
          />
        </Field>
        {(
          [
            { key: "bidangRiset", label: "Bidang riset" },
            { key: "jabatan", label: "Jabatan" },
            { key: "nip", label: "NIP" },
            { key: "phone", label: "Nomor telepon" },
          ] as const
        ).map((f) => (
          <Field label={f.label} key={f.key}>
            <Input
              value={profile[f.key]}
              onChange={(e) =>
                setProfile((p) => ({ ...p, [f.key]: e.target.value }))
              }
            />
          </Field>
        ))}
        <Field label="Status">
          <select
            className="h-9 rounded-lg border px-3"
            value={profile.status}
            onChange={(e) =>
              setProfile((p) => ({
                ...p,
                status: e.target.value as Profile["status"],
              }))
            }
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </Field>
      </div>
      <Field label={`Biografi singkat (${profile.bio.length}/1000)`}>
        <Textarea
          rows={4}
          maxLength={1000}
          value={profile.bio}
          onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
          placeholder="Ceritakan bidang keahlian dan minat riset Anda..."
        />
      </Field>
      <Notice error={error} message={message} />
      <Button
        type="submit"
        disabled={reading}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        {reading ? "Membaca foto..." : "Simpan Profil"}
      </Button>
    </form>
  );
}
