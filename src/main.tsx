import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoutes } from "./app/routes/AppRoutes.tsx";
import { setupAxiosInterceptors } from "./lib/axios";
import { AbacProvider } from "./features/authorization";
import { policyEngine, defaultPolicies } from "./features/authorization";
import { DevUserSwitcher } from "./features/auth";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./features/realtime/context/SocketProvider.tsx";

// Initialize axios interceptors
setupAxiosInterceptors();

// Initialize ABAC policies
policyEngine.addPolicies(defaultPolicies);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <AbacProvider>
        <AppRoutes />
        <DevUserSwitcher />
      </AbacProvider>
    </ThemeProvider>
    </SocketProvider>
  </StrictMode>
);
