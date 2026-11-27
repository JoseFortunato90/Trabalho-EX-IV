import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon, NotebookPenIcon } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  examFormSchema,
  type ExamFormValues,
} from "@/features/exams/schemas"

interface ExamFormProps {
  onSubmit: (values: ExamFormValues) => void
  isSubmitting: boolean
}

export function ExamForm({ onSubmit, isSubmitting }: ExamFormProps) {
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: "",
      query: "",
      quantity: 10,
      multiple_choice: 7,
      subjective: 3,
    },
  })

  function handleQuantityChange(value: number) {
    const multipleChoice = Math.min(form.getValues("multiple_choice"), value)

    form.setValue("quantity", value, { shouldValidate: true })
    form.setValue("multiple_choice", multipleChoice, { shouldValidate: true })
    form.setValue("subjective", value - multipleChoice, { shouldValidate: true })
  }

  function handleMultipleChoiceChange(value: number) {
    const quantity = form.getValues("quantity")
    const multipleChoice = Math.min(value, quantity)

    form.setValue("multiple_choice", multipleChoice, { shouldValidate: true })
    form.setValue("subjective", quantity - multipleChoice, { shouldValidate: true })
  }

  function handleSubjectiveChange(value: number) {
    const quantity = form.getValues("quantity")
    const subjective = Math.min(value, quantity)

    form.setValue("subjective", subjective, { shouldValidate: true })
    form.setValue("multiple_choice", quantity - subjective, { shouldValidate: true })
  }

  const quantity = form.watch("quantity")
  const multipleChoice = form.watch("multiple_choice")
  const subjective = form.watch("subjective")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar prova</CardTitle>
        <CardDescription>
          Defina o título, a consulta de busca e a distribuição das questões. A
          quantidade de um tipo é ajustada automaticamente ao alterar o outro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="exam-title">Título da prova</Label>
            <Input
              id="exam-title"
              placeholder="Ex.: Avaliação de Estruturas de Dados"
              disabled={isSubmitting}
              aria-invalid={Boolean(form.formState.errors.title)}
              {...form.register("title")}
            />
            {form.formState.errors.title ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-query">Tema ou consulta</Label>
            <Textarea
              id="exam-query"
              placeholder="Ex.: árvores binárias de busca e complexidade das operações"
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
                Descreva o assunto que deve orientar a recuperação no documento.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-quantity">Quantidade total</Label>
            <Controller
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <CountField
                  id="exam-quantity"
                  value={field.value}
                  onChange={handleQuantityChange}
                  min={1}
                  disabled={isSubmitting}
                />
              )}
            />
            {form.formState.errors.quantity ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.quantity.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam-multiple-choice">Questões objetivas</Label>
              <Controller
                control={form.control}
                name="multiple_choice"
                render={({ field }) => (
                  <CountField
                    id="exam-multiple-choice"
                    value={field.value}
                    onChange={handleMultipleChoiceChange}
                    max={quantity}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam-subjective">Questões subjetivas</Label>
              <Controller
                control={form.control}
                name="subjective"
                render={({ field }) => (
                  <CountField
                    id="exam-subjective"
                    value={field.value}
                    onChange={handleSubjectiveChange}
                    max={quantity}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">Distribuição</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{multipleChoice} objetivas</Badge>
              <Badge variant="secondary">{subjective} subjetivas</Badge>
              <Badge variant="outline">{quantity} no total</Badge>
            </div>
          </div>

          {form.formState.errors.subjective ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.subjective.message}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <NotebookPenIcon />
            )}
            Gerar prova
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
