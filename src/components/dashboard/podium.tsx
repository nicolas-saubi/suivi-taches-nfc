import { db } from "@/db";
import { auth } from "@/auth";
import { users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Podium() {

  const session = await auth();
  // Sécurité : On s'assure que l'utilisateur a bien un foyer
  if (!session?.user?.householdId) {
    redirect("/onboarding");
  }

  const topUsers = await db.select({name: users.name, points: users.points})
    .from(users)
    .where(eq(users.householdId, session?.user?.householdId))
    .orderBy(desc(users.points)).limit(3);

  const first = topUsers[0];
  const second = topUsers[1];
  const third = topUsers[2];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200">
      <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6 text-center">
        🏆 Podium de la semaine
      </h2>

      {/* Le conteneur du podium en flex items-end pour aligner les blocs par le bas */}
      <div className="flex justify-center items-end gap-3 h-44 pt-4">
        
        {/* 2ÈME PLACE (Argent) - À gauche */}
        <div className="flex-1 flex flex-col items-center">
          <span className="text-s font-bold text-zinc-700 mb-1 truncate max-w-[80px]">
            {second?.name?.split(" ")[0] || "-"} 🥈
          </span>
          
          {/* Bloc podium Argent */}
          <div className="w-full bg-zinc-200 border-t-4 border-r-1 border-l-1 border-zinc-400 rounded-t-lg flex h-24 items-center justify-center text-zinc-600 font-bold shadow-inner">
            <span className="text-xs text-zinc-400 mb-2">{second?.points || 0} pts</span>
          </div>
        </div>

        {/* 1ÈRE PLACE (Or) - Au centre et plus haut */}
        <div className="flex-1 flex flex-col items-center">
          <span className="text-s font-bold text-amber-600 mb-1 truncate max-w-[80px]">
            {first?.name?.split(" ")[0] || "-"} 🥇
          </span>
          <div className="w-full bg-amber-100 border-t-4 border-r-1 border-l-1 border-amber-400 rounded-t-lg h-32 flex flex-col items-center justify-center text-amber-700 font-bold shadow-inner">
            <span className="text-xs text-amber-500 mb-2">{first?.points || 0} pts</span>
          </div>
        </div>

        {/* 3ÈME PLACE (Bronze) - À droite */}
        <div className="flex-1 flex flex-col items-center">
          <span className="text-s font-bold text-zinc-700 mb-1 truncate max-w-[80px]">
            {third?.name?.split(" ")[0] || "-"} 🥉
          </span>
          
          {/* Bloc podium Bronze */}
          <div className="w-full bg-orange-100 border-t-4 border-l-1 border-r-1 border-orange-300 rounded-t-lg h-16 flex items-center justify-center text-orange-800 font-bold shadow-inner">
            <span className="text-xs text-zinc-400 mb-2">{third?.points || 0} pts</span>
          </div>
        </div>

      </div>
    </div>
  );
}