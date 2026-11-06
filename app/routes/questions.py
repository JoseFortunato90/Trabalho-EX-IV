from fastapi import APIRouter, HTTPException

from app.schemas.question import (
    BatchQuestionRequest,
    QuestionResponse
)

from app.services.llm import generate_questions


router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


@router.post("/generate", response_model=list[QuestionResponse])
async def create_questions(request: BatchQuestionRequest):
    """
    Gera questões objetivas e/ou subjetivas.
    O contexto é recuperado automaticamente pelo RAG.
    """

    try:
        questions = await generate_questions(request)
        return questions

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar questões: {str(e)}"
        )