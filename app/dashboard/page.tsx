import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const user = await currentUser();

  if (user) {
    // Check if user exists in our Prisma DB, if not, create them
    await db.user.upsert({
      where: { clerkId: user.id },
      update: { email: user.emailAddresses[0].emailAddress },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
      <p className="text-slate-500">Your AI Career Coach is ready.</p>
    </div>
  );
}
