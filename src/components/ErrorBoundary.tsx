import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// Deliberately has no dependency on i18n/context - it must still render a
// usable fallback if the error came from one of those.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("Unhandled error in time-tracking-app:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error">
          <p>Something went wrong. Reloading the page may fix it.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
