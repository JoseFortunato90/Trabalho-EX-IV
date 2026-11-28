import { QuestionCard } from "./question-card"
import type { Question } from "@/features/questions/schemas"

interface QuestionsResultProps {
  questions: Question[]
  showAnswers?: boolean
}

export function QuestionsResult({
  questions,
  showAnswers = true,
}: QuestionsResultProps) {
  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <QuestionCard
          key={`${index}-${question.statement.slice(0, 40)}`}
          question={question}
          index={index}
          showAnswers={showAnswers}
        />
      ))}
    </div>
  )
}
