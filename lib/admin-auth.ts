import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DEFAULT_ADMIN_EMAIL = "fparmezani@gmail.com";

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || DEFAULT_ADMIN_EMAIL)
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && getAdminEmails().includes(email.trim().toLowerCase()));
}

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  return isAdminEmail(session?.user?.email) ? session : null;
}

export async function requireAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  if (!isAdminEmail(session.user.email)) {
    redirect("/futebol");
  }

  return session;
}
