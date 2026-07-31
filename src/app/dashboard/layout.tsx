import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, ListTodo, Users, Settings } from "lucide-react";
import { db } from "@/db";
import { households } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Sécurité : On s'assure que l'utilisateur a bien un foyer
  if (!session?.user?.householdId) {
    redirect("/onboarding");
  }

  // On récupère le nom du foyer pour l'afficher dans l'en-tête
  const household = await db.query.households.findFirst({
    where: eq(households.id, session.user.householdId),
  });

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      
      {/* 1. En-tête fixe en haut (Header) */}
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Home size={18} className="text-zinc-500" />
            {household?.name || "Mon Foyer"}
          </h1>
          <p className="text-xs text-zinc-500">
            Bonjour {session.user.name?.split(" ")[0]}
          </p>
        </div>
        <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
          <Settings size={22} />
        </button>
      </header>

      {/* 2. Zone de contenu (qui scrolle) */}
      {/* C'est ici qu'on ajoute pb-28 (padding-bottom) pour ne rien cacher sous le bouton flottant et la nav ! */}
      <main className="flex-1 overflow-y-auto pb-28 relative">
        {children}
      </main>

      {/* 3. Barre de navigation fixe en bas (Bottom Nav) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe">
        <ul className="flex justify-around items-center h-16 px-2">
          <li>
            <Link href="/dashboard" className="flex flex-col items-center p-2 text-zinc-900">
              <Home size={24} />
              <span className="text-[10px] font-medium mt-1">Accueil</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/tasks" className="flex flex-col items-center p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
              <ListTodo size={24} />
              <span className="text-[10px] font-medium mt-1">Tâches</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/members" className="flex flex-col items-center p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
              <Users size={24} />
              <span className="text-[10px] font-medium mt-1">Membres</span>
            </Link>
          </li>
        </ul>
      </nav>
      
    </div>
  );
}