import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { WashingMachine, Trash, Droplets, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  
  // Sécurité supplémentaire au cas où le middleware laisserait passer un utilisateur connecté
  const session = await auth();
  if (session?.user) {
    if (session.user.householdId) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50">
      
      {/* 1. En-tête / Splashscreen visuel */}
      <div className="flex gap-4 mb-6 text-zinc-400 animate-pulse">
        <WashingMachine size={36} />
        <Trash size={36} />
        <Droplets size={36} />
        <Sparkles size={36} />
      </div>

      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
          NFC Chores
        </h1>
        <p className="text-sm text-zinc-600">
          Simplifiez la gestion des tâches du foyer, un badge à la fois.
        </p>
      </div>

      {/* 2. Carte de connexion Admin */}
      <Card className="w-full max-w-md shadow-lg border-zinc-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Espace Administrateur</CardTitle>
          <CardDescription>
            Connectez-vous pour créer ou administrer votre foyer.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-4">
          {/* Formulaire Server Action pour déclencher le login Google de NextAuth */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/onboarding" });
            }}
          >
            <Button type="submit" className="w-full flex items-center gap-2 h-11">
              <span>Se connecter avec Google</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* 3. Message rassurant pour les invités */}
          <div className="mt-4 pt-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500 leading-relaxed">
              Vous avez reçu un lien ou un QR code d'invitation ? <br />
              <span className="font-medium text-zinc-700">Scannez-le directement</span> avec l'appareil photo de votre téléphone pour rejoindre le foyer.
            </p>
          </div>
        </CardContent>
      </Card>
      
    </main>
  );
}
