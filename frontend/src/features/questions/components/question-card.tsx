import { CheckIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Question, QuestionType } from "@/features/questions/schemas"
import { cn } from "@/lib/utils"

const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Objetiva",
  subjective: "Subjetiva",
}

interface QuestionCardProps {
  question: Question
  index: number
  showAnswers?: boolean
}

export function QuestionCard({
  question,
  index,
  showAnswers = true,
}: QuestionCardProps) {
  const alternatives = Object.entries(question.alternatives ?? {})

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Questão {index + 1}</CardTitle>
          <Badge variant="secondary">{TYPE_LABELS[question.type]}</Badge>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed">{question.statement}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.type === "multiple_choice" ? (
          <ul className="space-y-2">
            {alternatives.map(([letter, text]) => {
              const isCorrect =
                showAnswers && question.correct_answer === letter

              return (
                <li
                  key={letter}
                  className={cn(
                    "flex gap-3 rounded-lg border p-3 text-sm",
                    isCorrect && "border-emerald-500/50 bg-emerald-500/10",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      isCorrect &&
                        "border-emerald-600 bg-emerald-600 text-white",
                    )}
                  >
                    {isCorrect ? <CheckIcon className="size-3.5" /> : letter}
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              )
            })}
          </ul>
        ) : null}

        {showAnswers && question.explanation ? (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium">Explicação</p>
            <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
              {question.explanation}
            </p>
          </div>
        ) : null}

        {showAnswers && question.type === "subjective" ? (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <p className="font-medium">Resposta esperada</p>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {question.expected_answer}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Critérios de correção</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {question.grading_criteria?.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
