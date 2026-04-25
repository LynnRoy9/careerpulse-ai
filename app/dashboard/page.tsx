import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/Auth");
  }

  // 1. Extract their information (works for both Google and manual signups)
  const clerkId = user.id;
  const email = user.emailAddresses[0]?.emailAddress;
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  // 2. The Catch: Upsert into Supabase automatically
  // If they already exist, it does nothing. If they are new from Google, it creates them.
  await db.user.upsert({
    where: { clerkId: clerkId },
    update: {},
    create: {
      clerkId: clerkId,
      email: email,
      name: name !== "" ? name : "AI User",
      // role and experience will remain null for Google users until they update their profile
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {name}!</h1>
      <p className="text-slate-500">Your AI Career Coach is ready.</p>
    </div>
  );
}
