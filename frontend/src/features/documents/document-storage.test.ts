import { beforeEach, describe, expect, it } from "vitest"

import {
  clearStoredDocument,
  loadStoredDocument,
  saveStoredDocument,
} from "./document-storage"

const document = {
  documentId: "doc-1",
  filename: "material.pdf",
  chunksIndexed: 10,
  uploadedAt: "2026-01-01T10:00:00.000Z",
}

describe("document storage", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("salva e recupera os metadados do documento", () => {
    saveStoredDocument(document)

    expect(loadStoredDocument()).toEqual(document)
  })

  it("remove os metadados", () => {
    saveStoredDocument(document)
    clearStoredDocument()

    expect(loadStoredDocument()).toBeNull()
  })

  it("ignora conteúdo inválido", () => {
    window.localStorage.setItem("exam-generator:last-document", "{invalid")

    expect(loadStoredDocument()).toBeNull()
  })
})
