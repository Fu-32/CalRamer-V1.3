// src/app/supabase-provider.tsx

'use client';

import { ReactNode } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '../lib/supabaseClient';

export function SupabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}