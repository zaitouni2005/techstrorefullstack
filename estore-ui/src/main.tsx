import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";

const rootElement = document.getElementById("root");

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ErrorBoundary>
      </StrictMode>,
    );
  }
});
