from pydantic import BaseModel, Field, model_validator
from typing import Literal

QuestionType = Literal["multiple_choice", "subjective"]


class BatchQuestionRequest(BaseModel):
    query: str
    types: list[QuestionType] = Field(min_length=1, max_length=50)


class QuestionResponse(BaseModel):
    type: QuestionType
    statement: str

    alternatives: dict[str, str] | None = None
    correct_answer: str | None = None
    explanation: str | None = None

    expected_answer: str | None = None
    grading_criteria: list[str] | None = None

    @model_validator(mode="after")
    def validate_question(self):
        if self.type == "multiple_choice":
            if not self.alternatives or not self.correct_answer:
                raise ValueError("Questão objetiva incompleta.")

            if self.correct_answer not in self.alternatives:
                raise ValueError("Resposta correta inválida.")

        elif self.type == "subjective":
            if not self.expected_answer or not self.grading_criteria:
                raise ValueError("Questão subjetiva incompleta.")

        return self