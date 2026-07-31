"use client";

import React, { useActionState, useState, useEffect } from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
  DrawerContent
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import addTaskAction from './actions';

// 1. Nos suggestions rapides avec leurs valeurs par défaut
const SUGGESTIONS = [
  { emoji: "🍽️", name: "Lave-vaisselle", points: 10, duration: "3h" },
  { emoji: "🧺", name: "Lessive", points: 20, duration: "3h" },
  { emoji: "🗑️", name: "Poubelles", points: 10, duration: "1j" },
  { emoji: "🛏️", name: "Draps", points: 30, duration: "7j" },
];

export default function FloatingAddButton() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [state, formAction, isPending] = useActionState(addTaskAction, null);

  const [taskName, setTaskName] = useState("");
  const [emoji, setEmoji] = useState("📝"); // Emoji par défaut
  const [points, setPoints] = useState(10);
  const [duration, setDuration] = useState("1j");

  // Fonction pour appliquer une suggestion
  const handleSuggestionClick = (suggestion) => {
    setTaskName(suggestion.name);
    setEmoji(suggestion.emoji);
    setPoints(suggestion.points);
    setDuration(suggestion.duration);
  };

  useEffect(() => {
    if (state?.success) {
      setIsDrawerOpen(false);
    }
  }, [state]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>

      {/* Bouton Flottant (FAB) : Rond, avec ombre, placé en bas à droite */}
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DrawerTrigger>

      {/* Contenu du Drawer mobile */}
      <DrawerContent className="bg-white rounded-t-2xl">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center sm:text-center pt-6">
            <DrawerTitle className="text-xl font-bold text-zinc-900">
              Ajouter une tâche
            </DrawerTitle>
          </DrawerHeader>

          <form action={formAction} className="p-4 space-y-6">

            {/* BLOC 1 : Suggestions rapides */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Suggestions rapides
              </Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s.name}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    <span className="mr-1">{s.emoji}</span> {s.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* BLOC 2 : Nom et Émoji */}
            <div className="space-y-3">
              <Label htmlFor="taskName" className="text-sm font-semibold text-zinc-700">
                Nom de la tâche
              </Label>
              <div className="flex gap-2">
                {/* Petit bouton pour l'émoji (on cliquera dessus plus tard pour ouvrir un sélecteur) */}
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-12 shrink-0 text-xl rounded-xl bg-zinc-50"
                >
                  {emoji}
                </Button>

                {/* L'input principal, maintenant contrôlé par la variable taskName */}
                <Input
                  type="text"
                  id="taskName"
                  name="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Ex: Sortir les poubelles"
                  required
                  className="h-12 rounded-xl bg-zinc-50 flex-1"
                />
                {/* Champs cachés pour envoyer l'émoji, les points et la durée à l'Action Server */}
                <input type="hidden" name="emoji" value={emoji} />
                <input type="hidden" name="points" value={points} />
                <input type="hidden" name="duration" value={duration} />
              </div>
            </div>

            {/* Affichage de l'erreur éventuelle */}
            {state?.error && (
              <p className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded-lg">
                {state.error}
              </p>
            )}

            {/* Pied de page du Drawer */}
            <DrawerFooter className="px-0 pt-4 pb-8 space-y-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-xl text-base font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  "Ajouter la tâche"
                )}
              </Button>

              <DrawerClose asChild>
                <Button variant="ghost" className="w-full h-12 rounded-xl text-zinc-500">
                  Annuler
                </Button>
              </DrawerClose>
            </DrawerFooter>

          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}