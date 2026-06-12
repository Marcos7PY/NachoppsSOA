// components/ui/Scrim.tsx — Fondo oscurecido clicable de modales/drawers.
// Es un <button> nativo (no un div con onClick) para que el cierre sea accesible
// por teclado; queda fuera del orden de tabulación porque Escape ya cierra
// (useFocusTrap) y el botón X es el control visible.

interface ScrimProps {
  onClose: () => void;
  label?: string;
}

export function Scrim({ onClose, label = 'Cerrar' }: Readonly<ScrimProps>) {
  return (
    <button
      type="button"
      className="scrim"
      aria-label={label}
      tabIndex={-1}
      onClick={onClose}
      style={{ border: 'none', padding: 0, cursor: 'default', appearance: 'none' }}
    />
  );
}
