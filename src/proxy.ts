import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const householdId = session?.user?.householdId;

  const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding");

  // 1. Laisser passer les routes d'authentification NextAuth (/api/auth/*)
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // 2. Si l'utilisateur n'est PAS connecté
  if (!isLoggedIn) {
    if (nextUrl.pathname !== "/") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Si l'utilisateur EST connecté, mais n'a PAS de foyer (householdId)
  if (!householdId) {
    if (!isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }
    return NextResponse.next();
  }

  // 4. Si l'utilisateur est connecté ET a un foyer
  if (nextUrl.pathname === "/" || isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

// Configuration des routes sur lesquelles le proxy doit s'appliquer
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};