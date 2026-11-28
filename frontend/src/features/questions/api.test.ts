import { describe, expect, it } from "vitest"

import { generateQuestions } from "./api"

describe("generateQuestions", () => {
  it("envia os tipos solicitados e valida a resposta", async () => {
    const questions = await generateQuestions({
      query: "Herança e polimorfismo",
      types: ["multiple_choice", "subjective"],
    })

    expect(questions).toHaveLength(2)
    expect(questions[0]?.type).toBe("multiple_choice")
    expect(questions[0]?.correct_answer).toBe("A")
    expect(questions[1]?.type).toBe("subjective")
    expect(questions[1]?.grading_criteria).toHaveLength(2)
  })
})
