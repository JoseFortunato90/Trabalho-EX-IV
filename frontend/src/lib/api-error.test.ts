import { AxiosError, type AxiosResponse } from "axios"
import { describe, expect, it } from "vitest"

import { normalizeApiError } from "./api-error"

function createAxiosError(data: unknown, status = 422) {
  const response = {
    data,
    status,
    statusText: "",
    headers: {},
    config: {},
  } as AxiosResponse

  return new AxiosError(
    "Request failed",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    response,
  )
}

describe("normalizeApiError", () => {
  it("extrai mensagem de erro com detail em string", () => {
    const error = normalizeApiError(
      createAxiosError({ detail: "Arquivo inválido." }, 400),
    )

    expect(error.message).toBe("Arquivo inválido.")
    expect(error.details).toEqual([])
  })

  it("extrai mensagens de validação do FastAPI", () => {
    const error = normalizeApiError(
      createAxiosError({
        detail: [
          {
            loc: ["body", "query"],
            msg: "Field required",
            type: "missing",
          },
          {
            loc: ["body", "types"],
            msg: "Too few items",
            type: "too_short",
          },
        ],
      }),
    )

    expect(error.message).toBe("query: Field required")
    expect(error.details).toEqual([
      "query: Field required",
      "types: Too few items",
    ])
  })

  it("informa falha de conexão", () => {
    const error = normalizeApiError(
      new AxiosError("Network Error", "ERR_NETWORK"),
    )

    expect(error.message).toContain("Não foi possível conectar")
  })

  it("informa timeout", () => {
    const error = normalizeApiError(
      new AxiosError("Timeout", "ECONNABORTED"),
    )

    expect(error.message).toContain("tempo limite")
  })
})
