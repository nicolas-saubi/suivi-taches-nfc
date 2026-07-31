"use client";

import React, { useActionState, useEffect } from 'react';
import { Drawer, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import addTaskAction from './actions';

export default function FloatingAddButton() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const [state, formAction, isPending] = useActionState(addTaskAction, null);

  useEffect(() => {
    if (state?.success) {
      setIsDrawerOpen(false);
    }
  }, [state]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-16 right-4 z-20">+</Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white p-4 rounded-lg shadow-lg">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">Ajouter une tâche</DrawerTitle>
        </DrawerHeader>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
              Nom de la tâche
            </label>
            <input
              type="text"
              id="taskName"
              name="taskName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-500 font-medium">{state.error}</p>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Annuler</Button>
            </DrawerClose>
            <button type="submit" disabled={isPending}>
              {isPending ? "Ajout en cours..." : "Ajouter la tâche"}
            </button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer >
  );
}