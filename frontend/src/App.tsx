import { RouterProvider } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { AppProviders } from "@/providers/app-providers"
import { router } from "@/routes/app-router"

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </AppProviders>
  )
}
