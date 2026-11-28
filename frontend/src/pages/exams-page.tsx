import { useMutation } from "@tanstack/react-query"
import { NotebookPenIcon } from "lucide-react"
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
import { generateExam } from "@/features/exams/api"
import { ExamForm } from "@/features/exams/components/exam-form"
import { ExamResult } from "@/features/exams/components/exam-result"
import type { ExamFormValues } from "@/features/exams/schemas"
import { normalizeApiError } from "@/lib/api-error"

export function ExamsPage() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const generateMutation = useMutation({
    mutationFn: generateExam,
    onError: (error) => {
      toast.error(normalizeApiError(error).message)
    },
  })

  useEffect(() => {
    if (generateMutation.isSuccess) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [generateMutation.data, generateMutation.isSuccess])

  function handleSubmit(values: ExamFormValues) {
    generateMutation.mutate(values)
  }

  return (
    <>
      <PageHeader
        title="Gerar prova"
        description="Monte uma prova completa com título, quantidade total e distribuição entre questões objetivas e subjetivas."
      />

      <DocumentReference />

      <ExamForm onSubmit={handleSubmit} isSubmitting={generateMutation.isPending} />

      {generateMutation.isError ? (
        <ErrorAlert
          error={generateMutation.error}
          title="Não foi possível gerar a prova"
        />
      ) : null}

      <div ref={resultsRef} className="scroll-mt-24">
        {generateMutation.isPending ? (
          <Card>
            <CardHeader>
              <CardTitle>Gerando prova</CardTitle>
              <CardDescription>
                O modelo pode levar alguns segundos para responder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ) : generateMutation.data ? (
          <section aria-live="polite">
            <ExamResult exam={generateMutation.data} />
          </section>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NotebookPenIcon className="size-4" />
                Resultado
              </CardTitle>
              <CardDescription>
                A prova gerada aparecerá aqui, com as questões organizadas por
                tipo e a opção de exibir ou ocultar o gabarito.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  )
}
