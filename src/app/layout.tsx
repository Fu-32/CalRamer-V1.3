// src/app/layout.tsx

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { SupabaseProvider } from './supabase-provider';

export const metadata: Metadata = {
  title: 'Votre Application',
  description: 'Description de votre application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}