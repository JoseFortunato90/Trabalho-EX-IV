
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.rag import ingest_document

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Recebe um documento e o adiciona à base vetorial do RAG.
    """

    allowed_extensions = [".pdf", ".txt"]

    filename = file.filename or ""
    extension = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Formato não suportado. Envie um arquivo PDF ou TXT."
        )

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="O arquivo enviado está vazio."
            )

        result = ingest_document(
            filename=filename,
            content=content,
            extension=extension
        )

        return {
            "message": "Documento indexado com sucesso!",
            **result
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar documento: {str(e)}"
        )

    finally:
        await file.close()
