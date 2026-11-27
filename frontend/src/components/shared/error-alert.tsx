import { CircleAlertIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { normalizeApiError } from "@/lib/api-error"

interface ErrorAlertProps {
  error: unknown
  title?: string
}

export function ErrorAlert({
  error,
  title = "Não foi possível concluir a operação",
}: ErrorAlertProps) {
  const normalizedError = normalizeApiError(error)

  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{normalizedError.message}</p>
        {normalizedError.details.length > 1 ? (
          <ul className="mt-2 list-disc space-y-1 pl-4">
            {normalizedError.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}
