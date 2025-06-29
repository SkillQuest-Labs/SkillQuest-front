import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { clerkConfig } from "./shared/config/auth-config.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerkConfig.publishableKey}
      afterSignOutUrl="/sign-in"
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);
