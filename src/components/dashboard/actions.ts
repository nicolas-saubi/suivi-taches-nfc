"use server";

import { db } from "@/db";
import { chores } from "@/db/schema";
import { auth } from "@/auth";

export default async function addTaskAction(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const taskName = formData.get("taskName") as string;
  if (!taskName || taskName.trim() === "") {
    return { error: "Le nom de la tâche est obligatoire." };
  }

  try {
    await db.insert(chores).values({
      name: taskName.trim(),
      frequencyDays: 1,
      householdId: session.user.householdId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding task:", error);
    return { error: "Une erreur est survenue lors de l'ajout de la tâche." };
  }
}