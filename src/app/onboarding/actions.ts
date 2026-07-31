import { auth } from "@/auth";
import { db } from "@/db";
import { households, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function createHousehold(formData: FormData) {
  "use server";

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Utilisateur non authentifié.");
  }

  const name = formData.get("name") as string;

  if (!name || name.trim() === "" || !userId) return;

  // A. Création du foyer dans la table households
  const [newHousehold] = await db.insert(households).values({
    name: name.trim(),
  }).returning({ id: households.id });

  // B. Mise à jour de l'utilisateur avec l'ID du nouveau foyer
  await db.update(users)
    .set({ householdId: newHousehold.id })
    .where(eq(users.id, userId));

  // C. Redirection vers le dashboard
  redirect("/dashboard");
}