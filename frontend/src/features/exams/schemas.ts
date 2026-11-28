import { z } from "zod"

import { questionSchema } from "@/features/questions/schemas"

export const examFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Informe um título com pelo menos 3 caracteres.")
      .max(150, "O título deve ter no máximo 150 caracteres."),
    query: z
      .string()
      .trim()
      .min(3, "Informe um tema ou consulta com pelo menos 3 caracteres.")
      .max(500, "A consulta deve ter no máximo 500 caracteres."),
    quantity: z
      .number()
      .int("Informe um número inteiro.")
      .min(1, "A prova deve ter pelo menos uma questão.")
      .max(50, "O máximo é 50 questões."),
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
    if (values.multiple_choice + values.subjective !== values.quantity) {
      context.addIssue({
        code: "custom",
        message:
          "A soma das questões objetivas e subjetivas deve ser igual à quantidade total.",
        path: ["subjective"],
      })
    }
  })

export type ExamFormValues = z.infer<typeof examFormSchema>
export type ExamRequest = ExamFormValues

export const examResponseSchema = z.object({
  title: z.string(),
  questions: z.array(questionSchema),
})

export type ExamResponse = z.infer<typeof examResponseSchema>
