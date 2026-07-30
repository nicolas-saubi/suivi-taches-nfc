import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  
  // On récupère le householdId depuis notre session custom (injectée dans auth.ts)
  const householdId = session?.user?.householdId;

  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  // 1. Laisser passer les routes d'authentification NextAuth (/api/auth/*)
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // 2. Si l'utilisateur n'est PAS connecté
  if (!isLoggedIn) {
    // S'il essaie d'aller ailleurs que sur la racine /, on le renvoie à l'accueil
    if (nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Si l'utilisateur EST connecté, mais n'a PAS de foyer (householdId)
  if (!householdId) {
    // S'il n'est pas déjà sur la page d'onboarding, on l'y force
    if (!isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }
    return NextResponse.next();
  }

  // 4. Si l'utilisateur est connecté ET a un foyer
  // S'il essaie de retourner sur la page d'accueil ou l'onboarding, on le force vers le dashboard
  if (nextUrl.pathname === "/" || isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

// Configuration des routes sur lesquelles le middleware doit s'appliquer
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};