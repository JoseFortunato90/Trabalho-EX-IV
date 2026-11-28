import { useMutation } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  FileTextIcon,
  FileUpIcon,
  Loader2Icon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react"
import { useRef, useState, type DragEvent, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { ErrorAlert } from "@/components/shared/error-alert"
import { PageHeader } from "@/components/shared/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { uploadDocument } from "@/features/documents/api"
import { useDocument } from "@/features/documents/document-context"
import {
  getFileExtension,
  MAX_UPLOAD_BYTES,
  validateUploadFile,
} from "@/features/documents/validation"
import { normalizeApiError } from "@/lib/api-error"
import { formatFileSize } from "@/lib/format"
import { cn } from "@/lib/utils"

export function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const { document, setDocument, clearDocument } = useDocument()

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(file, setProgress),
    onSuccess: (response) => {
      setDocument({
        documentId: response.document_id,
        filename: response.filename,
        chunksIndexed: response.chunks_indexed,
        uploadedAt: new Date().toISOString(),
      })
      setSelectedFile(null)
      setFileError(null)
      setProgress(0)

      if (inputRef.current) {
        inputRef.current.value = ""
      }

      toast.success("Documento indexado com sucesso.")
    },
    onError: (error) => {
      setProgress(0)
      toast.error(normalizeApiError(error).message)
    },
  })

  function selectFile(file: File) {
    const validationError = validateUploadFile(file)
    uploadMutation.reset()

    if (validationError) {
      setSelectedFile(null)
      setFileError(validationError)
      toast.error(validationError)
      return
    }

    setSelectedFile(file)
    setFileError(null)
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files.item(0)

    if (file) {
      selectFile(file)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedFile) {
      setFileError("Selecione um arquivo PDF ou TXT.")
      return
    }

    const validationError = validateUploadFile(selectedFile)

    if (validationError) {
      setFileError(validationError)
      return
    }

    uploadMutation.mutate(selectedFile)
  }

  function resetSelection() {
    setSelectedFile(null)
    setFileError(null)
    setProgress(0)
    uploadMutation.reset()

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const isUploading = uploadMutation.isPending
  const isProcessing = isUploading && progress >= 100
  const fileExtension = selectedFile ? getFileExtension(selectedFile.name) : ""

  return (
    <>
      <PageHeader
        title="Documento base"
        description="Envie um PDF ou TXT para ser processado, dividido em trechos e indexado na base vetorial utilizada pelo RAG."
      />

      {document ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2Icon className="size-4 text-emerald-600" />
              Documento atual
            </CardTitle>
            <CardDescription>
              Referência registrada neste navegador para o fluxo de geração.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-sm">
              <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">{document.filename}</p>
                <p className="text-muted-foreground">
                  {document.chunksIndexed} trechos indexados ·{" "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(document.uploadedAt))}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/questions">Gerar questões</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/exams">Gerar prova</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearDocument()
                  toast.info("Referência local removida.")
                }}
              >
                Remover referência
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Enviar arquivo</CardTitle>
          <CardDescription>
            Formatos aceitos: PDF e TXT. Tamanho máximo de 20 MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label
              htmlFor="document-file"
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors",
                "hover:border-foreground/30 hover:bg-muted/50",
                isDragging && "border-primary bg-primary/5",
                isUploading && "pointer-events-none opacity-60",
              )}
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-background ring-1 ring-foreground/10">
                <UploadCloudIcon className="size-6 text-muted-foreground" />
              </span>
              <span className="text-sm font-medium">
                Arraste o arquivo aqui ou clique para selecionar
              </span>
              <span className="text-xs text-muted-foreground">
                PDF ou TXT · até {formatFileSize(MAX_UPLOAD_BYTES)}
              </span>
              <input
                ref={inputRef}
                id="document-file"
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                className="sr-only"
                disabled={isUploading}
                onChange={(event) => {
                  const file = event.target.files?.item(0)

                  if (file) {
                    selectFile(file)
                  }
                }}
              />
            </label>

            {fileError ? (
              <Alert variant="destructive">
                <XIcon />
                <AlertTitle>Arquivo inválido</AlertTitle>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            ) : null}

            {selectedFile ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileTextIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)} · {fileExtension}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={resetSelection}
                  disabled={isUploading}
                  aria-label="Remover arquivo selecionado"
                >
                  <XIcon />
                </Button>
              </div>
            ) : null}

            {isUploading ? (
              <div className="space-y-2" aria-live="polite">
                <Progress value={isProcessing ? 100 : progress} />
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2Icon className="size-3.5 animate-spin" />
                  {isProcessing
                    ? "Processando e indexando o documento..."
                    : `Enviando arquivo... ${progress}%`}
                </p>
              </div>
            ) : null}

            {uploadMutation.isError ? (
              <ErrorAlert
                error={uploadMutation.error}
                title="Não foi possível enviar o documento"
              />
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={!selectedFile || isUploading}>
                {isUploading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <FileUpIcon />
                )}
                Enviar documento
              </Button>
              {selectedFile ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetSelection}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Alert>
        <UploadCloudIcon />
        <AlertTitle>Reenvio de arquivos</AlertTitle>
        <AlertDescription>
          Cada envio cria um novo identificador e novos trechos na base vetorial,
          mesmo que o conteúdo seja igual a um documento já indexado. Evite
          reenviar o mesmo arquivo sem necessidade.
        </AlertDescription>
      </Alert>
    </>
  )
}
