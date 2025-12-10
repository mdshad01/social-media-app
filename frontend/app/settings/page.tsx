import { redirect } from "next/navigation";

export default function SettingsPage() {
  // Redirect to account by default
  redirect("/settings/account");
}
