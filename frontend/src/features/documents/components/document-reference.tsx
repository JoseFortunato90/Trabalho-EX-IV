import { InfoIcon } from "lucide-react"
import { Link } from "react-router-dom"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useDocument } from "@/features/documents/document-context"

export function DocumentReference() {
  const { document } = useDocument()

  return (
    <Alert>
      <InfoIcon />
      <AlertTitle>Base de referência</AlertTitle>
      <AlertDescription>
        {document ? (
          <p>
            Último upload: <strong>{document.filename}</strong> (
            {document.chunksIndexed} trechos indexados). A busca do RAG considera
            todos os documentos indexados no backend, não apenas este arquivo.
          </p>
        ) : (
          <p>
            Nenhum documento foi enviado nesta sessão. A geração usará todo o
            conteúdo já indexado no backend.{" "}
            <Link to="/upload" className="font-medium text-foreground">
              Enviar um documento
            </Link>
            .
          </p>
        )}
      </AlertDescription>
    </Alert>
  )
}
