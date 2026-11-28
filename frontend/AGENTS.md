# AGENTS.md — Frontend

## 1. Objetivo

Este diretório contém a interface web do **Exam Generator**, responsável por:

- enviar documentos PDF/TXT para indexação no backend;
- gerar questões objetivas e/ou subjetivas;
- gerar provas completas com distribuição por tipo;
- apresentar questões, gabarito, explicações e critérios de correção.

A entrega atual **não inclui** autenticação, multiusuário, aprovação persistida,
exportação de provas, listagem/remoção de documentos ou gestão de histórico.

## 2. Restrições do projeto

- **Não alterar `backend/`**, `backend/AGENTS.md`, `README.md` da raiz ou qualquer
  arquivo fora de `frontend/`.
- O backend é a fonte da verdade do contrato. Se houver divergência, adapte o
  frontend; nunca altere o backend para acomodar a interface.
- Não implementar funcionalidades fora do escopo atual sem autorização.
- Não versionar segredos, arquivos `.env`, `node_modules`, `dist` ou cobertura.
- O desenvolvimento ocorre na branch `feature/frontend-interface`, criada a
  partir de `develop`. A integração será feita por Pull Request para `develop`.
- Commits seguem Conventional Commits (`feat`, `fix`, `refactor`, `test`, `docs`,
  `chore`). Não fazer push nem merge em `develop` sem solicitação explícita.

## 3. Stack

- React 19 + TypeScript (modo estrito)
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui (preset `radix-nova`, ícones Lucide)
- React Router
- TanStack Query
- React Hook Form + Zod
- Axios
- Sonner para notificações
- Vitest + Testing Library + MSW

Gerenciador de pacotes: **npm**. Node.js compatível com o Vite atual (>= 20.19).

## 4. Execução

```bash
cd frontend
npm install
npm run dev
```

Scripts disponíveis:

| Comando | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Typecheck (`tsc -b`) e build de produção |
| `npm run typecheck` | Verificação de tipos |
| `npm run lint` | Oxlint |
| `npm test` | Testes em modo CI |
| `npm run test:watch` | Testes em watch |
| `npm run preview` | Pré-visualização do build |

### Backend necessário

O frontend não inicia o backend. Para o fluxo completo:

```bash
cd backend
uvicorn app.main:app --reload
```

O backend exige Ollama e o modelo `qwen3:1.7b` configurado em
`backend/app/services/llm.py`, além das dependências de `requirements.txt`.

### Variáveis de ambiente

Copie `.env.example` para `.env` quando necessário:

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:8000
```

- `VITE_API_BASE_URL`: URL base usada pelo Axios no navegador.
- `VITE_API_PROXY_TARGET`: destino do proxy do Vite em desenvolvimento.

O backend **não possui CORS**. Em desenvolvimento, use o proxy `/api` do Vite.
Em produção, configure proxy reverso ou defina `VITE_API_BASE_URL` com a URL
completa da API.

## 5. Contrato da API

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/` | — | `{ message: string }` |
| POST | `/documents/upload` | `multipart/form-data` com `file` (`.pdf`/`.txt`) | `{ message, document_id, filename, chunks_indexed }` |
| POST | `/questions/generate` | `{ query, types: ("multiple_choice" \| "subjective")[] }` | `QuestionResponse[]` |
| POST | `/exams/generate` | `{ title, query, quantity, multiple_choice, subjective }` | `{ title, questions: QuestionResponse[] }` |

Regras espelhadas no frontend:

- `types` deve ter entre 1 e 50 itens.
- Em `/exams/generate`: `quantity` entre 1 e 50 e
  `multiple_choice + subjective === quantity`.
- Upload aceita apenas PDF/TXT não vazio; o frontend limita a 20 MB.
- Erros do FastAPI podem vir como `detail` string (400/500) ou lista de
  validação (422). Use `normalizeApiError`.

### Limitações conhecidas do backend

- O RAG busca em **toda a coleção Chroma**, sem filtro por `document_id`.
- Não existe endpoint para listar ou remover documentos.
- O frontend armazena apenas os metadados do último upload no `localStorage`
  (`exam-generator:last-document`).
- A interface exibe aviso sobre a busca global; não simular escopo por documento.

## 6. Arquitetura do frontend

```text
src/
├── App.tsx                 # Providers, RouterProvider e Toaster
├── main.tsx                # Bootstrap React
├── index.css               # Tailwind v4 + tema shadcn
├── routes/                 # Configuração do React Router
├── pages/                  # Páginas por rota
├── components/
│   ├── layout/             # AppShell, badge de documento
│   ├── shared/             # PageHeader, ErrorAlert, CountField
│   └── ui/                 # Componentes gerados pelo shadcn/ui
├── features/
│   ├── documents/          # API, schemas, storage, context e componentes
│   ├── questions/          # API, schemas, formulário e resultados
│   └── exams/              # API, schemas, formulário e resultados
├── lib/
│   ├── api-client.ts       # Instância Axios centralizada
│   ├── api-error.ts        # Normalização de erros do FastAPI
│   ├── env.ts              # Leitura de variáveis Vite
│   ├── health.ts           # GET /
│   └── format.ts           # Formatação de tamanho de arquivo
├── providers/              # QueryClient e DocumentProvider
└── test/                   # Setup MSW, handlers e server
```

### Regras de camadas

- Componentes **não** fazem chamadas HTTP diretamente.
- Toda requisição passa por `src/lib/api-client.ts` e pelas APIs de cada feature.
- Valide entradas e respostas nas fronteiras com Zod.
- Não use `any`. Prefira tipos derivados dos schemas Zod.
- Estado de servidor fica no TanStack Query; estado do último documento fica no
  `DocumentProvider`. Não adicione lib global de estado sem necessidade.

## 7. Convenções de código

- UI e mensagens em **pt-BR**; identificadores de código em inglês.
- Componentes em `PascalCase`; arquivos em `kebab-case`.
- Hooks customizados com prefixo `use`.
- Use os componentes de `src/components/ui` do shadcn/ui; evite recriar
  primitivas. Alterações nesses arquivos devem ser justificadas.
- Use `cn` de `@/lib/utils` para composição de classes.
- Formulários usam React Hook Form + `zodResolver`; mensagens de erro devem ser
  exibidas inline e em toast quando fizer sentido.
- Toda ação assíncrona deve tratar loading, erro e sucesso.
- Mantenha acessibilidade: labels associados, textos alternativos, foco visível,
  navegação por teclado e `aria-live` para resultados.
- Nunca registre payloads sensíveis ou tokens no console.

## 8. Testes

- Testes unitários e de componentes com Vitest + Testing Library.
- Requisições simuladas com MSW em `src/test/handlers.ts`.
- Testes não devem depender do backend, Ollama ou rede externa.
- Cubra, no mínimo:
  - normalização de erros;
  - validações de upload, questões e prova;
  - persistência do documento;
  - chamadas de API com respostas simuladas;
  - renderização de questões objetivas/subjetivas e gabarito.
- Antes de concluir uma alteração, execute:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 9. Definição de pronto

- Funcionalidade integrada ao endpoint correspondente.
- Estados de carregamento, vazio e erro implementados.
- Validações alinhadas ao backend.
- Testes relevantes passando.
- `lint`, `typecheck`, `test` e `build` sem erros.
- Nenhum arquivo fora de `frontend/` alterado.
- Documentação atualizada quando o contrato ou a arquitetura mudar.
