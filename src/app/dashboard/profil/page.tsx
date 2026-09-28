import { redirect } from "next/navigation";

/**
 * /dashboard/profil is deprecated — profile management has moved into
 * Account Settings (/dashboard/settings). This redirect ensures any
 * existing links still work.
 */
export default function ProfilRedirectPage() {
  redirect("/dashboard/settings");
}
