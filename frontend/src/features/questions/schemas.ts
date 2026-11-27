import { z } from "zod"

export const questionTypeSchema = z.enum(["multiple_choice", "subjective"])

export type QuestionType = z.infer<typeof questionTypeSchema>

export const questionSchema = z
  .object({
    type: questionTypeSchema,
    statement: z.string().min(1),
    alternatives: z.record(z.string(), z.string()).nullish(),
    correct_answer: z.string().nullish(),
    explanation: z.string().nullish(),
    expected_answer: z.string().nullish(),
    grading_criteria: z.array(z.string()).nullish(),
  })
  .superRefine((question, context) => {
    if (question.type === "multiple_choice") {
      if (!question.alternatives || Object.keys(question.alternatives).length === 0) {
        context.addIssue({
          code: "custom",
          message: "A questão objetiva não possui alternativas.",
          path: ["alternatives"],
        })
      }

      if (!question.correct_answer) {
        context.addIssue({
          code: "custom",
          message: "A questão objetiva não possui resposta correta.",
          path: ["correct_answer"],
        })
      } else if (
        question.alternatives &&
        !(question.correct_answer in question.alternatives)
      ) {
        context.addIssue({
          code: "custom",
          message: "A resposta correta não corresponde a uma alternativa.",
          path: ["correct_answer"],
        })
      }

      return
    }

    if (!question.expected_answer) {
      context.addIssue({
        code: "custom",
        message: "A questão subjetiva não possui resposta esperada.",
        path: ["expected_answer"],
      })
    }

    if (!question.grading_criteria || question.grading_criteria.length === 0) {
      context.addIssue({
        code: "custom",
        message: "A questão subjetiva não possui critérios de correção.",
        path: ["grading_criteria"],
      })
    }
  })

export type Question = z.infer<typeof questionSchema>

export const batchQuestionRequestSchema = z.object({
  query: z.string().trim().min(1).max(500),
  types: z.array(questionTypeSchema).min(1).max(50),
})

export type BatchQuestionRequest = z.infer<typeof batchQuestionRequestSchema>

export const questionFormSchema = z
  .object({
    query: z
      .string()
      .trim()
      .min(3, "Informe um tema ou consulta com pelo menos 3 caracteres.")
      .max(500, "A consulta deve ter no máximo 500 caracteres."),
    multiple_choice: z
      .number()
      .int("Informe um número inteiro.")
      .min(0, "A quantidade não pode ser negativa.")
      .max(50, "O máximo é 50 questões."),
    subjective: z
      .number()
      .int("Informe um número inteiro.")
      .min(0, "A quantidade não pode ser negativa.")
      .max(50, "O máximo é 50 questões."),
  })
  .superRefine((values, context) => {
    const total = values.multiple_choice + values.subjective

    if (total < 1) {
      context.addIssue({
        code: "custom",
        message: "Solicite pelo menos uma questão.",
        path: ["multiple_choice"],
      })
    }

    if (total > 50) {
      context.addIssue({
        code: "custom",
        message: "O total de questões deve ser no máximo 50.",
        path: ["subjective"],
      })
    }
  })

export type QuestionFormValues = z.infer<typeof questionFormSchema>

export function buildQuestionTypes(values: {
  multiple_choice: number
  subjective: number
}): QuestionType[] {
  return [
    ...Array.from(
      { length: values.multiple_choice },
      (): QuestionType => "multiple_choice",
    ),
    ...Array.from(
      { length: values.subjective },
      (): QuestionType => "subjective",
    ),
  ]
}
