import Podium from "@/components/dashboard/podium";
// import { UrgentTasks } from "@/components/dashboard/urgent-tasks";
// import { RecentActivity } from "@/components/dashboard/recent-activity";
import { FloatingAddButton } from "@/components/dashboard/floating-add-button";

export default function DashboardPage() {
  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Chaque bloc gère sa propre logique et son propre design en interne */}
      <Podium />
      {/* <UrgentTasks /> */}
      {/* <RecentActivity /> */}
      
      {/* Notre fameux bouton flottant pour ajouter une tâche */}
      <FloatingAddButton />
    </div>
  );
}