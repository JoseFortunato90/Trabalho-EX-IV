import { useMutation } from "@tanstack/react-query"
import { ListChecksIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

import { ErrorAlert } from "@/components/shared/error-alert"
import { PageHeader } from "@/components/shared/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DocumentReference } from "@/features/documents/components/document-reference"
import { generateQuestions } from "@/features/questions/api"
import { QuestionForm } from "@/features/questions/components/question-form"
import { QuestionsResult } from "@/features/questions/components/questions-result"
import {
  buildQuestionTypes,
  type QuestionFormValues,
} from "@/features/questions/schemas"
import { normalizeApiError } from "@/lib/api-error"

export function QuestionsPage() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const generateMutation = useMutation({
    mutationFn: generateQuestions,
    onError: (error) => {
      toast.error(normalizeApiError(error).message)
    },
  })

  useEffect(() => {
    if (generateMutation.isSuccess) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [generateMutation.data, generateMutation.isSuccess])

  function handleSubmit(values: QuestionFormValues) {
    generateMutation.mutate({
      query: values.query,
      types: buildQuestionTypes(values),
    })
  }

  return (
    <>
      <PageHeader
        title="Gerar questões"
        description="Configure a consulta e a distribuição das questões. O contexto é recuperado automaticamente pelo RAG a partir do documento indexado."
      />

      <DocumentReference />

      <QuestionForm
        onSubmit={handleSubmit}
        isSubmitting={generateMutation.isPending}
      />

      {generateMutation.isError ? (
        <ErrorAlert
          error={generateMutation.error}
          title="Não foi possível gerar as questões"
        />
      ) : null}

      <div ref={resultsRef} className="scroll-mt-24">
        {generateMutation.isPending ? (
          <Card>
            <CardHeader>
              <CardTitle>Gerando questões</CardTitle>
              <CardDescription>
                O modelo pode levar alguns segundos para responder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ) : generateMutation.data ? (
          <section className="space-y-4" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-semibold">
                Questões geradas
              </h2>
              <p className="text-sm text-muted-foreground">
                {generateMutation.data.length}{" "}
                {generateMutation.data.length === 1 ? "questão" : "questões"}
              </p>
            </div>
            <QuestionsResult questions={generateMutation.data} />
          </section>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecksIcon className="size-4" />
                Resultado
              </CardTitle>
              <CardDescription>
                As questões geradas aparecerão aqui, com alternativas, gabarito,
                explicações e critérios de correção.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  )
}
