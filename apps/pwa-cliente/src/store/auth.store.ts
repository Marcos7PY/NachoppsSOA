import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UsuarioDto } from '@org/contracts';

interface AuthState {
  token: string | null;
  usuario: Omit<UsuarioDto, 'activo' | 'createdAt'> | null;
  isAuthenticated: boolean;
  
  // Acciones
  setSession: (token: string, usuario: Omit<UsuarioDto, 'activo' | 'createdAt'>) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      setSession: (token, usuario) =>
        set({
          token,
          usuario,
          isAuthenticated: true,
        }),

      clearSession: () =>
        set({
          token: null,
          usuario: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'nachopps-auth-storage', // Clave en localStorage
    }
  )
);
