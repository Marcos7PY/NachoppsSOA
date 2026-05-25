import { Utensils } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2 px-2 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Utensils className="h-5 w-5" />
      </div>
      <span className="text-lg font-semibold text-sidebar-foreground">NachoPps</span>
    </div>
  );
}
