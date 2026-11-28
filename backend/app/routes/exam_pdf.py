from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.schemas.exam import ExamRequest, ExamResponse
from app.services.llm import generate_exam  
from app.services.pdf import build_exam_pdf

router = APIRouter(prefix="/exams", tags=["Exam PDF"])


def _pdf_response(pdf: bytes) -> Response:
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="prova.pdf"'},
    )


@router.post("/pdf")
async def generate_exam_pdf(request: ExamRequest, include_answer_key: bool = True):
    """Gera o exame com o LLM e devolve o PDF."""
    try:
        exam = await generate_exam(request)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    return _pdf_response(build_exam_pdf(exam, include_answer_key))


@router.post("/pdf/from-exam")
def exam_to_pdf(exam: ExamResponse, include_answer_key: bool = True):
    """Converte um exame já gerado em PDF, sem chamar o LLM de novo."""
    return _pdf_response(build_exam_pdf(exam, include_answer_key))