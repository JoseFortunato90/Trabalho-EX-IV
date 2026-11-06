from fastapi import APIRouter, HTTPException

from app.schemas.exam import ExamRequest, ExamResponse

from app.services.llm import generate_exam


router = APIRouter(
    prefix="/exams",
    tags=["Exams"]
)


@router.post("/generate", response_model=ExamResponse)
async def create_exam(request: ExamRequest):
    """
    Gera uma prova completa utilizando o RAG e o Qwen.
    """

    try:
        exam = await generate_exam(request)
        return exam

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao gerar prova: {str(e)}"
        )