// utils/theme.ts — sincroniza la <meta name="theme-color"> con el tema activo,
// para que la barra del navegador / status bar móvil coincida con la app.

export type Theme = 'light' | 'dark';

// Coinciden con --bg de cada tema en styles.css.
const THEME_COLOR: Record<Theme, string> = {
  light: '#ffffff',
  dark: '#0d0f13',
};

export function applyThemeColor(theme: Theme): void {
  const meta = document.getElementById('meta-theme-color');
  if (meta) meta.setAttribute('content', THEME_COLOR[theme]);
}
