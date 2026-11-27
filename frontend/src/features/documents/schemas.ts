import { z } from "zod"

export const uploadedDocumentSchema = z.object({
  documentId: z.string().min(1),
  filename: z.string().min(1),
  chunksIndexed: z.number().int().nonnegative(),
  uploadedAt: z
    .string()
    .min(1)
    .refine((value) => !Number.isNaN(Date.parse(value)), "Data inválida."),
})

export type UploadedDocument = z.infer<typeof uploadedDocumentSchema>

export const uploadDocumentResponseSchema = z.object({
  message: z.string(),
  document_id: z.string().min(1),
  filename: z.string().min(1),
  chunks_indexed: z.number().int().nonnegative(),
})

export type UploadDocumentResponse = z.infer<typeof uploadDocumentResponseSchema>
