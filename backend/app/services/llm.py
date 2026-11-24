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


FORMATS = {
    "multiple_choice": """{
    "questions": [
        {
            "statement": "Enunciado",
            "alternatives": {
                "A": "Alternativa A",
                "B": "Alternativa B",
                "C": "Alternativa C",
                "D": "Alternativa D",
                "E": "Alternativa E"
            },
            "correct_answer": "A",
            "explanation": "Explicação"
        }
    ]
}""",
    "subjective": """{
    "questions": [
        {
            "statement": "Enunciado",
            "expected_answer": "Resposta esperada",
            "grading_criteria": ["Critério 1", "Critério 2"]
        }
    ]
}""",
}

RULES = {
    "multiple_choice": (
        "Cada questão deve ter enunciado, cinco alternativas (A a E), "
        "resposta correta e explicação."
    ),
    "subjective": (
        "Cada questão deve ter enunciado, resposta esperada e critérios "
        "de correção. NÃO use alternativas."
    ),
}


def build_prompt(context: str, question_type: str, count: int) -> str:

    return f"""
Você é um gerador de questões acadêmicas.

Gere exatamente {count} questões do tipo {question_type},
utilizando exclusivamente as informações do contexto.

CONTEXTO:
{context}

REGRAS:
- {RULES[question_type]}
- Não invente informações fora do contexto.
- Retorne somente JSON válido.

FORMATO (repita o item para cada questão):

{FORMATS[question_type]}
"""


async def _generate_batch(
    context: str,
    question_type: str,
    count: int,
    retries: int = 2
) -> list[QuestionResponse]:

    prompt = build_prompt(context, question_type, count)
    last_error = None

    for _ in range(retries + 1):

        response = await client.chat(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            format="json",
            think=False,
            options={
                "temperature": 0.2
            }
        )

        try:
            data = json.loads(response["message"]["content"])
            items = data["questions"]

            if len(items) < count:
                raise ValueError(
                    f"Veio {len(items)} questão(ões), esperado {count}."
                )

            questions = []

            for item in items[:count]:
                # O código define o tipo, não o modelo
                item["type"] = question_type
                questions.append(QuestionResponse.model_validate(item))

            return questions

        except (ValueError, KeyError, TypeError) as e:
            last_error = e

    raise ValueError(
        f"Falha ao gerar questões {question_type}: {last_error}"
    )


async def generate_questions(
    request: BatchQuestionRequest
) -> list[QuestionResponse]:

    # 1. Recupera os trechos do documento selecionado
    context = retrieve_context(
        query=request.query,
        top_k=5
    )

    # 2. Uma chamada por tipo de questão
    pools: dict[str, list[QuestionResponse]] = {}

    for question_type in dict.fromkeys(request.types):
        count = request.types.count(question_type)
        pools[question_type] = await _generate_batch(
            context,
            question_type,
            count
        )

    # 3. Remonta na ordem pedida
    return [pools[t].pop(0) for t in request.types]


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