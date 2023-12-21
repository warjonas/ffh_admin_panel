'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';

interface ProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: ProviderProps) {
  return <UserProvider>{children}</UserProvider>;
}
