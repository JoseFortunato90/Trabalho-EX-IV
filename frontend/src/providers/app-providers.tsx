import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { DocumentProvider } from "@/features/documents/document-context"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </DocumentProvider>
    </QueryClientProvider>
  )
}
