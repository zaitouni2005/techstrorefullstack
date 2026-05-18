import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">Oups !</h1>
            <p className="text-muted-foreground text-lg">
              Une erreur inattendue est survenue. Nos ingénieurs ont été prévenus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="rounded-2xl h-12 px-6 gap-2"
              >
                <RefreshCcw className="h-4 w-4" /> Recharger la page
              </Button>
              <Button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = "/";
                }}
                className="rounded-2xl h-12 px-6 gap-2 shadow-lg shadow-primary/20"
              >
                <Home className="h-4 w-4" /> Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
