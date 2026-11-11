from fastapi import FastAPI

from app.routes import questions, exams, documents

app = FastAPI(
    title="Exam Generator API",
    description="API para geração de questões e provas utilizando RAG e Qwen",
    version="1.0.0"
)

app.include_router(documents.router)
app.include_router(questions.router)
app.include_router(exams.router)


@app.get("/")
def home():
    return {"message": "Exam Generator API funcionando!"}