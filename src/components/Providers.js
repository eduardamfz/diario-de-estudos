"use client";

// Liga o TanStack Query em todo o site.
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }) {
  const [cliente] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30 * 1000, retry: 1, refetchOnWindowFocus: false } },
      })
  );
  return <QueryClientProvider client={cliente}>{children}</QueryClientProvider>;
}
