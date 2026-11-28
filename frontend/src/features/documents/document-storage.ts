import {
  type UploadedDocument,
  uploadedDocumentSchema,
} from "@/features/documents/schemas"

const STORAGE_KEY = "exam-generator:last-document"

export function loadStoredDocument(): UploadedDocument | null {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return null
    }

    const parsedValue = uploadedDocumentSchema.safeParse(JSON.parse(rawValue))

    return parsedValue.success ? parsedValue.data : null
  } catch {
    return null
  }
}

export function saveStoredDocument(document: UploadedDocument): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(document))
}

export function clearStoredDocument(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}
