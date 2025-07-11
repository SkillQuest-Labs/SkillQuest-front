import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { clerkConfig } from "./shared/config/auth-config.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <ClerkProvider publishableKey={clerkConfig.publishableKey} afterSignOutUrl="/sign-in">
        <App />
      </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>,
);
