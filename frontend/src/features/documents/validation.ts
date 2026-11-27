export const ALLOWED_EXTENSIONS = [".pdf", ".txt"] as const
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".")

  if (lastDot === -1) {
    return ""
  }

  return filename.slice(lastDot).toLowerCase()
}

export function validateUploadFile(file: File): string | null {
  const extension = getFileExtension(file.name)

  if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
    return "Formato não suportado. Envie um arquivo PDF ou TXT."
  }

  if (file.size === 0) {
    return "O arquivo enviado está vazio."
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return "O arquivo excede o limite de 20 MB."
  }

  return null
}
