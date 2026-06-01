# Contexto actual de `pwa-cliente`

Fecha de captura: 2026-05-31.

## Estructura de directorios actual

Proyecto Nx: `pwa-cliente`

Raiz: `apps/pwa-cliente`

```text
apps/pwa-cliente
|-- dist
|   |-- assets
|   |   |-- app-w8teOEF2.js
|   |   |-- commerce-D-uEc3y6.js
|   |   |-- data-Bq0mIVxA.js
|   |   |-- icons-9VOGJRx7.js
|   |   |-- index-BMxlbtmb.css
|   |   |-- index-CtocGtps.js
|   |   |-- jsx-runtime-BGOlArBG.js
|   |   |-- login-ZjlcSi4D.js
|   |   |-- react-DV4-t5jR.js
|   |   |-- screens-admin-WG3a9HRp.js
|   |   |-- screens-money-DD3VyO-l.js
|   |   |-- screens-ops-BlpehwCI.js
|   |   |-- shell-B6Y_Vy1n.js
|   |   |-- tweaks-panel-DHk_5f0W.js
|   |   `-- ui-hT3ALxbA.js
|   |-- favicon.ico
|   `-- index.html
|-- public
|   `-- favicon.ico
|-- src
|   |-- app
|   |   |-- app.jsx
|   |   |-- commerce.jsx
|   |   |-- data.jsx
|   |   |-- icons.jsx
|   |   |-- login.jsx
|   |   |-- screens-admin.jsx
|   |   |-- screens-money.jsx
|   |   |-- screens-ops.jsx
|   |   |-- shell.jsx
|   |   |-- styles.css
|   |   |-- tweaks-panel.jsx
|   |   `-- ui.jsx
|   |-- assets
|   |   `-- .gitkeep
|   `-- main.jsx
|-- index.html
|-- package.json
|-- tsconfig.app.json
|-- tsconfig.json
`-- vite.config.mts
```

Targets Nx resueltos:

```text
build        vite build
serve        vite
dev          vite
preview      vite preview
serve-static @nx/web:file-server
typecheck    tsc --build --emitDeclarationOnly
```

## Como se usa `window.DATA` hoy

El PWA actual no esta llamando a la API desde sus pantallas principales. Carga datos mock en memoria y los copia a un store local React.

Orden de carga en `apps/pwa-cliente/src/main.jsx`:

```jsx
globalThis.React = React;

await import('./app/icons.jsx');
await import('./app/data.jsx');
await import('./app/ui.jsx');
await import('./app/commerce.jsx');
await import('./app/tweaks-panel.jsx');
await import('./app/shell.jsx');
await import('./app/login.jsx');
await import('./app/screens-ops.jsx');
await import('./app/screens-money.jsx');
await import('./app/screens-admin.jsx');
await import('./app/app.jsx');
```

`data.jsx` arma vocabularios, mocks y helpers, y los publica globalmente:

```jsx
window.DATA = {
  fmt, fmtN, MESA_ST, PED_ST, CTA_ST, RES_ST,
  productos, cats, pedidos, mesas, cuentas, reservas, transacciones,
  usuarios, roles, servicios, notificaciones,
  ventasPorHora, topProductos, metodoVentas,
  metodos: ['EFECTIVO', 'TARJETA', 'YAPE', 'TRANSFERENCIA'],
  local: { nombre: 'Resto Barranco', ciudad: 'Barranco · Lima', turno: 'Turno Noche' },
};
```

`app.jsx` lo consume asi:

```jsx
const D = window.DATA;

const initStore = () => ({
  mesas: D.mesas.map((m) => ({ ...m })),
  pedidos: D.pedidos.map((p) => ({ ...p, canal: p.canal || 'SALON', items: p.items.map((i) => ({ ...i })) })),
  cuentas: JSON.parse(JSON.stringify(D.cuentas)),
  productos: D.productos.map((p) => ({ ...p })),
  reservas: D.reservas.map((r) => ({ ...r })),
  transacciones: D.transacciones.map((t) => ({ ...t })),
  usuarios: D.usuarios.map((u) => ({ ...u })),
  notifs: D.notificaciones.map((n) => ({ ...n })),
  correlativo: { BOLETA: 1245, FACTURA: 318 },
});
```

Otros modulos leen el global con el mismo patron:

```jsx
const D = window.DATA;
```

Archivos donde aparece:

```text
apps/pwa-cliente/src/app/app.jsx
apps/pwa-cliente/src/app/commerce.jsx
apps/pwa-cliente/src/app/data.jsx
apps/pwa-cliente/src/app/screens-admin.jsx
apps/pwa-cliente/src/app/screens-money.jsx
apps/pwa-cliente/src/app/screens-ops.jsx
```

Ejemplo de mock actual para mesas:

```js
const mesas = [
  { n: '01', estado: 'LIBRE', cap: 4, zona: 'Salón' },
  { n: '02', estado: 'OCUPADA', cap: 4, zona: 'Salón', total: 84.5, pend: 1, min: 42, cuenta: 'CTA-118', mozo: 'Lucía' },
  { n: '03', estado: 'OCUPADA', cap: 2, zona: 'Salón', total: 60, pend: 0, min: 18, cuenta: 'CTA-121', mozo: 'Lucía' },
];
```

Ejemplo de mock actual para pedidos:

```js
const pedidos = [
  { id: 'PED-2041', mesa: '06', estado: 'PENDIENTE', area: 'COCINA', mozo: 'Diego', min: 14, items: [{ q: 2, n: 'Lomo Saltado' }, { q: 1, n: 'Arroz con Mariscos', note: 'Sin culantro' }, { q: 1, n: 'Ceviche Clásico' }] },
  { id: 'PED-2040', mesa: '06', estado: 'PENDIENTE', area: 'BARRA', mozo: 'Diego', min: 14, items: [{ q: 3, n: 'Pisco Sour' }, { q: 2, n: 'Chicha Morada (jarra)' }] },
];
```

## Respuestas reales de la API

Capturadas contra Kong local con `Authorization: Bearer <token>`:

```text
POST http://localhost:8000/identidad/auth/login
GET  http://localhost:8000/mesas
GET  http://localhost:8000/pedidos
```

Nota: la base local tiene muchos registros de pruebas/stress. Por eso se muestran los primeros elementos y el total capturado.

### `GET /mesas`

Status: `200`

Total capturado: `91104` mesas

```json
{
  "mesas": [
    {
      "id": "51aef76b-28f2-43a7-9ead-6519adf7defe",
      "numero": 1,
      "capacidad": 2,
      "ubicacion": "Salón Principal",
      "estado": "LIBRE",
      "cuentaAsociada": null,
      "createdAt": "2026-05-29T20:44:31.736Z",
      "updatedAt": "2026-05-31T22:46:26.288Z"
    },
    {
      "id": "c13d4619-3901-4fac-bdd6-0940481f2c9d",
      "numero": 2,
      "capacidad": 2,
      "ubicacion": "Salón Principal",
      "estado": "LIBRE",
      "cuentaAsociada": null,
      "createdAt": "2026-05-29T20:44:31.764Z",
      "updatedAt": "2026-05-31T22:46:03.019Z"
    },
    {
      "id": "a23d6b67-9011-48fa-8510-086e3024c2f5",
      "numero": 3,
      "capacidad": 4,
      "ubicacion": "Salón Principal",
      "estado": "LIBRE",
      "cuentaAsociada": null,
      "createdAt": "2026-05-29T20:44:31.784Z",
      "updatedAt": "2026-05-31T22:46:10.006Z"
    }
  ]
}
```

### `GET /pedidos`

Status: `200`

Total capturado: `75785` pedidos

```json
{
  "pedidos": [
    {
      "id": "d2852fae-ac72-45f3-9362-1377003d20db",
      "mesaId": "d93d2d3f-240b-45b4-9de4-a6645db707fc",
      "numeroMesa": 1267843261,
      "estado": "PENDIENTE",
      "total": 7.5,
      "createdAt": "2026-05-31T22:52:30.022Z",
      "items": [
        {
          "id": "ab879455-f0c9-4325-a5f4-2c29f7023c65",
          "productoId": "3bf68a1d-8c34-4e1e-817a-987acc81243e",
          "nombre": "QA Producto-1780267927817-kfr3yl",
          "cantidad": 1,
          "precioUnitario": 7.5,
          "area": "COCINA",
          "estado": "PENDIENTE",
          "modificadores": []
        }
      ]
    },
    {
      "id": "a4d27259-6aa1-4397-847f-650ec92666e4",
      "mesaId": "2b62ba31-3af5-4bf7-8ec5-a745e8c0556b",
      "numeroMesa": 1267843268,
      "estado": "PENDIENTE",
      "total": 7.5,
      "createdAt": "2026-05-31T22:52:30.007Z",
      "items": [
        {
          "id": "138e397b-14fe-487e-b11b-50d64797af95",
          "productoId": "3bf68a1d-8c34-4e1e-817a-987acc81243e",
          "nombre": "QA Producto-1780267927817-kfr3yl",
          "cantidad": 1,
          "precioUnitario": 7.5,
          "area": "COCINA",
          "estado": "PENDIENTE",
          "modificadores": []
        }
      ]
    }
  ]
}
```

## `package.json`

### `apps/pwa-cliente/package.json`

Este package local no declara dependencias propias. Hereda las librerias desde el `package.json` raiz del workspace.

```json
{
  "name": "@org/pwa-cliente",
  "version": "0.0.1",
  "private": true,
  "nx": {
    "name": "pwa-cliente",
    "tags": [
      "frontend",
      "pwa"
    ]
  }
}
```

### `package.json` raiz

Librerias relevantes ya disponibles para el frontend:

```json
{
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "axios": "^1.6.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "socket.io-client": "^4.8.3",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@nx/react": "^22.7.5",
    "@nx/vite": "^22.7.5",
    "@nx/web": "^22.7.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^6.0.0",
    "typescript": "~5.9.2",
    "vite": "^8.0.0",
    "vitest": "~4.1.0"
  }
}
```

Package manager detectado: `npm` (`package-lock.json` presente).
