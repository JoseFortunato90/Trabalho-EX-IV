import { apiClient } from "@/lib/api-client"

import {
  type UploadDocumentResponse,
  uploadDocumentResponseSchema,
} from "./schemas"

export async function uploadDocument(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadDocumentResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await apiClient.post("/documents/upload", formData, {
    onUploadProgress: (event) => {
      if (!event.total) {
        return
      }

      onProgress?.(Math.round((event.loaded * 100) / event.total))
    },
  })

  return uploadDocumentResponseSchema.parse(response.data)
}
