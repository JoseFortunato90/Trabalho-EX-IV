# Exam Generator — Frontend

Interface web em React + TypeScript para envio de documentos, geração de
questões e montagem de provas com apoio de RAG e LLM.

## Requisitos

- Node.js compatível com Vite
- Backend em execução (`uvicorn app.main:app --reload` a partir de `backend/`)
- Ollama com o modelo configurado no backend

## Execução

```bash
npm install
cp .env.example .env
npm run dev
```

O Vite encaminha `/api` para `http://localhost:8000` por padrão. O backend não
possui CORS; em produção, configure proxy reverso ou `VITE_API_BASE_URL`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

## Documentação

Consulte [`AGENTS.md`](./AGENTS.md) para arquitetura, contrato da API, convenções
de código e restrições do projeto.
