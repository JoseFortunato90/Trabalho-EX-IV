import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, SparklesIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { CountField } from "@/components/shared/count-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  questionFormSchema,
  type QuestionFormValues,
} from "@/features/questions/schemas"

interface QuestionFormProps {
  onSubmit: (values: QuestionFormValues) => void
  isSubmitting: boolean
}

export function QuestionForm({ onSubmit, isSubmitting }: QuestionFormProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      query: "",
      multiple_choice: 5,
      subjective: 2,
    },
  })

  const multipleChoice = form.watch("multiple_choice")
  const subjective = form.watch("subjective")
  const total = multipleChoice + subjective

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar questões</CardTitle>
        <CardDescription>
          A consulta é usada para recuperar os trechos mais relevantes do
          conteúdo indexado antes da geração.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="question-query">Tema ou consulta</Label>
            <Textarea
              id="question-query"
              placeholder="Ex.: conceitos de herança e polimorfismo em orientação a objetos"
              rows={3}
              disabled={isSubmitting}
              aria-invalid={Boolean(form.formState.errors.query)}
              {...form.register("query")}
            />
            {form.formState.errors.query ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.query.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Descreva o assunto que deve orientar a busca no documento.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="multiple-choice-count">Questões objetivas</Label>
              <Controller
                control={form.control}
                name="multiple_choice"
                render={({ field }) => (
                  <CountField
                    id="multiple-choice-count"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjective-count">Questões subjetivas</Label>
              <Controller
                control={form.control}
                name="subjective"
                render={({ field }) => (
                  <CountField
                    id="subjective-count"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              Total solicitado
            </p>
            <Badge variant={total >= 1 && total <= 50 ? "secondary" : "destructive"}>
              {total} {total === 1 ? "questão" : "questões"}
            </Badge>
          </div>

          {form.formState.errors.multiple_choice ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.multiple_choice.message}
            </p>
          ) : null}
          {form.formState.errors.subjective ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.subjective.message}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SparklesIcon />
            )}
            Gerar questões
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
