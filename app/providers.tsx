"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "../context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="flatmate-theme">
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
}
