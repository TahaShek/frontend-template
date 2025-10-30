import { AbilityProvider } from './features/authorization';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './features/realtime/context/SocketProvider';
import { AppRoutes } from './app/routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AbilityProvider>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <SocketProvider>
          <AppRoutes />
          <Toaster richColors closeButton position="top-right" />
        </SocketProvider>
      </ThemeProvider>
    </AbilityProvider>
  );
}