import { describe, expect, it } from "vitest"

import {
  buildQuestionTypes,
  questionFormSchema,
  questionSchema,
} from "./schemas"

describe("question schemas", () => {
  it("monta a lista de tipos mantendo a ordem", () => {
    expect(
      buildQuestionTypes({ multiple_choice: 2, subjective: 1 }),
    ).toEqual(["multiple_choice", "multiple_choice", "subjective"])
  })

  it("rejeita formulário sem questões", () => {
    const result = questionFormSchema.safeParse({
      query: "Estruturas de dados",
      multiple_choice: 0,
      subjective: 0,
    })

    expect(result.success).toBe(false)
  })

  it("rejeita total acima de 50 questões", () => {
    const result = questionFormSchema.safeParse({
      query: "Estruturas de dados",
      multiple_choice: 30,
      subjective: 30,
    })

    expect(result.success).toBe(false)
  })

  it("aceita formulário válido", () => {
    const result = questionFormSchema.safeParse({
      query: "Estruturas de dados",
      multiple_choice: 3,
      subjective: 2,
    })

    expect(result.success).toBe(true)
  })

  it("rejeita questão objetiva incompleta", () => {
    const result = questionSchema.safeParse({
      type: "multiple_choice",
      statement: "Enunciado",
      alternatives: { A: "Alternativa" },
      correct_answer: "B",
    })

    expect(result.success).toBe(false)
  })
})
