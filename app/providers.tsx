'use client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from '../context/AuthContext';
import { NotificationsProvider } from '../context/NotificationsContext';
import { I18nProvider } from '../context/I18nContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="flatmate-theme"
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </I18nProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}
