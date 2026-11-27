import { createBrowserRouter } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { RouteErrorPage } from "@/pages/route-error-page"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import("@/pages/home-page")

          return { Component: HomePage }
        },
      },
      {
        path: "upload",
        lazy: async () => {
          const { UploadPage } = await import("@/pages/upload-page")

          return { Component: UploadPage }
        },
      },
      {
        path: "questions",
        lazy: async () => {
          const { QuestionsPage } = await import("@/pages/questions-page")

          return { Component: QuestionsPage }
        },
      },
      {
        path: "exams",
        lazy: async () => {
          const { ExamsPage } = await import("@/pages/exams-page")

          return { Component: ExamsPage }
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { NotFoundPage } = await import("@/pages/not-found-page")

          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
