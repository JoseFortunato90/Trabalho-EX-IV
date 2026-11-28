import {
  BookOpenCheckIcon,
  FileUpIcon,
  HomeIcon,
  ListChecksIcon,
  NotebookPenIcon,
} from "lucide-react"
import { Suspense } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"

import { DocumentBadge } from "@/components/layout/document-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const navigationItems = [
  { to: "/", label: "Início", icon: HomeIcon, end: true },
  { to: "/upload", label: "Documento", icon: FileUpIcon },
  { to: "/questions", label: "Questões", icon: ListChecksIcon },
  { to: "/exams", label: "Provas", icon: NotebookPenIcon },
]

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpenCheckIcon className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block font-heading text-sm font-semibold">
                  Exam Generator
                </span>
                <span className="block text-xs text-muted-foreground">
                  Questões e provas com RAG
                </span>
              </span>
            </Link>
            <div className="lg:hidden">
              <DocumentBadge />
            </div>
          </div>

          <nav
            aria-label="Navegação principal"
            className="flex items-center gap-1 overflow-x-auto rounded-lg bg-muted p-1"
          >
            {navigationItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/10"
                        : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                    )
                  }
                >
                  <Icon className="size-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="hidden lg:block">
            <DocumentBadge />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
        <Suspense
          fallback={
            <div className="space-y-4" aria-label="Carregando página">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t bg-background/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          Projeto acadêmico com React, Tailwind CSS e shadcn/ui. Backend FastAPI,
          RAG e Qwen.
        </div>
      </footer>
    </div>
  )
}
