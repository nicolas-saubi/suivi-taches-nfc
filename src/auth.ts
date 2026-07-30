import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      householdId: string | null;
      isGuest: boolean | null;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  callbacks: {
    // On enrichit la session React pour y injecter l'ID utilisateur et son foyer (householdId)
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // On va chercher les infos métier custom stockées dans notre table users
        const dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, user.id),
        });
        if (dbUser) {
          session.user.householdId = dbUser.householdId;
          session.user.isGuest = dbUser.isGuest;
        }
      }
      return session;
    },
  },
});