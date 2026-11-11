
import json

from ollama import AsyncClient

from app.schemas.question import (
    BatchQuestionRequest,
    QuestionResponse
)

from app.schemas.exam import (
    ExamRequest,
    ExamResponse
)

from app.services.rag import retrieve_context


MODEL = "qwen3:1.7b"

client = AsyncClient()


def build_prompt(context: str, types: list[str]) -> str:

    return f"""
Você é um gerador de questões acadêmicas.

Gere exatamente {len(types)} questões utilizando
exclusivamente as informações do contexto.

CONTEXTO:
{context}

TIPOS DAS QUESTÕES:
{json.dumps(types, ensure_ascii=False)}

Respeite rigorosamente a ordem dos tipos solicitados.

REGRAS:

1. Questões multiple_choice:
   - Enunciado.
   - Cinco alternativas (A, B, C, D, E).
   - Resposta correta.
   - Explicação da resposta.

2. Questões subjective:
   - Enunciado.
   - Resposta esperada.
   - Critérios de correção.

3. Não invente informações fora do contexto.
4. Não inclua subject ou topic.
5. Retorne somente JSON válido.

FORMATO:

{{
    "questions": [
        {{
            "type": "multiple_choice",
            "statement": "Enunciado",
            "alternatives": {{
                "A": "Alternativa A",
                "B": "Alternativa B",
                "C": "Alternativa C",
                "D": "Alternativa D",
                "E": "Alternativa E"
            }},
            "correct_answer": "A",
            "explanation": "Explicação"
        }},
        {{
            "type": "subjective",
            "statement": "Enunciado",
            "expected_answer": "Resposta esperada",
            "grading_criteria": [
                "Critério 1",
                "Critério 2"
            ]
        }}
    ]
}}
"""


async def generate_questions(
    request: BatchQuestionRequest
) -> list[QuestionResponse]:

    # 1. Recupera os trechos do documento selecionado
    context = retrieve_context(
    query=request.query,
    top_k=5
)
    # 2. Monta o prompt
    prompt = build_prompt(
        context=context,
        types=request.types
    )

    # 3. Envia para o Qwen
    response = await client.chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        format="json",
        options={
            "temperature": 0.2
        }
    )

    # 4. Converte a resposta JSON
    content = response["message"]["content"]
    data = json.loads(content)

    # 5. Valida as questões
    questions = [
        QuestionResponse.model_validate(question)
        for question in data["questions"]
    ]

    # 6. Verifica quantidade e ordem
    if len(questions) != len(request.types):
        raise ValueError(
            "Quantidade de questões retornada incorretamente."
        )

    for question, expected_type in zip(questions, request.types):
        if question.type != expected_type:
            raise ValueError(
                "O Qwen não respeitou a ordem dos tipos solicitados."
            )

    return questions


async def generate_exam(
    request: ExamRequest
) -> ExamResponse:

    # Define a distribuição das questões
    types = (
        ["multiple_choice"] * request.multiple_choice
        + ["subjective"] * request.subjective
    )

    # Reutiliza a geração de questões
    question_request = BatchQuestionRequest(
    query=request.query,
    types=types
    )
    questions = await generate_questions(question_request)

    return ExamResponse(
        title=request.title,
        questions=questions
    )
