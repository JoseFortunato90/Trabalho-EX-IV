import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  clearStoredDocument,
  loadStoredDocument,
  saveStoredDocument,
} from "./document-storage"
import type { UploadedDocument } from "./schemas"

interface DocumentContextValue {
  document: UploadedDocument | null
  setDocument: (document: UploadedDocument) => void
  clearDocument: () => void
}

const DocumentContext = createContext<DocumentContextValue | null>(null)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [document, setDocumentState] = useState<UploadedDocument | null>(() =>
    loadStoredDocument(),
  )

  const setDocument = useCallback((value: UploadedDocument) => {
    setDocumentState(value)
    saveStoredDocument(value)
  }, [])

  const clearDocument = useCallback(() => {
    setDocumentState(null)
    clearStoredDocument()
  }, [])

  const value = useMemo(
    () => ({ document, setDocument, clearDocument }),
    [clearDocument, document, setDocument],
  )

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
}

export function useDocument() {
  const context = useContext(DocumentContext)

  if (!context) {
    throw new Error("useDocument deve ser usado dentro de DocumentProvider.")
  }

  return context
}
