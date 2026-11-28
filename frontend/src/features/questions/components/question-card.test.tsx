import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { Question } from "@/features/questions/schemas"

import { QuestionCard } from "./question-card"

const multipleChoiceQuestion: Question = {
  type: "multiple_choice",
  statement: "Qual é a resposta correta?",
  alternatives: {
    A: "Alternativa correta",
    B: "Alternativa incorreta",
  },
  correct_answer: "A",
  explanation: "A alternativa A está correta.",
  expected_answer: null,
  grading_criteria: null,
}

const subjectiveQuestion: Question = {
  type: "subjective",
  statement: "Explique o conceito.",
  alternatives: null,
  correct_answer: null,
  explanation: null,
  expected_answer: "Resposta esperada.",
  grading_criteria: ["Critério 1", "Critério 2"],
}

describe("QuestionCard", () => {
  it("renderiza questão objetiva com gabarito", () => {
    render(<QuestionCard question={multipleChoiceQuestion} index={0} />)

    expect(screen.getByText("Questão 1")).toBeInTheDocument()
    expect(screen.getByText("Objetiva")).toBeInTheDocument()
    expect(screen.getByText("Alternativa correta")).toBeInTheDocument()
    expect(screen.getByText("Explicação")).toBeInTheDocument()
    expect(screen.getByText("A alternativa A está correta.")).toBeInTheDocument()
  })

  it("renderiza questão subjetiva com critérios", () => {
    render(<QuestionCard question={subjectiveQuestion} index={0} />)

    expect(screen.getByText("Subjetiva")).toBeInTheDocument()
    expect(screen.getByText("Resposta esperada")).toBeInTheDocument()
    expect(screen.getByText("Critério 1")).toBeInTheDocument()
  })

  it("oculta o gabarito quando solicitado", () => {
    render(
      <QuestionCard
        question={multipleChoiceQuestion}
        index={0}
        showAnswers={false}
      />,
    )

    expect(screen.queryByText("Explicação")).not.toBeInTheDocument()
  })
})
