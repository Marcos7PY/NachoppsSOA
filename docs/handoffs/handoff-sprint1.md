# Handoff Sprint 1 — Infraestructura Base y Autenticación

## ✅ Tareas completadas

| # | Tarea | Estado | Archivos |
|---|-------|--------|----------|
| 1.1 | Limpieza inicial — eliminar `src/app/`, `window.DATA`, convertir a `.tsx` | ✅ | Eliminados 12 archivos de maqueta |
| 1.2 | Cliente HTTP (`api/client.ts`) | ✅ | [client.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/api/client.ts) |
| 1.3 | Tipos de auth | ✅ | [auth.types.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/types/auth.types.ts) |
| 1.4 | API de auth | ✅ | [auth.api.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/api/auth.api.ts) |
| 1.5 | Store de auth (Zustand) | ✅ | [auth.store.ts](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/store/auth.store.ts) |
| 1.6 | Router (React Router v7) | ✅ | [router/index.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/router/index.tsx) |
| 1.7 | Bootstrap (`main.tsx`) | ✅ | [main.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/main.tsx) |
| 1.8 | Pantalla Login | ✅ | [LoginScreen.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/screens/login/LoginScreen.tsx) |
| 1.9 | Shell/Layout | ✅ | [Shell.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/components/layout/Shell.tsx), [Sidebar.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/components/layout/Sidebar.tsx), [Header.tsx](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/src/components/layout/Header.tsx) |
| — | `.env.example` + `.env` | ✅ | [.env.example](file:///C:/Users/MARCOS/Desktop/BackActual/apps/pwa-cliente/.env.example) |

## 📦 Dependencias instaladas

- `react-router-dom@7` — Routing con guards de autenticación
- `zustand` — Estado global sin Context API

## 🏗️ Build

```
✓ npx nx run pwa-cliente:build — 34 modules, 0 errors
  dist/index.html                   0.92 kB
  dist/assets/index-CoczIfT0.css   23.95 kB
  dist/assets/index-CAoDTT5i.js   249.98 kB
```

## 🔍 Verificación `window.DATA`

```
grep "window.DATA" src/ → 0 resultados ✅
```

## Checklist de validación (manual)

- [x] `npx nx run pwa-cliente:build` sin errores
- [ ] Login con credenciales reales devuelve sesión y redirige a `/app`
- [ ] Recarga de página restaura sesión si la cookie sigue válida
- [ ] Token expirado (o cookie borrada manualmente) redirige a `/login`
- [ ] Logout limpia el store y redirige a `/login`
- [ ] El shell renderiza con sidebar y header sin errores de consola

## Arquitectura resultante

```
src/
├── api/
│   ├── client.ts          # Fetch wrapper (GET/POST/PATCH/DELETE)
│   └── auth.api.ts        # login(), me(), logout()
├── store/
│   └── auth.store.ts      # Zustand: user, authenticated, login/logout/restore
├── types/
│   └── auth.types.ts      # LoginRequest, UserDto
├── router/
│   └── index.tsx           # BrowserRouter, ProtectedRoute, PublicRoute
├── screens/
│   └── login/
│       └── LoginScreen.tsx # Formulario real con manejo de errores API
├── components/
│   └── layout/
│       ├── Shell.tsx       # App chrome: sidebar + header + content
│       ├── Sidebar.tsx     # Nav lateral con React Router
│       └── Header.tsx      # Topbar: user, theme toggle, logout
├── main.tsx                # Bootstrap: restore → mount → router
├── styles.css              # Design system completo (ex maqueta)
└── assets/
```

## Notas para Sprint 2

> [!IMPORTANT]
> Antes de comenzar Sprint 2, probar el flujo de login/logout con el backend real para verificar:
> - Formato de la cookie (httpOnly, secure, sameSite)
> - Shape exacto del `UserDto` devuelto por `GET /identidad/auth/me`
> - Comportamiento CORS con `credentials: 'include'`

> [!NOTE]
> El CSS se preservó íntegro de la maqueta original. Todos los estilos de mesa, KDS, caja, etc. siguen disponibles para los sprints siguientes.
