import { isRouteErrorResponse, useRouteError } from "react-router-dom"

import { ErrorAlert } from "@/components/shared/error-alert"
import { Button } from "@/components/ui/button"

export function RouteErrorPage() {
  const error = useRouteError()
  const fallback = isRouteErrorResponse(error)
    ? new Error(error.statusText || "Rota não encontrada.")
    : error

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-4 px-4">
      <ErrorAlert error={fallback} title="Algo deu errado" />
      <Button asChild className="self-start">
        <a href="/">Voltar ao início</a>
      </Button>
    </div>
  )
}
