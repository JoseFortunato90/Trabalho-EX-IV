from pydantic import BaseModel, Field, model_validator

from app.schemas.question import QuestionResponse


class ExamRequest(BaseModel):
    title: str
    query: str

    quantity: int = Field(ge=1, le=50)
    multiple_choice: int = Field(default=0, ge=0)
    subjective: int = Field(default=0, ge=0)

    @model_validator(mode="after")
    def validate_distribution(self):
        if self.multiple_choice + self.subjective != self.quantity:
            raise ValueError("Distribuição de questões inválida.")

        return self


class ExamResponse(BaseModel):
    title: str
    questions: list[QuestionResponse]