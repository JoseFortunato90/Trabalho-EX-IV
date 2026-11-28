import { FileTextIcon, FileX2Icon } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { useDocument } from "@/features/documents/document-context"

export function DocumentBadge() {
  const { document } = useDocument()

  if (!document) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <FileX2Icon />
        Nenhum documento
      </Badge>
    )
  }

  return (
    <Link to="/upload" aria-label={`Documento atual: ${document.filename}`}>
      <Badge variant="secondary" className="max-w-56 gap-1.5">
        <FileTextIcon className="shrink-0" />
        <span className="truncate">{document.filename}</span>
      </Badge>
    </Link>
  )
}
