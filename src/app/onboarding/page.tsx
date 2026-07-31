import { Home } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import createHousehold from "./actions";

export default async function OnboardingPage() {
  const session = await auth();

  // 1. Sécurité : On s'assure que la personne a le droit d'être ici
  if (!session?.user) {
    redirect("/"); // Pas connecté ? Dehors.
  }
  if (session.user.householdId) {
    redirect("/dashboard"); // A déjà une maison ? Direction le dashboard.
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50">
      <Card className="w-full max-w-md shadow-lg border-zinc-200">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto bg-zinc-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Home className="text-zinc-600" size={24} />
          </div>
          <CardTitle className="text-2xl">Bienvenue !</CardTitle>
          <CardDescription className="text-base mt-2">
            Créons votre foyer pour commencer à gérer vos tâches.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={createHousehold} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nom de la maison</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Ex: Maison de la Plage, Coloc Paris..." 
                required 
                className="h-11"
              />
            </div>
            
            <Button type="submit" className="w-full h-11 text-base">
              Créer mon foyer
            </Button>
          </form>

          {/* Petit lien au cas où la personne s'est connectée mais voulait en fait rejoindre une maison */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Vous avez un code d'invitation ? <br />
              <a href="/join" className="text-zinc-900 underline underline-offset-4 hover:text-zinc-700">
                Rejoindre un foyer existant
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}