"use server";
import { db } from "@/lib/db";

export async function syncUserToDb(data: {
  clerkId: string;
  email: string;
  name: string;
  role: string;
  experience: string;
}) {
  try {
    await db.user.upsert({
      where: { clerkId: data.clerkId },
      update: {
        name: data.name,
        role: data.role,
        experience: data.experience,
      },
      create: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        role: data.role,
        experience: data.experience,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Supabase Sync Error:", error);
    throw new Error("Failed to sync user data");
  }
}