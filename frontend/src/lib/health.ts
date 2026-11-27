import { z } from "zod"

import { apiClient } from "@/lib/api-client"

const healthResponseSchema = z.object({
  message: z.string(),
})

export async function getHealth() {
  const response = await apiClient.get("/", { timeout: 8_000 })

  return healthResponseSchema.parse(response.data)
}
