import { describe, expect, it } from "vitest"

import { examFormSchema } from "./schemas"

describe("exam schema", () => {
  it("exige que a distribuição some a quantidade total", () => {
    const result = examFormSchema.safeParse({
      title: "Prova de Estruturas de Dados",
      query: "Árvores binárias",
      quantity: 10,
      multiple_choice: 5,
      subjective: 2,
    })

    expect(result.success).toBe(false)
  })

  it("aceita distribuição válida", () => {
    const result = examFormSchema.safeParse({
      title: "Prova de Estruturas de Dados",
      query: "Árvores binárias",
      quantity: 10,
      multiple_choice: 7,
      subjective: 3,
    })

    expect(result.success).toBe(true)
  })
})
