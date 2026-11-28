import { z } from "zod"

import { apiClient } from "@/lib/api-client"

import {
  batchQuestionRequestSchema,
  type BatchQuestionRequest,
  type Question,
  questionSchema,
} from "./schemas"

const questionsResponseSchema = z.array(questionSchema)

export async function generateQuestions(
  request: BatchQuestionRequest,
): Promise<Question[]> {
  const payload = batchQuestionRequestSchema.parse(request)
  const response = await apiClient.post("/questions/generate", payload)

  return questionsResponseSchema.parse(response.data)
}
