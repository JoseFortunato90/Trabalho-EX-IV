import axios from "axios"

export interface NormalizedApiError {
  message: string
  details: string[]
}

interface FastApiValidationItem {
  loc?: Array<string | number>
  msg?: string
}

function extractDetail(data: unknown): { message?: string; details: string[] } {
  if (!data || typeof data !== "object") {
    return { details: [] }
  }

  const detail = (data as { detail?: unknown }).detail

  if (typeof detail === "string") {
    return { message: detail, details: [] }
  }

  if (Array.isArray(detail)) {
    const details = detail
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null
        }

        const { loc, msg } = item as FastApiValidationItem

        if (!msg) {
          return null
        }

        const field = Array.isArray(loc)
          ? loc
              .filter(
                (part): part is string =>
                  typeof part === "string" && !["body", "path"].includes(part),
              )
              .join(".")
          : ""

        return field ? `${field}: ${msg}` : msg
      })
      .filter((item): item is string => Boolean(item))

    return {
      message: details[0] ?? "Os dados enviados são inválidos.",
      details,
    }
  }

  return { details: [] }
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return {
        message:
          "A requisição excedeu o tempo limite. A geração pode demorar; tente novamente.",
        details: [],
      }
    }

    if (!error.response) {
      return {
        message:
          "Não foi possível conectar ao backend. Verifique se a API está em execução.",
        details: [],
      }
    }

    const detail = extractDetail(error.response.data)

    return {
      message:
        detail.message ??
        `A API retornou um erro inesperado (HTTP ${error.response.status}).`,
      details: detail.details,
    }
  }

  if (error instanceof Error) {
    return { message: error.message, details: [] }
  }

  return {
    message: "Ocorreu um erro inesperado. Tente novamente.",
    details: [],
  }
}
