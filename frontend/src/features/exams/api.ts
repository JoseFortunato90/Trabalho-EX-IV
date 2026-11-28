import { apiClient } from "@/lib/api-client"

import {
  type ExamRequest,
  type ExamResponse,
  examFormSchema,
  examResponseSchema,
} from "./schemas"

export async function generateExam(request: ExamRequest): Promise<ExamResponse> {
  const payload = examFormSchema.parse(request)
  const response = await apiClient.post("/exams/generate", payload)

  return examResponseSchema.parse(response.data)
}
