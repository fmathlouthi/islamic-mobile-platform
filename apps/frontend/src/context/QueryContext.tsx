import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider as BaseQueryProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryContextProps {
  children: ReactNode;
}

export function QueryContextProvider({ children }: QueryContextProps) {
  return (
    <BaseQueryProvider client={queryClient}>
      {children}
    </BaseQueryProvider>
  );
}
