import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  moduleName: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Error en ${this.props.moduleName}`, error, info);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="empty">
        <div className="e-ic">
          <AlertIcon />
        </div>
        <h3>{this.props.moduleName}</h3>
        <p>Este módulo encontró un error inesperado.</p>
        <button className="btn btn-primary" onClick={() => this.setState({ hasError: false })}>
          Reintentar
        </button>
      </div>
    );
  }
}

function AlertIcon() {
  return (
    <svg className="ic" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
