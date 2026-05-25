import { LogOut, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function NavUser({ collapsed }: { collapsed: boolean }) {
  const { usuario, clearSession } = useAuthStore();

  if (!usuario) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent/50 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
              {getInitials(usuario.nombre)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col text-left">
              <span className="text-sm font-medium text-sidebar-foreground">{usuario.nombre}</span>
              <span className="text-xs text-sidebar-foreground/50 capitalize">{usuario.rol.toLowerCase()}</span>
            </div>
          )}
          {!collapsed && <ChevronUp className="ml-auto h-4 w-4 text-sidebar-foreground/50" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className="w-[--radix-dropdown-menu-trigger-width] min-w-[12rem]"
      >
        <DropdownMenuItem onClick={() => clearSession()} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
