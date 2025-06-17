// src/components/ClientLayoutWrapper.tsx
'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}