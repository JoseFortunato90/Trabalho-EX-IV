
import uuid

from io import BytesIO
from pypdf import PdfReader

from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter


# Modelo de embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Banco vetorial
vectorstore = Chroma(
    collection_name="exame_docs",
    persist_directory="./chroma",
    embedding_function=embeddings
)

# Divisão dos documentos
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)


def extract_text(content: bytes, extension: str) -> str:

    if extension == ".pdf":
        reader = PdfReader(BytesIO(content))

        text = "\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    elif extension == ".txt":
        text = content.decode("utf-8")

    else:
        raise ValueError("Formato não suportado.")

    if not text.strip():
        raise ValueError("Não foi possível extrair texto do arquivo.")

    return text


def ingest_document(
    filename: str,
    content: bytes,
    extension: str
) -> dict:

    document_id = str(uuid.uuid4())

    text = extract_text(content, extension)

    document = Document(
        page_content=text,
        metadata={
            "source": filename,
            "document_id": document_id
        }
    )

    chunks = text_splitter.split_documents([document])

    if not chunks:
        raise ValueError("Não foi possível gerar chunks do documento.")

    chunk_ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    # Gera embeddings e armazena no ChromaDB
    vectorstore.add_documents(
        documents=chunks,
        ids=chunk_ids
    )

    return {
        "document_id": document_id,
        "filename": filename,
        "chunks_indexed": len(chunks)
    }


def retrieve_context(query: str, top_k: int = 5) -> str:

    documents = vectorstore.similarity_search(
        query=query,
        k=top_k
    )

    if not documents:
        raise ValueError("Nenhum documento relevante encontrado.")

    return "\n\n".join(
        document.page_content
        for document in documents
    )