import { describe, expect, it } from "vitest"

import { generateExam } from "./api"

describe("generateExam", () => {
  it("envia a distribuição e valida a prova retornada", async () => {
    const exam = await generateExam({
      title: "Avaliação de Estruturas de Dados",
      query: "Árvores binárias de busca",
      quantity: 3,
      multiple_choice: 2,
      subjective: 1,
    })

    expect(exam.title).toBe("Avaliação de Estruturas de Dados")
    expect(exam.questions).toHaveLength(3)
    expect(exam.questions.filter((question) => question.type === "subjective")).toHaveLength(1)
  })
})
