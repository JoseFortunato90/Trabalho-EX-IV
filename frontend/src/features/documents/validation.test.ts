import { describe, expect, it } from "vitest"

import {
  getFileExtension,
  validateUploadFile,
} from "./validation"

describe("document validation", () => {
  it("extrai a extensão em minúsculas", () => {
    expect(getFileExtension("Material.PDF")).toBe(".pdf")
    expect(getFileExtension("arquivo-sem-extensao")).toBe("")
  })

  it("aceita PDF e TXT não vazios", () => {
    expect(
      validateUploadFile(new File(["conteúdo"], "material.pdf")),
    ).toBeNull()
    expect(validateUploadFile(new File(["conteúdo"], "material.txt"))).toBeNull()
  })

  it("rejeita formatos não suportados", () => {
    expect(validateUploadFile(new File(["conteúdo"], "material.docx"))).toBe(
      "Formato não suportado. Envie um arquivo PDF ou TXT.",
    )
  })

  it("rejeita arquivo vazio", () => {
    expect(validateUploadFile(new File([], "material.pdf"))).toBe(
      "O arquivo enviado está vazio.",
    )
  })
})
