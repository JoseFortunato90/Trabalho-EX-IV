import { http, HttpResponse } from "msw"

function buildQuestion(type: "multiple_choice" | "subjective", index: number) {
  if (type === "multiple_choice") {
    return {
      type,
      statement: `Questão objetiva ${index + 1}`,
      alternatives: {
        A: "Alternativa A",
        B: "Alternativa B",
        C: "Alternativa C",
        D: "Alternativa D",
        E: "Alternativa E",
      },
      correct_answer: "A",
      explanation: "Explicação da questão.",
      expected_answer: null,
      grading_criteria: null,
    }
  }

  return {
    type,
    statement: `Questão subjetiva ${index + 1}`,
    alternatives: null,
    correct_answer: null,
    explanation: null,
    expected_answer: "Resposta esperada.",
    grading_criteria: ["Critério 1", "Critério 2"],
  }
}

export const handlers = [
  http.get("*/", () => {
    return HttpResponse.json({ message: "Exam Generator API funcionando!" })
  }),
  http.post("*/documents/upload", async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return HttpResponse.json(
        { detail: "Arquivo não enviado." },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      message: "Documento indexado com sucesso!",
      document_id: "document-test-id",
      filename: file.name,
      chunks_indexed: 4,
    })
  }),
  http.post("*/questions/generate", async ({ request }) => {
    const body = (await request.json()) as { types: string[] }

    return HttpResponse.json(
      body.types.map((type, index) =>
        buildQuestion(type as "multiple_choice" | "subjective", index),
      ),
    )
  }),
  http.post("*/exams/generate", async ({ request }) => {
    const body = (await request.json()) as {
      title: string
      multiple_choice: number
      subjective: number
    }

    const types = [
      ...Array.from({ length: body.multiple_choice }, () => "multiple_choice"),
      ...Array.from({ length: body.subjective }, () => "subjective"),
    ] as Array<"multiple_choice" | "subjective">

    return HttpResponse.json({
      title: body.title,
      questions: types.map((type, index) => buildQuestion(type, index)),
    })
  }),
]
