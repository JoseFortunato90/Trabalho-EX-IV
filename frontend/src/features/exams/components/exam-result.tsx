import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { QuestionsResult } from "@/features/questions/components/questions-result"
import type { ExamResponse } from "@/features/exams/schemas"

interface ExamResultProps {
  exam: ExamResponse
}

export function ExamResult({ exam }: ExamResultProps) {
  const [showAnswers, setShowAnswers] = useState(true)
  const multipleChoice = exam.questions.filter(
    (question) => question.type === "multiple_choice",
  )
  const subjective = exam.questions.filter(
    (question) => question.type === "subjective",
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{exam.title}</CardTitle>
            <CardDescription>
              {exam.questions.length}{" "}
              {exam.questions.length === 1 ? "questão" : "questões"} geradas
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAnswers((current) => !current)}
          >
            {showAnswers ? <EyeOffIcon /> : <EyeIcon />}
            {showAnswers ? "Ocultar gabarito" : "Mostrar gabarito"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary">{multipleChoice.length} objetivas</Badge>
          <Badge variant="secondary">{subjective.length} subjetivas</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todas ({exam.questions.length})</TabsTrigger>
            <TabsTrigger value="multiple_choice">
              Objetivas ({multipleChoice.length})
            </TabsTrigger>
            <TabsTrigger value="subjective">
              Subjetivas ({subjective.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="pt-4">
            <QuestionsResult
              questions={exam.questions}
              showAnswers={showAnswers}
            />
          </TabsContent>
          <TabsContent value="multiple_choice" className="pt-4">
            <QuestionsResult
              questions={multipleChoice}
              showAnswers={showAnswers}
            />
          </TabsContent>
          <TabsContent value="subjective" className="pt-4">
            <QuestionsResult
              questions={subjective}
              showAnswers={showAnswers}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
