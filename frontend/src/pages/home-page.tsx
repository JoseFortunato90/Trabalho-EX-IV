import { useQuery } from "@tanstack/react-query"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FileTextIcon,
  FileUpIcon,
  ListChecksIcon,
  NotebookPenIcon,
  ServerOffIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDocument } from "@/features/documents/document-context"
import { getHealth } from "@/lib/health"

const flowCards = [
  {
    to: "/upload",
    icon: FileUpIcon,
    title: "Enviar documento",
    description:
      "Carregue um PDF ou TXT para servir de base ao mecanismo de busca do RAG.",
    action: "Enviar arquivo",
  },
  {
    to: "/questions",
    icon: ListChecksIcon,
    title: "Gerar questões",
    description:
      "Escolha a quantidade de questões objetivas e subjetivas e receba o gabarito.",
    action: "Gerar questões",
  },
  {
    to: "/exams",
    icon: NotebookPenIcon,
    title: "Gerar prova",
    description:
      "Monte uma prova completa com título, distribuição por tipo e gabarito.",
    action: "Gerar prova",
  },
]

export function HomePage() {
  const { document } = useDocument()
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    retry: 1,
  })

  const isBackendOnline = healthQuery.isSuccess

  return (
    <>
      <PageHeader
        title="Painel de geração"
        description="Envie o material da disciplina e utilize o conteúdo indexado para criar questões e provas com apoio de RAG e LLM."
        actions={
          <Badge variant={isBackendOnline ? "secondary" : "destructive"}>
            {isBackendOnline ? (
              <CheckCircle2Icon />
            ) : (
              <ServerOffIcon />
            )}
            {healthQuery.isPending
              ? "Verificando API"
              : isBackendOnline
                ? "API conectada"
                : "API indisponível"}
          </Badge>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Documento de referência</CardTitle>
          <CardDescription>
            O frontend acompanha o último upload deste navegador. O backend
            recupera contexto de todos os documentos indexados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {document ? (
            <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">{document.filename}</p>
                  <p className="text-muted-foreground">
                    {document.chunksIndexed} trechos indexados em{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(document.uploadedAt))}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/upload">Ver documento</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                Nenhum upload registrado neste navegador. Comece enviando um
                PDF ou TXT.
              </p>
              <Button asChild size="sm">
                <Link to="/upload">
                  <FileUpIcon />
                  Enviar documento
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {flowCards.map((card) => {
          const Icon = card.icon

          return (
            <Card key={card.to} className="flex flex-col">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto bg-transparent">
                <Button asChild variant="outline" className="w-full">
                  <Link to={card.to}>
                    {card.action}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como funciona</CardTitle>
          <CardDescription>
            O fluxo usa os endpoints existentes do backend, sem autenticação ou
            persistência de aprovações nesta etapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-4 text-sm md:grid-cols-4">
            {[
              "Envie o documento para indexação no ChromaDB.",
              "Informe um tema ou consulta para a busca semântica.",
              "Configure a quantidade e os tipos de questão.",
              "Revise as questões e o gabarito apresentados.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  )
}
