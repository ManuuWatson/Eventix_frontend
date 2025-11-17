// src/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes (data considered fresh)
      gcTime: 10 * 60 * 1000,     // 10 minutes (kept in cache before garbage collected)
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
